import React from 'react'
import { useTranslation } from 'react-i18next'

import { Numbers } from '@utils/numbers'
import { ChartOptions } from 'chart.js'

import { Areas } from '@meta/area'
import { TableNames } from '@meta/assessment'
import { TableDatas } from '@meta/data'

import { useCycle } from '@client/store/assessment'
import { useCountryIso } from '@client/hooks'
import Chart from '@client/components/Chart'
import { ChartDataType } from '@client/components/Chart/Chart'

import useDashboardData from '../hooks/useDashboardData'
import { formatValue } from '../utils/numberUtils'
import { ChartColors, commonOptions } from '../utils/preferences'

// Cycle 2025 has separate fields for other and unknown
const cycleVariables: Record<string, Array<string>> = {
  '2020': ['other_or_unknown'],
  '2025': ['other', 'unknown'],
}

const ForestOwnership = () => {
  const cycle = useCycle()
  const countryIso = useCountryIso()
  const isIsoCountry = Areas.isISOCountry(countryIso)

  const i18n = useTranslation()
  const section = 'forestOwnership'
  const unit = isIsoCountry ? i18n.t<string>('unit.haThousand') : i18n.t<string>('unit.haMillion')
  const column = '2015'
  const tableName = isIsoCountry ? TableNames.forestOwnership : TableNames.valueAggregate
  const variables = [...cycleVariables[cycle.name], 'private_ownership', 'public_ownership']

  const { data: tableData, loaded } = useDashboardData({
    columns: [column],
    tableNames: [tableName],
    variables,
  })

  if (!loaded) {
    return null
  }

  const props = {
    countryIso,
    data: tableData,
    tableName,
    colName: column,
  }

  const privateOwnership = Number(TableDatas.getDatum({ ...props, variableName: 'private_ownership' }))
  const publicOwnership = Number(TableDatas.getDatum({ ...props, variableName: 'public_ownership' }))
  const otherOrUnknown =
    cycle.name === '2020'
      ? Number(TableDatas.getDatum({ ...props, variableName: 'other_or_unknown' }))
      : Numbers.sum([
          Number(TableDatas.getDatum({ ...props, variableName: 'other' })),
          Number(TableDatas.getDatum({ ...props, variableName: 'unknown' })),
        ])

  const data = {
    datasets: [
      {
        data: [
          formatValue(publicOwnership, isIsoCountry),
          formatValue(privateOwnership, isIsoCountry),
          formatValue(otherOrUnknown, isIsoCountry),
        ],
        backgroundColor: [ChartColors.purple, ChartColors.orange, ChartColors.gray],
        borderWidth: 0,
        hoverBackgroundColor: [ChartColors.purpleHover, ChartColors.orangeHover, ChartColors.grayHover],
        unit,
      },
    ],
    labels: [
      i18n.t<string>('statisticalFactsheets.forestOwnership.public'),
      i18n.t<string>('statisticalFactsheets.forestOwnership.private'),
      i18n.t<string>('statisticalFactsheets.rowName.otherOrUnknown'),
    ],
  }

  const options = {
    ...commonOptions,
    legend: {
      position: 'bottom',
    },
  } as ChartOptions<'pie'>

  return (
    <div className="row-s">
      <h3 className="header">{i18n.t<string>(`statisticalFactsheets.${section}.title`)}</h3>
      {privateOwnership || publicOwnership || otherOrUnknown ? (
        <Chart type="pie" data={data as ChartDataType} options={options} />
      ) : (
        <h6 className="header">{i18n.t<string>('statisticalFactsheets.noData')}</h6>
      )}
    </div>
  )
}
export default ForestOwnership
