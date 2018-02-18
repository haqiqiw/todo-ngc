import React, { Component } from 'react';
import {
  View
} from 'react-native';
import { ListItem, Item, Left, Body, Right, CheckBox, Text, Button, Icon } from 'native-base';
import colors from '../../constants/colors';

export default class TodoListItem extends Component {

	constructor(props) {
		super(props);

		this.state = {
			checked: this.props.rowData.checked
		}
	}

  render() {
		const item = this.props.rowData;
    return (
			<ListItem icon style={{ marginVertical: 8 }}>
				<Left style={{ marginRight: 16 }}>
					<CheckBox onPress={this.props.onChecked} checked={item.status} color={colors.primaryDark} />
				</Left>
				<Body>
					<Text numberOfLines={1}>{item.task}</Text>
					<Text numberOfLines={1}>{item.dueDate}</Text>
				</Body>
				<Right style={{ justifyContent: 'center' }}>
					<Button
						transparent
						onPress={this.props.onPress}>
						<Icon ios="ios-trash" android="md-trash" style={{ color: colors.primaryDark }}/>
					</Button>
				</Right>
			</ListItem>
    );
  }
}
