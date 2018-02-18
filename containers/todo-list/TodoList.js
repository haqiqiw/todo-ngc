import React, { Component } from 'react';
import {
  View,
	AsyncStorage,
	StyleSheet
} from 'react-native';
import { Container, Header, Content, List, ListItem, Title, Left, Body, Right, CheckBox, Text, Button, Icon, Input, Item } from 'native-base';
import colors from '../../constants/colors';
import TodoListItem from './TodoListItem';

export default class TodoList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			text: ''
		}

    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onChecked = this.onChecked.bind(this);
	}

	componentWillMount() {
		this.getDataStorage();
	}

	onAdd() {
		let text = this.state.text;
		if (text !== '' & text !== null) {
			let data = this.state.data;
			data.push({
				id: data.length + 1,
				task: text,
				checked: false
			});
			this.setState({
				data: data,
				text: ''
			}, () => this.saveToStorage(data));
		}
	}

	getDataStorage() {
	 	AsyncStorage.getItem('list')
      .then((result) => {
        let data = JSON.parse(result)
				this.setState({
					data: data
				})
      })
			.catch((error) => {
				console.log('AsyncStorage save error: ' + error);
			});
	}

	async saveToStorage(data) {
		try {
			await AsyncStorage.setItem('list', JSON.stringify(data));
		} catch (error) {
			console.log('AsyncStorage save error: ' + error.message);
		}
	}

	onRemove(index) {
		let data = this.state.data;
		data.splice(index, 1);
		this.setState({
			data: data
		}, () => this.saveToStorage(data));
	}

	onChecked(index) {
		let data = this.state.data;
		let item = data[index];
		item.checked = !item.checked;
		this.setState({
			data: data
		}, () => this.saveToStorage(data));
	}

  render() {
    return (
			<Container>
        <Header>
          <Left />
          <Body>
            <Title>Todo</Title>
          </Body>
          <Right />
        </Header>
        <Content>
					<Item style={{ marginLeft: 16, marginRight: 16, marginVertical: 16 }}>
						<Input onChangeText={(text) => this.setState({text})} value={this.state.text} placeholderTextColor={colors.greyLight} placeholder="Task" style={{ fontSize: 20, color: colors.greyLight }} />
						<Button onPress={() => this.onAdd()} style={{ backgroundColor: colors.primaryDark }}>
							<Text>Add</Text>
						</Button>
					</Item>
          <List style={{ marginRight: 16 }}>
						{
              this.state.data.map((item, i) => {
                return (
									<TodoListItem onChecked={() => this.onChecked(i)} onPress={() => this.onRemove(i)} rowData={item} key={i} />
                );
              })
            }
          </List>
        </Content>
      </Container>
    );
  }
}