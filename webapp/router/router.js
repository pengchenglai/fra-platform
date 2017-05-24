import * as R from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { follow } from './actions'
import Notfound from '../notfound'

class Router extends React.Component {

  componentWillMount () {
    window.onhashchange = () => {
      this.props.follow(location.hash)
    }
    window.onload = () => {
      this.props.follow(location.hash)
    }
  }

  render () {
    const route = R.find(route => route.route.match(this.props.path))(this.props.routes)
    return route ? React.createElement(route.component, {match: {params: route.route.match(this.props.path)}}) :
      <Notfound/>
  }
}

const mapStateToProps = state => {
  return state.router.path ? {path: state.router.path} : {path: (window.location.hash || window.location.pathname) }
}

export default connect(mapStateToProps, {follow})(Router)
