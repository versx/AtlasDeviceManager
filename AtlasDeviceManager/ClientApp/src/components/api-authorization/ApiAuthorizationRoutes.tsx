import React, { Component } from 'react';
import { Login } from './Login'
import { Logout } from './Logout'
import { ApplicationPaths, LoginActions, LogoutActions } from './ApiAuthorizationConstants';

const ApiAuthorizationRoutes = [
  {
    path: ApplicationPaths.Login,
    requireAuth: false,
    element: loginAction(LoginActions.Login),
    key: LoginActions.Login,
  },
  {
    path: ApplicationPaths.LoginFailed,
    requireAuth: false,
    element: loginAction(LoginActions.LoginFailed),
    key: LoginActions.LoginFailed,
  },
  {
    path: ApplicationPaths.LoginCallback,
    requireAuth: false,
    element: loginAction(LoginActions.LoginCallback),
    key: LoginActions.LoginCallback,
  },
  {
    path: ApplicationPaths.Profile,
    requireAuth: true,
    element: loginAction(LoginActions.Profile),
    key: LoginActions.Profile,
  },
  {
    path: ApplicationPaths.Register,
    requireAuth: false,
    element: loginAction(LoginActions.Register),
    key: LoginActions.Register,
  },
  {
    path: ApplicationPaths.LogOut,
    requireAuth: false,
    element: logoutAction(LogoutActions.Logout),
    key: LogoutActions.Logout,
  },
  {
    path: ApplicationPaths.LogOutCallback,
    requireAuth: false,
    element: logoutAction(LogoutActions.LogoutCallback),
    key: LogoutActions.LogoutCallback,
  },
  {
    path: ApplicationPaths.LoggedOut,
    requireAuth: false,
    element: logoutAction(LogoutActions.LoggedOut),
    key: LogoutActions.LoggedOut,
  }
];

function loginAction(name: any) {
  return <Login action={name}></Login>;
}

function logoutAction(name: any) {
  return <Logout action={name}></Logout>;
}

export default ApiAuthorizationRoutes;
