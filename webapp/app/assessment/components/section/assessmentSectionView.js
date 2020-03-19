import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import * as R from 'ramda'

import * as ObjectUtils from '@common/objectUtils'
import { isPrintingOnlyTables } from '@webapp/app/assessment/components/print/printAssessment'
import sectionSpecs from '@webapp/app/assessment/components/section/sectionSpecs'

import Notfound from '@webapp/app/notfound'
import CustomHeader from '@webapp/app/assessment/components/section/components/customHeader'
import Title from '@webapp/app/assessment/components/section/components/title'
import NationalDataDescriptions from '@webapp/app/assessment/components/description/nationalDataDescriptions'
import AnalysisDescriptions from '@webapp/app/assessment/components/description/analysisDescriptions'
import GeneralComments from '@webapp/app/assessment/components/description/generalComments'
import CommentableDescription from '@webapp/app/assessment/components/description/commentableDescription'
import DataTable from '@webapp/app/assessment/components/dataTable'
import useCountryIso from '@webapp/components/hooks/useCountryIso'
import useI18n from '@webapp/components/hooks/useI18n'

import * as FraState from '@webapp/app/assessment/fra/fraState'

import { fetchTableData } from '@webapp/app/assessment/components/dataTable/actions'
import { fetchLastSectionUpdateTimestamp } from '@webapp/app/components/audit/actions'

const AssessmentSectionView = () => {
  const { assessmentType, section } = useParams()
  const sectionSpec = R.path([assessmentType, section], sectionSpecs)

  if (!sectionSpec) {
    return <Notfound />
  }
  const { sectionName, sectionAnchor, tableSections, showTitle, descriptions } = sectionSpec

  const { introductoryText, nationalData, analysisAndProcessing, comments } = descriptions

  const dispatch = useDispatch()
  const countryIso = useCountryIso()
  const i18n = useI18n()
  const disabled = useSelector(FraState.isSectionEditDisabled(sectionName))
  const appViewRef = useRef(null)

  // ==== Check whether to use descriptions
  const useNationalData = useSelector(state =>
    ObjectUtils.isFunction(nationalData) ? nationalData(state) : nationalData
  )

  const useAnalysisAndProcessing = useSelector(state =>
    ObjectUtils.isFunction(analysisAndProcessing) ? analysisAndProcessing(state) : analysisAndProcessing
  )

  // ==== Data fetching effect
  useEffect(() => {
    tableSections.map(tableSection =>
      tableSection.tableSpecs.map(tableSpec => {
        const { name: tableName } = tableSpec
        return dispatch(fetchTableData(assessmentType, sectionName, tableName))
      })
    )

    dispatch(fetchLastSectionUpdateTimestamp(countryIso, sectionName))

    // on section or ocuntry change, scroll to top
    appViewRef.current.scrollTop = 0
  }, [sectionName, countryIso])

  return (
    <div className="app-view__content" ref={appViewRef}>
      <h2 className="title only-print">
        {`${isPrintingOnlyTables() ? '' : `${sectionAnchor} `}${i18n.t(`${sectionName}.${sectionName}`)}`}
      </h2>

      <CustomHeader assessmentType={assessmentType} sectionName={sectionName} disabled={disabled} />

      {/* descriptions components */}
      {useNationalData && (
        <NationalDataDescriptions section={sectionName} countryIso={countryIso} disabled={disabled} />
      )}
      {useAnalysisAndProcessing && (
        <AnalysisDescriptions section={sectionName} countryIso={countryIso} disabled={disabled} />
      )}
      {introductoryText && (
        <CommentableDescription
          section={sectionName}
          title={i18n.t('contactPersons.introductoryText')}
          name="introductoryText"
          template={i18n.t('contactPersons.introductoryTextSupport')}
          disabled={disabled}
        />
      )}

      {showTitle && <Title assessmentType={assessmentType} sectionName={sectionName} sectionAnchor={sectionAnchor} />}

      {!isPrintingOnlyTables() && <div className="page-break" />}

      {tableSections.map(tableSection => (
        <div key={tableSection.idx}>
          {tableSection.titleKey && <h3 className="subhead">{i18n.t(tableSection.titleKey)}</h3>}
          {tableSection.descriptionKey && (
            <div className="app-view__section-toolbar">
              <div className="support-text no-print">{i18n.t(tableSection.descriptionKey)}</div>
            </div>
          )}

          {tableSection.tableSpecs.map(tableSpec => (
            <DataTable
              key={tableSpec.name}
              assessmentType={assessmentType}
              sectionName={sectionName}
              sectionAnchor={sectionAnchor}
              tableSpec={tableSpec}
              disabled={disabled}
            />
          ))}
        </div>
      ))}

      {comments && <GeneralComments section={sectionName} countryIso={countryIso} disabled={disabled} />}
    </div>
  )
}

export default AssessmentSectionView
