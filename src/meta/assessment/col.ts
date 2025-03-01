import { CycledPropsObject, CycleUuid } from './cycle'
import { Label } from './label'

export enum ColType {
  calculated = 'calculated',
  decimal = 'decimal',
  header = 'header',
  integer = 'integer',
  noticeMessage = 'noticeMessage',
  placeholder = 'placeholder',
  select = 'select',
  selectYesNo = 'selectYesNo',
  taxon = 'taxon',
  text = 'text',
  textarea = 'textarea',
  // placeholder = 'placeholder',
}

export interface ColSelectOption {
  hidden?: boolean
  name: string
  type?: 'header' | undefined
}

export interface ColSelectProps {
  options: Array<ColSelectOption>
  labelKeyPrefix?: string
}

export interface ColStyle {
  colSpan?: number
  rowSpan?: number
}

export interface ColProps {
  calculateFn?: Record<CycleUuid, string>
  colName?: string
  colType: ColType
  index?: number | string
  labels?: Record<string, Label> // label by cycle uuid
  select?: ColSelectProps
  style: Record<string, ColStyle> // style by cycle uuid
  variableNo?: Record<string, string> // variable number by cycle uuid
}

export interface Col extends CycledPropsObject<ColProps> {
  rowId: number
}
