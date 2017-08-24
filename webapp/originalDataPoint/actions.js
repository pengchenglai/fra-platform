import axios from 'axios'
import * as R from 'ramda'

import { applicationError } from '../applicationError/actions'
import * as autosave from '../autosave/actions'
import {
  removeClassPlaceholder,
  addNationalClassPlaceHolder,
  copyNationalClassDefinitions
} from './originalDataPoint'
import {acceptNextInteger} from '../utils/numberInput'
import { validateDataPoint } from '../../common/originalDataPointCommon'
import { fetchCountryOverviewStatus } from '../navigation/actions'

// Validation
export const odpValidationCompleted = 'originalDataPoint/validationStatus/completed'
const validationCompleted = validationStatus => ({type: odpValidationCompleted, data: validationStatus})

// Drafting

export const odpSaveDraftStart = 'originalDataPoint/saveDraft/start'
export const odpSaveDraftCompleted = 'originalDataPoint/saveDraft/completed'

export const saveDraft = (countryIso, obj) => dispatch => {
  dispatch(autosave.start)
  dispatch(startSavingDraft(obj))
  dispatch(persistDraft(countryIso, obj))
  if (obj.validationStatus)
    dispatch(validationCompleted(validateDataPoint(obj)))
}

const startSavingDraft = (obj) => ({type: odpSaveDraftStart, active: obj})

const persistDraft = (countryIso, odp) => {
  const dispatched = dispatch => {
    axios.post(`/api/odp/draft/?countryIso=${countryIso}`, removeClassPlaceholder(odp)).then((resp) => {
      dispatch(autosave.complete)
      dispatch(saveDraftCompleted(resp.data.odpId))
    }).catch((err) => {
      dispatch(applicationError(err))
    })
  }

  dispatched.meta = {
    debounce: {
      time: 400,
      key: odpSaveDraftStart
    }
  }
  return dispatched
}

const saveDraftCompleted = odpId => ({type: odpSaveDraftCompleted, odpId})

// clear active

export const odpClearActiveAction = 'originalDataPoint/clearActive'
export const clearActive = () => ({type: odpClearActiveAction})

// Delete

export const remove = (countryIso, odpId) => dispatch => {
  axios.delete(`/api/odp/?odpId=${odpId}`)
    .then(() => {
      dispatch({type: odpClearActiveAction})
      fetchCountryOverviewStatus(countryIso)(dispatch)
      window.location = `#/country/${countryIso}`
    }).catch(err => dispatch(applicationError(err))
  )
}

// Marking drafts

export const markAsActual = (countryIso, odp) => dispatch => {
  const validationStatus = validateDataPoint(odp)
  dispatch(validationCompleted(validationStatus))

  if (validationStatus.valid) {
    dispatch(autosave.start)
    axios.post(`/api/odp/markAsActual/?odpId=${odp.odpId}`).then(resp => {
      dispatch(autosave.complete)
      dispatch({type: odpClearActiveAction})
      fetchCountryOverviewStatus(countryIso)(dispatch)
      window.location = `#/country/${countryIso}`
    }).catch(err =>
      dispatch(applicationError(err))
    )
  }
}

// fetching odp's

export const odpFetchCompleted = 'originalDataPoint/fetch/completed'
export const odpListFetchCompleted = 'originalDataPointList/fetch/completed'

export const fetch = (odpId, countryIso) => dispatch =>
  axios.get(`/api/odp/?${R.isNil(odpId) ? '' : `odpId=${odpId}&`}countryIso=${countryIso}`).then(resp => {
    if (R.isNil(odpId)) {
      dispatch({type: odpClearActiveAction, data: resp.data})
    }
    else {
      const odp = addNationalClassPlaceHolder(resp.data)
      dispatch({type: odpFetchCompleted, active: odp})
      dispatch(validationCompleted(validateDataPoint(odp)))
    }
  })
    .catch(err =>
      dispatch(applicationError(err))
    )
export const fetchOdps = countryIso => dispatch =>
  axios.get(`/api/odps/${countryIso}`).then(resp => {
    dispatch({type: odpListFetchCompleted, data: resp.data})
  }).catch(err =>
    dispatch(applicationError(err))
  )

export const copyPreviousNationalClasses = (countryIso, odp) => dispatch => {
  axios.get(`/api/prevOdp/${countryIso}/${odp.year}`).then(resp => {
    const prevOdp = resp.data
    if (prevOdp.nationalClasses) {
      saveDraft(countryIso, copyNationalClassDefinitions(odp, prevOdp))(dispatch)
    }
    else
      dispatch(applicationError({key: 'error.ndp.previousNdpNotFound', values: {year: odp.year}}))
  })
}

export const cancelDraft = (countryIso, odpId) => dispatch => {
  if (odpId)
    axios.delete(`/api/odp/draft/?odpId=${odpId}`)
      .then(() => window.location = `#/country/${countryIso}`)
      .catch((err) => dispatch(applicationError(err)))
  else
    window.location = `#/country/${countryIso}`
}


// fetching odp based assesment item

export const valuesFetched = name => `${name}/value/fetch/completed`
export const valueChangeStart = name => `${name}/value/change/start`
export const pasteChangeStart = name => `${name}/value/paste/start`

const fetched = (itemName, countryIso, data) => ({
  type: valuesFetched(itemName),
  countryIso, data
})

export const fetchItem = (itemName, countryIso) => dispatch => {
  axios.get(`/api/${itemName}/${countryIso}`).then(resp => {
    dispatch(fetched(itemName, countryIso, resp.data))
  }).catch(err => dispatch(applicationError(err)))
}

const change = ({section, countryIso, name, value}) => {
  const dispatched = dispatch => {
    return axios.post(`/api/${section}/country/${countryIso}/${name}`, value).then(() => {
      dispatch(autosave.complete)
    }).catch((err) => {
      dispatch(applicationError(err))
    })
  }
  dispatched.meta = {
    debounce: {
      time: 800,
      key: `valueChangeStart_${name}`
    }
  }
  return dispatched
}
const start = ({section, name, value}) => ({type: valueChangeStart(section), name, value})

export const save = (section, countryIso, name, newValue, fraValue, field) => dispatch => {
  const sanitizedValue = acceptNextInteger(newValue, fraValue[field])
  const newFraValue = {...fraValue, [field]: sanitizedValue, [`${field}Estimated`]: false}
  dispatch(start({section, name, value: newFraValue}))
  dispatch(autosave.start)
  dispatch(change({section, countryIso, name, value: newFraValue}))
}

const changeMany = ({section, countryIso, columnData}) => {
  const dispatched = dispatch => {
    return axios.post(`/api/${section}/${countryIso}`, {columns: columnData}).then(() => {
      dispatch(autosave.complete)
    }).catch((err) => {
      dispatch(applicationError(err))
    })
  }
  return dispatched
}

export const saveMany = (section, countryIso, columnData) => dispatch => {
  dispatch({type: pasteChangeStart(section), columnData})
  dispatch(autosave.start)
  dispatch(changeMany({section, countryIso, columnData}))
}
