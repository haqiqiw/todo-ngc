import React, { Component } from 'react';
import {
	View,
	Alert,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import { Container, Header, Content, Item, Input, Label, Button, Text, Title, Left, Icon, Right, Body } from 'native-base';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import { ActionPicker } from 'react-native-action-picker';
import { REGISTER } from '../../configs/api';

import axios from 'axios';
import colors from '../../constants/colors';
import moment from 'moment';

export default class SignUp extends Component {

	constructor(props){
    super(props);
    this.state = {
			username: '',
			dob: '',
			gender: '',
			password: '',
			dobDate: null,
			genderModal: false,
			isLoading: false,
		}
	}

	onDOBPress = () => {
    let dobDate = this.state.dobDate;

    if(!dobDate || dobDate == null){
      dobDate = new Date();
      this.setState({
        dobDate: dobDate
      });
    }

    this.refs.dobDialog.open({
      date: dobDate,
      maxDate: new Date()
		});
	}

	onDOBDatePicked = (date) => {
    this.setState({
      dobDate: date,
      dob: moment(date).format('MM-DD-YYYY')
    });
	}
	
	toggleGenderModal = () => {
    this.setState({ genderModal: !this.state.genderModal });
	};

	setGender = (value) => {
		this.setState({
			gender: value
		}, () => this.toggleGenderModal());
  };

	
	createOptions = () => {
    return [
      { label: 'Male', action: () => this.setGender('Male') },
      { label: 'Female', action: () => this.setGender('Female') }
    ];
	}

	passwordValid = (password) => {
    return password.length >= 8 && password.search(/\d/) != -1 && /[a-z]/.test(password) && /[A-Z]/.test(password);
  }
	
	register = () => {
		const { username, dob, gender, password } = this.state;
		if (username == '' || dob == '' || gender == '' || password == '') {
			Alert.alert('Warning', 'Form input can\'t be empty!');
		} else if (username.length < 5) {
      Alert.alert('Warning', 'Username should at least 5 characters');
    } else if (!this.passwordValid(password)) {
      Alert.alert('Warning', 'Password should at least 8 characters and contain number, letter, capital letter ');
    } else {
			this.setState({ isLoading: true });
			axios.post(REGISTER, {
				username: username,
				password: password,
				gender: gender,
				birthdate: dob
      })
			.then((response) => {
				console.log(response);
				this.setState({ isLoading: false });
				const data = response.data;
				if (data.success) {
					this.props.navigation.goBack();
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
            <Title style={{ color: colors.white }}>Register</Title>
          </Body>
          <Right />
        </Header>
				<Container style={{ paddingHorizontal: '10%' }}>
					<Item style={{ marginBottom: 8 }}>
						<Input onChangeText={(username) => this.setState({username})} value={this.state.username} placeholderTextColor={colors.greyLight} placeholder="Username" style={{ fontSize: 20, color: colors.greyLight }} />
					</Item>
					<Item style={{ marginBottom: 8 }}>
						<Input editable={false} onFocus={this.onDOBPress.bind(this)} value={this.state.dob} placeholderTextColor={colors.greyLight} placeholder="Birthdate" style={{ fontSize: 20, color: colors.greyLight }} />
						<Button onPress={this.onDOBPress.bind(this)} style={{ backgroundColor: colors.white }}>
							<Text style={{ color: colors.primaryDark }}>Pick</Text>
						</Button>
					</Item>
					<Item style={{ marginBottom: 8 }}>
						<Input editable={false} value={this.state.gender} placeholderTextColor={colors.greyLight} placeholder="Gender" style={{ fontSize: 20, color: colors.greyLight }} />
						<Button onPress={this.toggleGenderModal.bind(this)} style={{ backgroundColor: colors.white }}>
							<Text style={{ color: colors.primaryDark }}>Pick</Text>
						</Button>
					</Item>
					<Item style={{ marginBottom: 8 }}>
						<Input secureTextEntry onChangeText={(password) => this.setState({password})} value={this.state.password} placeholderTextColor={colors.greyLight} placeholder="Password" style={{ fontSize: 20, color: colors.greyLight }} />
					</Item>
					<Button onPress={this.register.bind(this)} block style={{ width: '100%', borderRadius: 5, backgroundColor: colors.white, marginTop: 16 }}>
						<Text uppercase={false} style={{ fontSize: 18, fontWeight: '100', color: colors.primaryDark }}>Register</Text>
					</Button>
				</Container>
				<DatePickerDialog ref="dobDialog" onDatePicked={this.onDOBDatePicked.bind(this)} />
				<ActionPicker
          options={this.createOptions()}
          isVisible={this.state.genderModal}
          onCancelRequest={this.toggleGenderModal} />
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