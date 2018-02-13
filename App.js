import React, { Component } from 'react';
import { Container } from 'native-base';
import { Router } from './configs/router';

export default class App extends Component {
  render() {
    return (
      <Container>
        <Router />
      </Container>
    );
  }
}