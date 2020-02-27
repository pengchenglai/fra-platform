import React, { useState } from 'react'
import { connect, useSelector } from 'react-redux'
import {
  Link,
  NavLink,
} from 'react-router-dom'

import * as R from 'ramda'
import { isAdministrator } from '@common/countryRole'
import { getAllowedStatusTransitions } from '@common/assessment'

import { PopoverControl } from '@webapp/components/popoverControl'
import { Modal, ModalBody, ModalClose, ModalFooter, ModalHeader } from '@webapp/components/modal'
import Icon from '@webapp/components/icon'
import { getLinkTo, ReviewStatus } from './navigationComponents'

import { canToggleAssessmentLock, isAssessmentLocked } from '@webapp/utils/assessmentAccess'

import { toggleAssessmentLock } from '../actions'
import * as AppState from '@webapp/app/appState'



const MenuLink = ({ child, to, i18n, getReviewStatus }) => {
  return <NavLink
    to={to}
    className="nav__section-item"
    activeClassName="selected">
    <div className='nav__section-order'>{child.tableNo}</div>
    <div className='nav__section-label'>{i18n.t(child.label)}</div>
    <div className="nav__section-status-content">
      <ReviewStatus status={getReviewStatus(child.section)} />
    </div>
  </NavLink>
}



const AssessmentSection = ({ countryIso, item, assessment, i18n, ...props }) => {

  const getChildStatus = () => R.pipe(
    R.map(child => props.getReviewStatus(child.section)),
    // filtering all opened statuses
    R.reject(status => status.issuesCount === 0 || status.issueStatus !== 'opened'),
    // checking if there's an open status with unread issues
    R.or(R.find(R.propEq('hasUnreadIssues'), true), R.head),
    R.defaultTo({})
  )(item.children)

  const [expanded,setExpanded] = useState(false)

  return <div className="nav__section">
    <div className="nav__section-header"
      onClick={() => setExpanded(!expanded)}>
      <div className="nav__section-order">{item.sectionNo}</div>
      <div className="nav__section-label">{i18n.t(item.label)}</div>
      {expanded
        ? null
        : <div className="nav__section-status-content">
          <ReviewStatus status={getChildStatus()} />
        </div>
      }
    </div>
    <div className={expanded ? 'nav__section-items--visible' : 'nav__section-items--hidden'}>
      {
        expanded && item.children.map(
          (child, i) => {
            const linkTo = getLinkTo(child.pathTemplate, countryIso)
            return <MenuLink
              getReviewStatus={props.getReviewStatus}
              i18n={i18n}
              child={child}
              to={linkTo}
              key={i} />
          }
        )
      }
    </div>
  </div>
}

const AssessmentChangeStatusConfirmationModal = props => {
  const {
    i18n,
    userInfo,
    assessment,
    targetStatus,
    changeAssessment,
    onClose
  } = props
  const countryIso = useSelector(AppState.getCountryIso)
  const [notifyUsers, setNotifyUsers] = useState(true)
  const [textareaValue, setTextareaValue] = useState('')

  return <Modal isOpen="true">
    <ModalHeader>
      <div className="modal-header-center">
        {i18n.t(`assessment.status.${R.prop('transition', targetStatus)}.${R.prop('direction', targetStatus)}`)}
      </div>
      <ModalClose onClose={onClose} />
    </ModalHeader>

    <ModalBody>
      <div style={{ height: '160px' }}>
        <textarea
          autoFocus
          className="nav__assessment-comment"
          placeholder={i18n.t('navigation.changeStatusTextPlaceholder')}
          onChange={({ target: { value } }) => setTextareaValue(value)}
        />
      </div>

      { //administrator can disable email notification
        isAdministrator(userInfo) &&
        <div className="nav__assessment-notify-users"
          onClick={() => setNotifyUsers(!notifyUsers)}>
          <div className={`fra-checkbox${notifyUsers ? '' : ' checked'}`}></div>
          {i18n.t('navigation.doNotNotifyUsers')}
        </div>
      }
    </ModalBody>

    <ModalFooter>
      <button className="btn btn-secondary modal-footer__item"
        onClick={onClose}>
        {i18n.t('navigation.cancel')}
      </button>
      <button className="btn btn-primary modal-footer__item"
        onClick={() => {
          changeAssessment(
            countryIso,
            {
              ...assessment,
              status: targetStatus.transition,
              message: textareaValue
            },
            notifyUsers
          )
          onClose()
        }}>
        {i18n.t('navigation.submit')}
      </button>
    </ModalFooter>
  </Modal>
}

