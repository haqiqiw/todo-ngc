import React, { Component } from 'react';
import {
  View,
	AsyncStorage,
	StyleSheet,
	Alert,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import { Container, Header, Content, List, ListItem, Title, Left, Body, Right, CheckBox, Text, Button, Icon, Input, Item } from 'native-base';
import TodoListItem from './TodoListItem';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import { TASK_BY_USER, TASK_BY_ID } from '../../configs/api';

import colors from '../../constants/colors';
import axios from 'axios';

export default class TodoList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			user: {},
			list: [],
			groupList: [],
			text: '',
			isLoading: false
		}

    this.onRemove = this.onRemove.bind(this);
    this.onChecked = this.onChecked.bind(this);
	}

	componentWillMount() {
		this.getDataUserStorage();
	}

	onRefresh = (id) => {
		this.fetchDataListByUser(id);
  };

	goToAddTodo = () =>  {
		const { navigate } = this.props.navigation;
		navigate('AddTodo', { onRefresh: this.onRefresh });
	}

	getDataUserStorage = () => {
		AsyncStorage.getItem('user')
		 .then((result) => {
			let user = JSON.parse(result);
			this.setState({
				user: user
			}, () => this.fetchDataListByUser(user._id))
		 })
		 .catch((error) => {
			 console.log('AsyncStorage save error: ' + error);
		 });
	 }
	 
	categoryExists(array, value) {
		return array.some((item) => {
			return item === value;
		}); 
	}

 	fetchDataListByUser = (id) => {
		this.setState({ isLoading: true });
		axios.get(TASK_BY_USER + id)
		.then((response) => {
			console.log(response);
			const data = response.data;
			let groupList = [];
			let groupListNew = [];
			let category = [];
			data.data.forEach((item) => {
				if (!this.categoryExists(category, item.category)) {
					category.push(item.category);
					groupList[item.category] = [];
				}
				groupList[item.category].push(item);
			});
			category.forEach((item) => {
				groupListNew.push({
					category: item,
					task: groupList[item]
				})
			});
			if (data.success) {
				this.setState({ 
					isLoading: false,
					list: data.data,
					groupList: groupListNew
				});
			} else {
				Alert.alert('Failed', data.message);
			}
		})
		.catch((error) => {
			console.log(error);
			this.setState({ isLoading: false });
			Alert.alert('Error', error);
		});
	}

	saveCategoryToStorage = async (data) => {
		try {
			await AsyncStorage.setItem('category', JSON.stringify(data));
		} catch (error) {
			console.log('AsyncStorage save error: ' + error.message);
		}
	}

	onRemove = (id) => {
		this.setState({ isLoading: true });
		axios.delete(TASK_BY_ID + id)
		.then((response) => {
			console.log(response);
			const data = response.data;
			if (data.success) {
				this.fetchDataListByUser(this.state.user._id);
			} else {
				Alert.alert('Failed', data.message);
			}
		})
		.catch((error) => {
			console.log(error);
			this.setState({ isLoading: false });
			Alert.alert('Error', error);
		});
	}

	onChecked = (index, id) => {
		let item = this.state.list[index];
		const status = !item.status;
		this.setState({ isLoading: true });
		axios.put(TASK_BY_ID + id, {
			status: status,
  		task: item.task
		})
		.then((response) => {
			console.log(response);
			this.setState({ isLoading: false });
			const data = response.data;
			if (data.success) {
				this.fetchDataListByUser(this.state.user._id);
			} else {
				Alert.alert('Failed', data.message);
			}
		})
		.catch((error) => {
			console.log(error);
			this.setState({ isLoading: false });
			Alert.alert('Error', error);
		});
	}

	logout = () => {
		Alert.alert(
			'Warning',
			'Are you sure to logout ?',
			[
				{text: 'Yes', onPress: () => this.removeUserToStorage()},
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			],
			{ cancelable: false }
		)
	}

	goToLogin = () =>  {
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Login' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	removeUserToStorage = async () => {
		try {
			await AsyncStorage.removeItem('user', () => this.goToLogin());
		} catch (error) {
			console.log('AsyncStorage save error: ' + error.message);
		}
	}

  render() {
    return (
			<Container>
        <Header>
          <Left>
						<Button
              transparent
              onPress={this.logout.bind(this)}>
							<Icon ios="ios-log-out" android="md-log-out" style={{ color: colors.primaryDark }}/>
            </Button>
					</Left>
          <Body>
            <Title>Todo{this.state.groupList.length}</Title>
          </Body>
          <Right>
						<Button
              transparent
              onPress={this.goToAddTodo.bind(this)}>
							<Icon ios="ios-add" android="md-add" style={{ color: colors.primaryDark }}/>
            </Button>
					</Right>
        </Header>
        <Content style={{ backgroundColor: colors.bgLight }}>
					<View style={{ width: '100%' }}>
						<Accordion
							underlayColor={'rgba(52, 52, 52, 0.2)'}
							sections={this.state.groupList}
							renderHeader={(section, i, isActive) => {
								return (
									<View style={{ width: '100%', paddingVertical: 16, paddingHorizontal: 16, backgroundColor: colors.primaryLight, borderBottomWidth: 1, borderColor: colors.white  }}>
										<Text style={{ color: colors.white, fontSize: 18 }} numberOfLines={1}>{section.category}</Text>
									</View> 
								)
							}}
							renderContent={(section, i, isActive) => {
								return (
									<List style={{ backgroundColor: colors.white }}>
									{
										section.task.map((item, i) => {
											return (
												<TodoListItem onChecked={() => this.onChecked(i, item._id)} onPress={() => this.onRemove(item._id)} rowData={item} key={i} />
											)
										}) 
									}
									</List>
								)
							}}
							duration={400} />
					</View>	
        </Content>
				{
          this.state.isLoading &&
            (
              <Container style={{
								top: 0,
								bottom: 0,
								right: 0,
								left: 0,
                backgroundColor: 'rgba(240,240,240,0.6)',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 99
              }}>
                <ActivityIndicator
                  size="large"
                />
              </Container>
            )
        }
      </Container>
    );
  }
}