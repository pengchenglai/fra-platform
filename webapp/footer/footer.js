import './style.less'
import * as R from 'ramda'

import React from 'react'
import { connect } from 'react-redux'

const Footer = ({status, userInfo, path, width}) => {
  const style = {width: `calc(100vw - ${width}px)`}
  return <div className="footer__container" style={style} >
    {/* Placeholder for space-between flexbox alignment */}
    <div/>
    <div className="footer__item footer__autosave-status">{status}</div>
    <div className="footer__item">{userInfo ? userInfo.name : ''}</div>
  </div>
}
const mapStateToProps = state => R.pipe(R.merge(state.autoSave), R.merge(state.user))(state.router)

export default connect(mapStateToProps)(Footer)
