import React from 'react'
import * as R from 'ramda'

import { Link } from './../link'
import { separateThousandsWithSpaces } from '../utils/numberFormat'
import { ThousandSeparatedIntegerInput } from '../reusableUiComponents/thousandSeparatedIntegerInput'
import ReviewIndicator from '../review/reviewIndicator'
import { readPasteClipboard } from '../utils/copyPasteUtil'
import {acceptNextInteger} from '../utils/numberInput'

const mapIndexed = R.addIndex(R.map)

// props:
// countryIso
// i18n
// fra
// actions: save, saveMany, openCommentThread
// rows:
//  localizedName, name,
export class DataTable extends React.Component {

  render () {
    const i18n = this.props.i18n
    return <div className="nde__data-table-container">
      <div className="nde__data-table-scroll-content">
        <table className="fra-table">
          <thead>
          <tr>
            <th className="fra-table__header-cell"></th>
            {
              R.values(this.props.fra).map(v =>
                <th className={`fra-table__header-cell-align-right ${v.type === 'odp' ? 'odp-header-cell' : ''}`} key={`${v.type}_${v.name}`}>
                  { v.type === 'odp' ? <OdpHeading countryIso={this.props.countryIso} odpValue={v}/>
                    : v.name
                  }
                </th>
              )
            }
          </tr>
          </thead>
          <tbody>
          { fraValueRow(i18n.t('extentOfForest.forestArea'), 'forest', this.props.countryIso, 'forestArea',
            this.props.fra, this.props.save, this.props.saveMany, 0, this.props.openCommentThread) }
          { fraValueRow(i18n.t('fraClass.otherWoodedLand'), 'otherWoodedLand', this.props.countryIso, 'otherWoodedLand',
            this.props.fra, this.props.save, this.props.saveMany, 1, this.props.openCommentThread) }
          { fraValueRow(i18n.t('fraClass.otherLand'), 'otherLand', this.props.countryIso, 'otherLand',
            this.props.fra, this.props.save, this.props.saveMany, 2, this.props.openCommentThread) }
          </tbody>
        </table>
      </div>
      <div className="nde__comment-column">
        <ReviewIndicator target={['forest']}
                         name={i18n.t('extentOfForest.forestArea')}
                         countryIso={this.props.countryIso}
                         section='EOF'/>
        <ReviewIndicator section='EOF'
                         name={i18n.t('fraClass.otherWoodedLand')}
                         target={['otherWoodedLand']}
                         countryIso={this.props.countryIso}/>
        <ReviewIndicator section='EOF'
                         name={i18n.t('fraClass.otherLand')}
                         target={['otherLand']}
                         countryIso={this.props.countryIso}/>
      </div>
    </div>
  }
}

const OdpHeading = ({countryIso, odpValue}) =>
  <Link className="link" to={`/country/${countryIso}/odp/${odpValue.odpId}`}>
    {odpValue.draft ? <svg className="icon icon-sub icon-red icon-margin"><use href="img/icons.svg#alert"/></svg> : ''}
    {odpValue.name}
  </Link>

const fraValueCell = (fraValue, fra, countryIso, save, saveMany, field, colIdx, rowIdx) =>
  <ThousandSeparatedIntegerInput
    className="fra-table__integer-input"
    integerValue={ fraValue[field] }
    onPaste={ e => saveMany(countryIso, updatePastedValues(e, colIdx, rowIdx, fra)) }
    onChange={ e => { save(countryIso, fraValue.name, e.target.value, fraValue, field) } }/>

const odpCell = (odpValue, field) =>
  <span>
    {separateThousandsWithSpaces(Math.round(odpValue[field]))}
  </span>

const fraValueRow = (rowHeading, target, countryIso, field, fra, save, saveMany, colId, openThread) => {
  return <tr
    className={`${openThread && R.isEmpty(R.difference(openThread.target, target)) ? 'fra-row-comments__open' : ''}`}>
    <td className="fra-table__header-cell">{ rowHeading }</td>
    {
      mapIndexed((v, i) =>
          <td className={`fra-table__${v.type === 'odp' ? 'text-readonly-cell' : 'cell'}`} key={`${v.type}_${v.name}`}>
            {
              v.type === 'odp'
                ? odpCell(v, field)
                : fraValueCell(v, fra, countryIso, save, saveMany, field, colId, i)
            }
          </td>
        , R.values(fra))
    }
  </tr>
}

const updatePastedValues = (evt, rowIdx, colIdx, fra, rowNames = {
  0: 'forestArea',
  1: 'otherWoodedLand',
  2: 'otherLand'
}) => {
  // Pasted values are not to be consumed if column is odp -- i.e. odp columns are to be skipped.
  // This is achieved by constructing correct 'view' on the fra data in two steps.
  // First odp values values that appear after where paste begins are filtered out.
  const fraOnly =  R.filter(R.pipe(R.prop('type'), R.equals('fra')))(R.drop(colIdx, fra))
  // Second both fra and odp columns before where paste begins are concatenated together
  // with the filtered part to preserve correct index.
  const readFrom = R.concat(R.take(colIdx, fra), fraOnly)

  let toPaste = {}
  mapIndexed((r, i) => {
    const row = rowIdx + i
    mapIndexed((c, j) => {
      const col = colIdx + j
      if (R.isNil(readFrom[col])) return
      toPaste = R.mergeDeepRight({[readFrom[col].year]: {[rowNames[row]]: c}}, toPaste)
    }, r)
  }, readPasteClipboard(evt))

  const pasted = R.pipe(
    R.map(fra => {
      // Validates pasted values and filters out values that are not accepted by
      // acceptNextInteger-function.
      const acceptedValues = R.pipe(
        R.keys,
        R.map(k => {
          return {[k]: acceptNextInteger(String(toPaste[fra.year][k]), fra[k])}
        }),
        R.reduce(R.merge, {})
      )(R.defaultTo({}, toPaste[fra.year]))

      return toPaste[fra.year] ? R.merge(fra, acceptedValues) : null
    }),
    R.reject(R.isNil))(fra)

  return pasted
}
