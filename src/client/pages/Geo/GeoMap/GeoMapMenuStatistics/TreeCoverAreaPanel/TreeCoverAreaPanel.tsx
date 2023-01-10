import './TreeCoverAreaPanel.scss'
import React from 'react'

import StatisticsTable from '../../components/StatisticsTable'

type Props = {
  data: [string, number, number][]
  countryIso: string
  year: number
}

const TreeCoverAreaPanel: React.FC<Props> = (props: Props) => {
  const columns = ['Source', 'Area', 'Cover Percentage']
  const units = ['', 'ha', '%']
  const loaded = true
  const { data, countryIso, year } = props
  return (
    <div>
      <StatisticsTable
        columns={columns}
        units={units}
        loaded={loaded}
        tableData={data}
        countryIso={countryIso}
        year={year}
      />
    </div>
  )
}

export default TreeCoverAreaPanel
