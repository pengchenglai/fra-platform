import './components/style.less'

import React from 'react'
import { Route } from 'react-router-dom'

import * as BasePaths from '@webapp/main/basePaths'

import Header from '@webapp/components/Header'
import Partners from '@webapp/components/Partners'

import LoginForm from './components/loginForm'
import ResetPasswordForm from './components/resetPasswordForm'

const LoginView = () => (
  <div className="app-view">
    <Header />
    <div>
      <div className="login">
        <Route exact path={BasePaths.resetPassword}>
          <ResetPasswordForm />
        </Route>

        <Route exact path={BasePaths.login}>
          <LoginForm />
        </Route>

        <img alt="" src="/img/tucan.svg" className="login__tucan" />
      </div>
      <Partners />
    </div>
  </div>
)

export default LoginView
