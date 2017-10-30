import React from 'react'
import R from 'ramda'
import { formatDecimal } from '../utils/numberFormat'
import { totalSum } from '../traditionalTable/aggregate'
import { subCategoryValidator } from '../traditionalTable/validators'
import { forestAreaSameAsExtentOfForestValidator } from '../traditionalTable/validators'

const mapIndexed = R.addIndex(R.map)

const createInputRow = (rowHeader, cname = 'fra-table__category-cell', validator) => [
  {type: 'readOnly', jsx: <th key="protection" className={`${cname}`}>{rowHeader}</th>},
  ...(R.times(() => ({
    type: 'decimalInput',
    validator: validator
  }), 5))
]

const privateOwnershipValidator = subCategoryValidator(0, R.range(1, 4))

const years = [1990, 2000, 2010, 2015, 2020]
const sumRows = [0,4,5]

export default (i18n, extentOfForest) => ({
  name: 'forestOwnership',
  header: <thead>
  <tr>
    <th className="fra-table__header-cell" rowSpan="2">{i18n.t('forestOwnership.categoryHeader')}</th>
    <th className="fra-table__header-cell-middle" colSpan="5">{i18n.t('forestOwnership.areaUnitLabel')}</th>
  </tr>
  <tr>
    {
      mapIndexed((year, i) => <th key={i} className="fra-table__header-cell-right">{year}</th>, years)
    }
  </tr>
  </thead>,
  rows: [
    createInputRow(i18n.t('forestOwnership.privateOwnership')),
    createInputRow(i18n.t('forestOwnership.ofWhichIndividuals'), 'fra-table__subcategory-cell', privateOwnershipValidator),
    createInputRow(i18n.t('forestOwnership.ofWhichPrivateBusinesses'), 'fra-table__subcategory-cell', privateOwnershipValidator),
    createInputRow(i18n.t('forestOwnership.ofWhichCommunities'), 'fra-table__subcategory-cell', privateOwnershipValidator),
    createInputRow(i18n.t('forestOwnership.publicOwnership')),
    createInputRow(i18n.t('forestOwnership.otherOrUnknown')),
    [
      {
        type: 'readOnly',
        jsx: <th key="total_forest_area" className="fra-table__header-cell">{i18n.t('forestOwnership.totalForestArea')}</th>
      },
      ...mapIndexed((year, i) =>
        ({
          type: 'calculated',
          calculateValue: props => totalSum(props.tableData, i+1, sumRows),
          valueFormatter: formatDecimal,
          validator: forestAreaSameAsExtentOfForestValidator(year, extentOfForest, sumRows)
        })
        ,
        years
      )
    ]
  ],
  valueSlice: {
    columnStart: 1,
    rowEnd: -1
  }
})
