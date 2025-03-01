import { getTableData } from '../getTableData'
import { Props } from './props'

// used by all CSVs
export const climaticDomain = (props: Props) => {
  const { assessment, cycle, countries } = props
  return getTableData({
    assessment,
    cycle,
    countryISOs: countries.map(({ countryIso }) => countryIso),
    tableNames: ['climaticDomain'],
    columns: [],
    mergeOdp: true,
    aggregate: false,
    variables: [],
  })
}
