import React, { Component } from 'react';
import {
	View,
	Alert,
	ActivityIndicator,
	Dimensions,
	AsyncStorage
} from 'react-native';
import { Container, Header, Content, Item, Input, Label, Button, Text, Title, Left, Icon, Right, Body } from 'native-base';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import { ActionPicker } from 'react-native-action-picker';
import { ADD_TASK } from '../../configs/api';

import axios from 'axios';
import colors from '../../constants/colors';
import moment from 'moment';

export default class AddTodo extends Component {

	constructor(props){
    super(props);
    this.state = {
			user: {},
			task: '',
			due: '',
			pickerCategory: '',
			category: '',
			dueDate: null,
			listCategory: [
				{ label: 'New Category', action: () => this.setCategory('New Category') }
			],
			categoryStorage: [],
			categoryModal: false,
			isLoading: false,
		}
	}
	
	componentWillMount() {
		this.getDataUserStorage();
		this.getDataCategoryStorage();
	}
	
	getDataUserStorage = () => {
		AsyncStorage.getItem('user')
		 .then((result) => {
			let user = JSON.parse(result);
			this.setState({
				user: user
			});
		 })
		 .catch((error) => {
			 console.log('AsyncStorage save error: ' + error);
		 });
 	}

	getDataCategoryStorage = () => {
		AsyncStorage.getItem('category')
		 .then((result) => {
			let category = JSON.parse(result);
			this.state.categoryStorage = category == null ? [] : category;
			const data = this.state.listCategory;
			category.forEach((item) => {
				data.push({
					label: item, 
					action: () => this.setCategory(item)
				});
			});
			this.state.listCategory = data;
		 })
		 .catch((error) => {
			 console.log('AsyncStorage save error: ' + error);
		 });
	}

	saveCategoryToStorage = async (data) => {
		try {
			await AsyncStorage.setItem('category', JSON.stringify(data));
		} catch (error) {
			console.log('AsyncStorage save error: ' + error.message);
		}
	}

	onDuePress = () => {
    let dueDate = this.state.dueDate;

    if(!dueDate || dueDate == null){
      dueDate = new Date();
      this.setState({
        dueDate: dueDate
      });
    }

    this.refs.dueDialog.open({
      date: dueDate,
      maxDate: new Date()
		});
	}

	onDueDatePicked = (date) => {
    this.setState({
      dueDate: date,
      due: moment(date).format('MM-DD-YYYY')
    });
	}
	
	toggleCategoryModal = () => {
    this.setState({ categoryModal: !this.state.categoryModal });
	};

	setCategory = (value) => {
		this.setState({
			pickerCategory: value
		}, () => this.toggleCategoryModal());
	};
	 
	categoryExists(array, value) {
		return array.some((item) => {
			return item === value;
		}); 
	}
	
	add = () => {
		const { task, dueDate, pickerCategory, category, user } = this.state;
		if (task == '' || dueDate == '' || pickerCategory == '') {
			Alert.alert('Warning', 'Form input can\'t be empty!');
		} else if (pickerCategory == 'New Category' && category == '') {
			Alert.alert('Warning', 'Form input can\'t be empty!');
		} else {
			let cat = '';
			if (pickerCategory == 'New Category') {
				cat = category;
				const catList = this.state.categoryStorage;
				if (!this.categoryExists(catList, cat)) {
					catList.push(cat);
				}
				this.saveCategoryToStorage(catList);
			} else {
				cat = pickerCategory;
			}
			this.setState({ isLoading: true });
			axios.post(ADD_TASK, {
				userId: user._id,
				status: false,
				task: task,
				dueDate: dueDate,
				category: cat
      })
			.then((response) => {
				console.log(response);
				this.setState({ isLoading: false });
				const data = response.data;
				if (data.success) {
					const { navigation } = this.props;
					navigation.goBack();
					navigation.state.params.onRefresh(user._id);
					Alert.alert('Success', data.message);
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
	}
	
  render() {
    return (
			<Container style={{ backgroundColor: colors.primaryDark }}>
				<Header style={{ borderBottomWidth: 0, backgroundColor: colors.primaryDark, elevation: 0 }}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}>
							<Icon ios="ios-arrow-back" android="md-arrow-back" style={{ color: colors.white }}/>
            </Button>
          </Left>
          <Body>
            <Title style={{ color: colors.white }}>Add Todo</Title>
          </Body>
          <Right />
        </Header>
				<Container style={{ paddingHorizontal: '10%' }}>
					<Item style={{ marginBottom: 8 }}>
						<Input onChangeText={(task) => this.setState({task})} value={this.state.task} placeholderTextColor={colors.greyLight} placeholder="Task" style={{ fontSize: 20, color: colors.greyLight }} />
					</Item>
					<Item style={{ marginBottom: 8 }}>
						<Input editable={false} onFocus={this.onDuePress.bind(this)} value={this.state.due} placeholderTextColor={colors.greyLight} placeholder="Due Date" style={{ fontSize: 20, color: colors.greyLight }} />
						<Button onPress={this.onDuePress.bind(this)} style={{ backgroundColor: colors.white }}>
							<Text style={{ color: colors.primaryDark }}>Pick</Text>
						</Button>
					</Item>
					<Item style={{ marginBottom: 8 }}>
						<Input editable={false} value={this.state.pickerCategory} placeholderTextColor={colors.greyLight} placeholder="Category" style={{ fontSize: 20, color: colors.greyLight }} />
						<Button onPress={this.toggleCategoryModal.bind(this)} style={{ backgroundColor: colors.white }}>
							<Text style={{ color: colors.primaryDark }}>Pick</Text>
						</Button>
					</Item>
					{
						this.state.pickerCategory == 'New Category' &&
						(
							<Item style={{ marginBottom: 8 }}>
								<Input onChangeText={(category) => this.setState({category})} value={this.state.category} placeholderTextColor={colors.greyLight} placeholder="Category" style={{ fontSize: 20, color: colors.greyLight }} />
							</Item>
						)
					}
					<Button onPress={this.add.bind(this)} block style={{ width: '100%', borderRadius: 5, backgroundColor: colors.white, marginTop: 16 }}>
						<Text uppercase={false} style={{ fontSize: 18, fontWeight: '100', color: colors.primaryDark }}>Add</Text>
					</Button>
				</Container>
				<DatePickerDialog ref="dueDialog" onDatePicked={this.onDueDatePicked.bind(this)} />
				<ActionPicker
          options={this.state.listCategory}
          isVisible={this.state.categoryModal}
          onCancelRequest={this.toggleCategoryModal} />
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