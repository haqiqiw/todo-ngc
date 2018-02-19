import React, { Component } from 'react';
import {
	View,
	Alert,
	ActivityIndicator,
	Dimensions,
	AsyncStorage
} from 'react-native';
import { NavigationActions } from 'react-navigation'
import { Container, Content, Item, Input, Button, Text } from 'native-base';
import { LOGIN } from '../../configs/api';

import colors from '../../constants/colors';
import axios from 'axios';

export default class Login extends Component {

	constructor(props){
    super(props);
    this.state = {
			username: '',
			password: '',
			isLoading: false,
      loginLoading: true
		}
	}

	componentWillMount() {
		this.getDataUserStorage();
	}

	getDataUserStorage = () => {
		AsyncStorage.getItem('user')
		 	.then((result) => {
				this.setState({ loginLoading: false })
				if(result != null) {
					this.goToTodoList();
				}
			})
		 	.catch((error) => {
				this.setState({ loginLoading: false })
			 	console.log('AsyncStorage save error: ' + error);
		 });
 	}
	
	goToRegister = () =>  {
		const { navigate } = this.props.navigation;
		navigate('Register');
	}

	goToTodoList = () =>  {
		const resetAction = NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'TodoList' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	saveUserToStorage = async (data) => {
		try {
			await AsyncStorage.setItem('user', JSON.stringify(data));
		} catch (error) {
			console.log('AsyncStorage save error: ' + error.message);
		}
	}

	login = () => {
		const { username, password } = this.state;
		if (username === '' || password === '') {
			Alert.alert('Username and password can\'t be empty!');
		} else {
			this.setState({ isLoading: true });
			axios.post(LOGIN, {
				username: username,
				password: password
			})
			.then((response) => {
				console.log(response);
				this.setState({ isLoading: false });
				const data = response.data;
				if (data.success) {
					this.saveUserToStorage(data.data);
					this.goToTodoList();
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
    if (this.state.loginLoading) {
      return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator
						color={colors.primary}
						size="large" />
				</View>
			)
		}
		
    return (
			<Container style={{ backgroundColor: colors.bgLight }}>
				<Container style={{ paddingHorizontal: '10%', paddingTop: 48, justifyContent: 'center' }}>
					<Item style={{ marginBottom: 8 }}>
						<Input onChangeText={(username) => this.setState({username})} placeholderTextColor={colors.greyLight} placeholder="Username" style={{ fontSize: 20, color: colors.greyLight }} />
					</Item>
					<Item style={{ marginBottom: 8 }}>
						<Input onChangeText={(password) => this.setState({password})} secureTextEntry placeholderTextColor={colors.greyLight} placeholder="Password" style={{ fontSize: 20, color: colors.greyLight }} />
					</Item>
					<Button onPress={this.login.bind(this)} block style={{ borderRadius: 5, backgroundColor: colors.primaryDark, marginTop: 16 }}>
						<Text uppercase={false} style={{ fontSize: 18, fontWeight: '100' }}>Login</Text>
					</Button>
					<Button onPress={this.goToRegister.bind(this)} transparent block style={{ marginTop: 16 }}>
						<Text uppercase={false} style={{ fontSize: 14, fontWeight: '100', color: colors.primaryDark }}>Don't have an account ?</Text>
					</Button>
				</Container>
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