const AssessmentHeader = props => {
  const {
    assessment,
    canToggleLock,
    changeAssessment,
    i18n,
    isLocked,
    lastUncollapseState,
    toggleAllNavigationGroupsCollapse,
    toggleAssessmentLock,
    userInfo,
  } = props
  const { status: assessmentStatus } = assessment
  const countryIso = useSelector(AppState.getCountryIso)
  const [targetStatus, setTargetStatus] = useState(null)

  const allowedTransitions = getAllowedStatusTransitions(countryIso, userInfo, assessmentStatus)
  const possibleAssessmentStatuses = [
    { direction: 'next', transition: allowedTransitions.next },
    { direction: 'previous', transition: allowedTransitions.previous }
  ]

  const deskStudyItems = [{
    divider: true
  }, {
    content: <div className="popover-control__checkbox-container">
      <span
        style={{ marginRight: '8px' }}
        className={`fra-checkbox ${assessment.deskStudy ? 'checked' : ''}`}
      >
      </span>
      <span>{i18n.t('assessment.deskStudy')}</span>
    </div>,
    onClick: () => changeAssessment(countryIso, { ...assessment, deskStudy: !assessment.deskStudy })
  }]

  const popoverItems = assessmentStatus === 'changing'
    ? []
    : R.pipe(
      R.filter(R.prop('transition')),
      R.map(targetStatus => ({
        content: i18n.t(`assessment.status.${targetStatus.transition}.${targetStatus.direction}`),
        onClick: () => setTargetStatus(targetStatus)
      })),
      //adding desk study option if user is administrator
      items => isAdministrator(userInfo)
        ? R.flatten(R.append(deskStudyItems, items))
        : items
    )(possibleAssessmentStatuses)

  return <div className="nav__assessment-header">

    { // showing confirmation modal dialog before submitting the status change
      !(R.isNil(targetStatus)) &&
      <AssessmentChangeStatusConfirmationModal
        countryIso={countryIso}
        i18n={i18n}
        assessment={assessment}
        targetStatus={targetStatus}
        changeAssessment={changeAssessment}
        userInfo={userInfo}
        onClose={() => setTargetStatus(null)}
      />
    }

    <div className="nav__assessment-label">

      <div className="nav__assessment-lock">
        <div>
          {i18n.t('assessment.' + assessment.type)}
          {
            assessment.deskStudy &&
            <div className="desk-study">({i18n.t('assessment.deskStudy')})</div>

          }
        </div>
        <button className="btn-s btn-secondary nav__assessment-btn-lock"
          disabled={!canToggleLock}
          onClick={() => toggleAssessmentLock(assessment.type)}>
          <Icon name={isLocked ? 'lock-circle' : 'lock-circle-open'} className="icon-no-margin" />
        </button>
      </div>

      <div>
        <Link className="btn-s btn-secondary" to={`/country/${countryIso}/print/${assessment.type}?onlyTables=true`}
          target="_blank">
          <Icon name="small-print" className="icon-margin-left" />
          <Icon name="icon-table2" className="icon-no-margin" />
        </Link>
        <Link className="btn-s btn-secondary" to={`/country/${countryIso}/print/${assessment.type}`} target="_blank">
          <Icon name="small-print" className="icon-no-margin" />
        </Link>
      </div>

    </div>

    <PopoverControl items={popoverItems}>
      <div
        className={`nav__assessment-status status-${assessmentStatus} actionable-${!R.isEmpty(popoverItems)}`}>
        <span>{i18n.t(`assessment.status.${assessmentStatus}.label`)}</span>
        {
          !R.isEmpty(popoverItems) &&
          <Icon className="icon-white icon-middle" name="small-down" />
        }
      </div>
    </PopoverControl>

    <button
      className="btn-s nav__assessment-toggle"
      onClick={() => toggleAllNavigationGroupsCollapse()}>
      {
        lastUncollapseState
          ? i18n.t('navigation.hideAll')
          : i18n.t('navigation.showAll')
      }
    </button>
  </div>
}

const Assessment = (props) => {
  const { assessment, sections } = props

  return <div className="nav__assessment">
    {
      assessment &&
      <AssessmentHeader {...props} />
    }
    {
      R.map(item =>
        <AssessmentSection
          key={item.label}
          item={item}
          {...props}
        />
        , sections)
    }
  </div>
}

const mapStateToProps = (state, props) => {
  const { assessment } = props

  return assessment
    ? {
      isLocked: isAssessmentLocked(state, R.prop('type', assessment)),
      canToggleLock: canToggleAssessmentLock(state, R.prop('type', assessment))
    }
    : {}
}

export default connect(mapStateToProps, { toggleAssessmentLock })(Assessment)





