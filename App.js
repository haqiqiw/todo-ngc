import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import TodoList from './containers/todo-list';

export default class App extends Component {
  render() {
    return (
      <TodoList />
    );
  }
}