import React from 'react';
import { StackNavigator } from 'react-navigation';

import Login from '../containers/login';
import Register from '../containers/register';
import TodoList from '../containers/todo-list';
import AddTodo from '../containers/add-todo';

export const Router = StackNavigator({
	Login: {
		screen: Login,
		navigationOptions: {
      header: null
		}
	},
	Register: {
		screen: Register,
		navigationOptions: {
      header: null
		}
	},
	TodoList: {
		screen: TodoList,
		navigationOptions: {
      header: null
		}
	},
	AddTodo: {
		screen: AddTodo,
		navigationOptions: {
      header: null
		}
	},
}, { initialRouteName: 'Login'});