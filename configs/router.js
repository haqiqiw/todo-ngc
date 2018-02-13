import React from 'react';
import { StackNavigator } from 'react-navigation';

import TodoList from '../containers/todo-list';

export const Router = StackNavigator({
	TodoList: {
		screen: TodoList,
		navigationOptions: {
      header: null
		}
	},
}, { initialRouteName: 'TodoList'});