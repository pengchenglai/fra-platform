import { applicationError } from "../applicationError/actions"
import axios from "axios"

// Drafting

export const dataPointSaveDraftStart     = 'originalDataPoint/saveDraft/start'
export const dataPointSaveDraftCompleted = 'originalDataPoint/saveDraft/completed'

export const saveDraft = ( countryIso, obj ) => dispatch => {
    dispatch( startSavingDraft( obj ) )
    dispatch( persistDraft( countryIso, obj ) )
}

const startSavingDraft = ( obj ) => ({ type: dataPointSaveDraftStart, active: obj })

const persistDraft = (countryIso, obj) => {
    const dispatched = dispatch =>
        axios.post( `/api/country/originalDataPoint/draft/${countryIso}`, obj ).then((resp) => {
            dispatch( saveDraftCompleted(resp.data.odpId) )
        } ).catch( ( err ) => {
            dispatch( applicationError( err ) )
        } )
    
    dispatched.meta = {
        debounce: {
            time: 800,
            key : dataPointSaveDraftStart
        }
    }
    return dispatched
}

const saveDraftCompleted = odpId => ({ type: dataPointSaveDraftCompleted, odpId })

// Marking drafts

export const markAsActualCompleted = 'originalDataPoint/markAsActual/completed'

export const markAsActual = (countryIso, odpId) => dispatch =>
    axios.post(`/api/country/originalDataPoint/draft/markAsActual/${odpId}`).then(resp => {
        dispatch({type: markAsActualCompleted})
        window.location = `#/country/${countryIso}`
    })
    .catch(err =>
      dispatch( applicationError( err ))
    )

// fetching odp's

export const odpFetchCompleted = 'originalDataPoint/fetch/completed'

export const fetch = (odpId) => dispatch =>
    axios.get(`/api/country/originalDataPoint/${odpId}`).then(resp => {
        dispatch({type: odpFetchCompleted, active: resp.data})
    })
    .catch(err =>
      dispatch( applicationError( err ))
    )

