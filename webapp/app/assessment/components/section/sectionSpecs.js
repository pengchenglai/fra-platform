/**
 * This file contains all section specs for all assessments
 */

import * as FRA from '@common/assessment/fra'

// ======= FRA section specs
// 1
import extentOfForest from '@webapp/app/assessment/fra/sections/extentOfForest/sectionSpec'
import forestCharacteristics from '@webapp/app/assessment/fra/sections/forestCharacteristics/sectionSpec'
// 2
import growingStock from '@webapp/app/assessment/fra/sections/growingStock/sectionSpec'
import growingStockComposition from '@webapp/app/assessment/fra/sections/growingStockComposition/sectionSpec'
// 3
import designatedManagementObjective from '@webapp/app/assessment/fra/sections/designatedManagementObjective/sectionSpec'
import forestAreaWithinProtectedAreas from '@webapp/app/assessment/fra/sections/forestAreaWithinProtectedAreas/sectionSpec'
// 4
// 5
// 6
// 7
// 8

export default {
  [FRA.type]: {
    // 1
    [extentOfForest.sectionName]: extentOfForest,
    [forestCharacteristics.sectionName]: forestCharacteristics,
    // 2
    [growingStock.sectionName]: growingStock,
    [growingStockComposition.sectionName]: growingStockComposition,
    // 3
    [designatedManagementObjective.sectionName]: designatedManagementObjective,
    [forestAreaWithinProtectedAreas.sectionName]: forestAreaWithinProtectedAreas,
    // 4
    // 5
    // 6
    // 7
    // 8
  },
}
