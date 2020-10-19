import React, { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import * as R from 'ramda'

import UsersTableFilterWrapper from '@webapp/app/user/userManagement/list/usersTableFilterWrapper'
import UsersCount from './usersCount'

import EditUserForm from '@webapp/app/user/userManagement/edit/editUserForm'

import { fetchAllUsers, removeUser, sendInvitationEmail } from '../../user/userManagement/actions'
import { administrator } from '@common/countryRole'

import * as AppState from '@webapp/app/appState'
import * as UserState from '@webapp/user/userState'
import * as UserManagementState from '@webapp/app/user/userManagement/userManagementState'

const UsersManagementView = props => {
  const {
    fetchAllUsers,
    editUserStatus,
    i18n,
    allUsers,
    userCounts,
  } = props
  const countryIso = useSelector(AppState.getCountryIso)
  const [editingUserId, setEditingUserId] = useState(null)

  useEffect(() => {
    fetchAllUsers()
  }, [])

  useEffect(() => {
    if (editingUserId && editUserStatus == 'completed') {
      setEditingUserId(null)
      fetchAllUsers()
    }
  }, [editUserStatus])

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     editUserStatus: null,
  //     editingUserId: null
  //   }
  // }
  if (editingUserId) {
    return <EditUserForm userId={editingUserId}
                         countryIso={countryIso}
                         onCancel={userId => setEditingUserId(null)}
    />
  }

  return <>
    <UsersTableFilterWrapper {...props}
                             isAdminTable={true}
                             users={allUsers}
                             onEditClick={userId => setEditingUserId(userId)}/>
    <UsersCount i18n={i18n} userCounts={userCounts}/>
  </>
}

const mapStateToProps = (state) => ({
  i18n: AppState.getI18n(state),
  userInfo: UserState.getUserInfo(state),
  allUsers: UserManagementState.getAllUsers(state),
  userCounts: UserManagementState.getUserCounts(state),
  editUserStatus: UserManagementState.getEditUserStatus(state),
  countries: R.path(['country', 'countries', administrator.role], state)
})

export default connect(
  mapStateToProps,
  { fetchAllUsers, removeUser, sendInvitationEmail }
)(UsersManagementView)
