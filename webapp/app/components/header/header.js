import './header.less'
import React from 'react'
import { Link } from 'react-router-dom'

import * as BasePaths from '@webapp/main/basePaths'

import { useI18n, useUserInfo } from '@webapp/components/hooks'

import UserInfoLinks from './components/userInfo'
import LanguageSelection from './components/languageSelection'
import AutoSaveStatusText from './components/autoSaveStatusText'

const Header = () => {
  const userInfo = useUserInfo()
  const i18n = useI18n()

  return (
    <div className="app-header no-print">
      <div />

      <AutoSaveStatusText />

      <div className="app-header__menu">
        <LanguageSelection />
        <UserInfoLinks />
        {!userInfo && (
          <Link key="admin-link" to={BasePaths.login} className="app-header__menu-item">
            {i18n.t('common.login')}
          </Link>
        )}
      </div>
    </div>
  )
}

export default Header
