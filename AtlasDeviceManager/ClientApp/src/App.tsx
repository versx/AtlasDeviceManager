import React, { Component } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import AuthorizeRoute from './components/api-authorization/AuthorizeRoute';
import { Layout } from './components/Layout';
import './custom.css';

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Routes>
          {AppRoutes.map((route: any) => {
            const { element, requireAuth, ...rest } = route;
            return (
              <Route
                {...rest}
                element={
                  requireAuth
                    ? <AuthorizeRoute {...rest} element={element} />
                    : element
                }
              />);
          })}
         </Routes>
       </Layout>
    );
  }
}
