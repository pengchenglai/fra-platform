import "./style.less"

import React from "react"
import { connect } from "react-redux"
import { saveDraft, markAsActual, fetch } from "./actions"
import R from "ramda"

const years = [ '', ...R.range( 1990, 2020 ) ]

const DataInput = ({ match, saveDraft, markAsActual, active }) => {
    const countryIso = match.params.countryIso
    
    return <div className="odp__data-input-component">
        <div className="odp_data-input-row">
            <div><h3>Year</h3></div>
            <div>
                <select
                    value={active.year || ""}
                    onChange={(e) => saveDraft( countryIso, R.assoc( "year", Number(e.target.value), active ) ) }>
                    {years.map( (year) => <option key={year} value={year}>{year}</option> )}
                </select>
            </div>
        </div>
        <div className="odp_data-input-row">
            <div><h3>Forest area</h3></div>
            <div>
                <input value={active.forestArea || ""}
                       onChange={(e) => saveDraft( countryIso, R.assoc( "forestArea", Number(e.target.value), active ) ) }/>
            </div>
        </div>
        <div className="odp_data-input-row">
            <button disabled={!active.odpId} className="btn-primary" onClick={() => markAsActual(countryIso, active.odpId) }>Save & Close</button>
        </div>
    </div>
}

class OriginalDataPoint extends React.Component {
    componentWillMount() {
        const odpId = this.props.match.params.odpId
        console.log("match", this.props.match)
        if(odpId) {
            this.props.fetch(odpId)
        }
    }
    render() {
        return <div className="odp__container">
            <h2>Add original data point</h2>
            <span className="odp__status-indicator">{this.props.status}</span>
            <DataInput {...this.props}/>
        </div>
    }
}

const mapStateToProps = state => {
    const odp    = state[ 'originalDataPoint' ]
    const active = odp.active || { year: null, forestArea: null }
    return { ...odp, active }
}

export default connect( mapStateToProps, { saveDraft, markAsActual, fetch} )( OriginalDataPoint )