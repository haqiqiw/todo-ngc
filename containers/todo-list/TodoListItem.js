import React, { Component } from 'react';
import {
  View
} from 'react-native';
import { Container, Header, Content, List, ListItem, Left, Body, Right, CheckBox, Text, Button, Icon } from 'native-base';
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
			<ListItem icon>
				<Left style={{ marginRight: 16 }}>
					<CheckBox onPress={this.props.onChecked} checked={item.checked} color={colors.primaryDark} />
				</Left>
				<Body>
					<Text>{item.task}</Text>
				</Body>
				<Right style={{ justifyContent: 'center' }}>
					<Button onPress={this.props.onPress} style={{ backgroundColor: colors.primary }} iconRight rounded small>
						<Text>Remove</Text>
					</Button>
				</Right>
			</ListItem>
    );
  }
}
