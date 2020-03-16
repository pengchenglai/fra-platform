import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { acceptNextDecimal } from '@webapp/utils/numberInput'

import { ThousandSeparatedDecimalInput } from '@webapp/components/thousandSeparatedDecimalInput'
import { updateTableDataCell } from '@webapp/app/assessment/components/dataTable/actions'

const Decimal = props => {
  const { assessmentType, sectionName, tableName, rowIdx, col, datum, disabled } = props

  const dispatch = useDispatch()

  return (
    <ThousandSeparatedDecimalInput
      numberValue={datum}
      // onPaste={e =>
      // dispatch(
      // saveMany(sectionName, countryIso, pasteUpdate(e, rowIdx, colIdx, fra))
      // )
      // }
      onChange={e => {
        const { value } = e.target
        let valueUpdate = acceptNextDecimal(value, datum)
        valueUpdate = valueUpdate && String(valueUpdate)

        dispatch(updateTableDataCell(assessmentType, sectionName, tableName, rowIdx, col.idx, valueUpdate))
      }}
      disabled={disabled}
    />
  )
}

Decimal.propTypes = {
  assessmentType: PropTypes.string.isRequired,
  sectionName: PropTypes.string.isRequired,
  tableName: PropTypes.string.isRequired,
  rowIdx: PropTypes.number.isRequired,
  col: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  datum: PropTypes.any,
}

Decimal.defaultProps = {
  datum: null,
}

export default Decimal
