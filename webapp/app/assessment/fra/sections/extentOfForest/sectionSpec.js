import * as FRA from '@common/assessment/fra'

import * as SectionSpec from '@webapp/app/assessment/components/section/sectionSpec'
import * as ExtentOfForestState from '@webapp/app/assessment/fra/sections/extentOfForest/extentOfForestState'
import * as ExtentOfForestValidator from '@webapp/app/assessment/fra/sections/extentOfForest/extentOfForestValidatorState'

const section = FRA.sections['1'].children.a

const rowsEOF = [
  SectionSpec.newRowHeader([
    SectionSpec.newColHeader('extentOfForest.categoryHeader', null, 2),
    SectionSpec.newColHeader('extentOfForest.areaUnitLabel', null, 1, null),
  ]),
  SectionSpec.newRowData(
    'extentOfForest.forestArea',
    [],
    'a',
    null,
    ExtentOfForestValidator.forestAreaValidator,
    'forestArea'
  ),
  SectionSpec.newRowData(
    'fraClass.otherWoodedLand',
    [],
    'a',
    null,
    ExtentOfForestValidator.otherWoodedLandValidator,
    'otherWoodedLand'
  ),
  SectionSpec.newRowNoticeMessage('extentOfForest.tableNoticeMessage', 2),
]
const tableSpecs = [
  SectionSpec.newTableSpec(section.tables.extentOfForest, rowsEOF, ExtentOfForestState.getSectionData, true),
]
const tableSection = SectionSpec.newTableSection(tableSpecs)

const extentOfForest = SectionSpec.newSectionSpec(section.name, section.anchor, [tableSection])

export default extentOfForest
