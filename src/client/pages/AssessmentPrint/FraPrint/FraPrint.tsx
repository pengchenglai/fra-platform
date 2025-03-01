import './FraPrint.scss'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Labels } from '@meta/assessment'

import { useAppDispatch } from '@client/store'
import { useAssessment, useAssessmentSections, useCountry, useCycle } from '@client/store/assessment'
import { AssessmentSectionActions } from '@client/store/pages/assessmentSection'
import { useCountryIso } from '@client/hooks'
import { useIsPrint } from '@client/hooks/useIsPath'
import Loading from '@client/components/Loading'
import AssessmentSection from '@client/pages/AssessmentSection'

import ContactPersons from './ContactPersons'
import TableOfContent from './TableOfContent'

const FraPrint: React.FC = () => {
  const countryIso = useCountryIso()
  const { t } = useTranslation()
  const country = useCountry(countryIso)
  const assessment = useAssessment()
  const cycle = useCycle()
  const dispatch = useAppDispatch()

  const sections = useAssessmentSections()

  const { onlyTables } = useIsPrint()
  const deskStudy = country?.props?.deskStudy

  useEffect(() => {
    if (sections) {
      const sectionNames = Object.values(sections).flatMap((section) =>
        Object.values(section.subSections).flatMap((sectionItem) => sectionItem.props.name)
      )

      dispatch(
        AssessmentSectionActions.getTableSections({
          assessmentName: assessment.props.name,
          cycleName: cycle.name,
          sectionNames,
          countryIso,
        })
      )
    }
  }, [sections, assessment.props.name, countryIso, cycle.name, dispatch])

  if (!sections) {
    return <Loading />
  }

  let title = ''
  if (onlyTables) title = t('print.titleTables', { cycleName: cycle.name })
  if (!onlyTables && deskStudy) title = `${t('assessment.fra')} ${t('assessment.deskStudy')}`
  if (!onlyTables && !deskStudy) title = t('print.title', { cycleName: cycle.name })

  return (
    <div>
      <div className="fra-print__header">
        <h1>{t(`area.${countryIso}.listName`)}</h1>
        <h1>{title}</h1>
      </div>

      <hr />

      {!onlyTables && <TableOfContent deskStudy={deskStudy} />}

      {Object.entries(sections).map(([key, section], i) => {
        return (
          <div key={section.uuid} id={`section${key}`}>
            {!onlyTables && (
              <h1 className="title only-print">
                {i === 0 ? '' : key} {Labels.getLabel({ cycle, labels: section.props.labels, t })}
              </h1>
            )}

            {i === 0 && !deskStudy && <ContactPersons />}

            {Object.values(section.subSections).map((sectionItem) => {
              return <AssessmentSection key={sectionItem.uuid} section={sectionItem.props.name} />
            })}
          </div>
        )
      })}
    </div>
  )
}

export default FraPrint
