import './style.less'
import React from 'react'
import { connect } from 'react-redux'

import LoggedInPageTemplate from '../../app/loggedInPageTemplate'
import TraditionalTable from '../../traditionalTable/traditionalTable'
import tableSpec from './tableSpec'
import DefinitionLink from '../../reusableUiComponents/definitionLink'
import { fetchLastSectionUpdateTimestamp } from '../../audit/actions'
import NationalDataDescriptions from '../../descriptionBundles/nationalDataDescriptions'
import AnalysisDescriptions from '../../descriptionBundles/analysisDescriptions'
import GeneralComments from '../../descriptionBundles/generalComments'

class GrowingStockCompositionView extends React.Component {

  constructor(props) {
    super(props)
    this.tableSpecInstance = tableSpec(this.props.i18n)
  }

  componentWillMount() {
    this.props.fetchLastSectionUpdateTimestamp(this.props.match.params.countryIso, this.tableSpecInstance.name)
  }

  render () {
    const {match, i18n} = this.props

    return <LoggedInPageTemplate>
      <div className="fra-view__content growing-stock-composition-view">
        <NationalDataDescriptions section={this.tableSpecInstance.name} countryIso={match.params.countryIso}/>
        <AnalysisDescriptions section={this.tableSpecInstance.name} countryIso={match.params.countryIso}/>
        <div className="fra-view__page-header">
          <h3 className="subhead">{i18n.t('growingStockComposition.growingStockComposition')}</h3>
          <div className="fra-view__header-secondary-content">
            <DefinitionLink document="tad" anchor="2b" title={i18n.t('definition.definitionLabel')} lang={i18n.language}/>
            <DefinitionLink document="faq" anchor="2b" title={i18n.t('definition.faqLabel')} lang={i18n.language}/>
            <p className="support-text">{i18n.t('growingStockComposition.rankingYear')}</p>
          </div>
        </div>
        <TraditionalTable tableSpec={this.tableSpecInstance} countryIso={match.params.countryIso}/>
        <GeneralComments
          section={this.tableSpecInstance.name}
          countryIso={match.params.countryIso}
        />
      </div>
    </LoggedInPageTemplate>
  }

}

const mapStateToProps = state => ({i18n: state.user.i18n})

export default connect(mapStateToProps, {fetchLastSectionUpdateTimestamp})(GrowingStockCompositionView)
