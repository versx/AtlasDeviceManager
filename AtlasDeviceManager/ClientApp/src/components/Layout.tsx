import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export interface LayoutProps {
    children: any;
}

export class Layout extends Component<LayoutProps> {
  static displayName = Layout.name;

  constructor(props: LayoutProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <NavMenu />
        <Container tag="main">
          {this.props.children}
        </Container>
      </div>
    );
  }
}
