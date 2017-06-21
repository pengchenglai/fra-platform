import axios from 'axios'
import * as autosave from '../../autosave/actions'
import { applicationError } from '../../applicationError/actions'

export const descriptionsFetchStart = 'nationalDataEntry/descriptions/fetch/start'
export const descriptionsFetched = 'nationalDataEntry/descriptions/fetched'

export const fetchDescriptions = countryIso => dispatch => {
  dispatch({type: descriptionsFetchStart})
  axios.get(`/api/country/descriptions/${countryIso}`)
    .then(resp => dispatch({type: descriptionsFetched, data: resp.data}))
    .catch(err => dispatch(applicationError(err)))
}

export const descriptionsChangeStart = 'nationalDataEntry/descriptions/change/start'

export const saveDescriptions = (countryIso, descField, value) => dispatch => {
  dispatch(startSaveDescriptions(descField, value))
  dispatch(autosave.start)
  dispatch(changeDescriptions(countryIso, descField, value))
}

const startSaveDescriptions = (descField, value) => ({type: descriptionsChangeStart, descField, value})

const changeDescriptions = (countryIso, descField, value) => {
  const dispatched = dispatch => {
    return axios.post(`/api/country/descriptions/${countryIso}/${descField}`, {value}).then(() => {
      dispatch(autosave.complete)
    }).catch((err) => {
      dispatch(applicationError(err))
    })
  }
  dispatched.meta = {
    debounce: {
      time: 800,
      key: `descriptionChangeStart_${descField}`
    }
  }
  return dispatched
}
