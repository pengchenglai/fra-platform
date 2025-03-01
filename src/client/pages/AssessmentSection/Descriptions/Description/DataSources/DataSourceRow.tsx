import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Arrays } from '@utils/arrays'
import { Objects } from '@utils/objects'
import classNames from 'classnames'

import { Cols, ColType, DataSource, dataSourceType, Row, RowType } from '@meta/assessment'

import { useCycle } from '@client/store/assessment'
import { useTableSections } from '@client/store/pages/assessmentSection'
import { useCountryIso } from '@client/hooks'
import Autocomplete from '@client/components/Autocomplete'
import DataColumn from '@client/components/DataGrid/DataColumn'
import Icon from '@client/components/Icon'
import MultiSelect from '@client/components/MultiSelect'
import ReviewIndicator from '@client/components/ReviewIndicator'
import VerticallyGrowingTextField from '@client/components/VerticallyGrowingTextField'

type Props = {
  disabled: boolean
  dataSource: DataSource
  sectionName: string
  placeholder: boolean
  index: number

  onChange: (dataSource: DataSource) => void
  onDelete: () => void
}
const validators: Record<string, (x: string) => boolean> = {
  // check at least one character exists
  reference: (referenceString) => !(Objects.isEmpty(referenceString) || /[A-Za-z]/.test(referenceString)),
  // check that is number
  year: (yearString) => !(Objects.isEmpty(yearString) || Number.isInteger(Number(yearString))),
  // check at least one character exists
  comment: (commentString) => !(Objects.isEmpty(commentString) || /[A-Za-z]/.test(commentString)),
}

const DataSourceRow: React.FC<Props> = (props: Props) => {
  const { disabled, dataSource, sectionName, onChange, placeholder, onDelete, index } = props
  const countryIso = useCountryIso()
  const cycle = useCycle()
  const tableSections = useTableSections({ sectionName })
  const { t } = useTranslation()

  const _onChange = useCallback(
    (field: string, value: string) => {
      if (dataSource[field as keyof DataSource] === value) return
      onChange({
        ...dataSource,
        [field]: value,
      })
    },
    [dataSource, onChange]
  )

  const table = tableSections?.[0]?.tables?.[0]
  if (!table) return null

  const columns = cycle ? Arrays.reverse(Arrays.range(1950, Number(cycle.name))).map(String) : []

  const _allColumnsCalculated = (row: Row) =>
    row.cols.every((col) => [ColType.header, ColType.calculated].includes(col.props.colType))
  const rows = table.rows
    ?.filter((row) => row.props.variableName && row.props.type === RowType.data && !_allColumnsCalculated(row))
    .map((r) => t(Cols.getLabel({ cycle, col: r.cols[0], t })))

  return (
    <>
      <DataColumn
        className={classNames('data-source-column', { 'validation-error': validators.reference(dataSource.reference) })}
      >
        <div className="data-source__delete-wrapper">
          {!placeholder && !disabled && (
            <button type="button" onClick={onDelete}>
              <Icon name="remove" />
            </button>
          )}
          <VerticallyGrowingTextField
            disabled={disabled}
            onChange={(event) => _onChange('reference', event.target?.value)}
            value={dataSource.reference}
          />
        </div>
      </DataColumn>
      <DataColumn className="data-source-column">
        <Autocomplete
          withArrow
          disabled={disabled}
          onSave={(value) => _onChange('type', value)}
          value={dataSource.type}
          items={Object.keys(dataSourceType).map((type) => t(`dataSource.${type}`))}
        />
      </DataColumn>

      <DataColumn className="data-source-column">
        <MultiSelect
          disabled={disabled}
          values={dataSource.fraVariables ?? []}
          options={rows}
          onChange={(value: any) => {
            _onChange('fraVariables', value)
          }}
        />
      </DataColumn>

      <DataColumn
        className={classNames('data-source-column', { 'validation-error': validators.year(dataSource.year) })}
      >
        <Autocomplete
          withArrow
          disabled={disabled}
          onSave={(value) => _onChange('year', value)}
          value={dataSource.year}
          items={columns}
        />
      </DataColumn>

      <DataColumn
        className={classNames('data-source-column', { 'validation-error': validators.comment(dataSource.comments) })}
      >
        {' '}
        <VerticallyGrowingTextField
          disabled={disabled}
          onChange={(event) => _onChange('comments', event.target.value)}
          value={dataSource.comments}
        />
      </DataColumn>
      <DataColumn className="data-source-review-indicator">
        {!disabled && (
          <ReviewIndicator
            title={`${dataSource.fraVariables?.join(', ')} | ${dataSource.year}`}
            topicKey={`dataSource-${countryIso}-${sectionName}-${index}`}
          />
        )}
      </DataColumn>
    </>
  )
}
export default DataSourceRow
