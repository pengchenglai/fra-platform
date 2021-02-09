import { useDispatch, useSelector } from 'react-redux'
import * as AppState from '@webapp/store/app/state'
import { Area, Country } from '@common/country'
import { useI18n, useOnUpdate } from '@webapp/components/hooks'
import { sortCountries, sortRegions } from '@webapp/store/app/utils'
import * as AppActions from '../actions'
import FRA from '../../../../common/assessment/fra'

export function useAssessmentType(): string {
  return useSelector(AppState.getAssessmentType) as string
}

export const useCountries = () => {
  const i18n = useI18n()
  const dispatch = useDispatch()
  const countries = useSelector(AppState.getCountries)
  useOnUpdate(() => {
    dispatch(AppActions.updateCountries(sortCountries(countries, i18n)))
  }, [i18n])
  return countries
}
export const useCountriesPanEuropean = () =>
  (useCountries() as any).filter((country: any) => (Country.getRegionCodes(country) as any[]).includes(Area.levels.forest_europe))
export const useRegions = () => {
  const i18n = useI18n()
  const dispatch = useDispatch()
  const regions = useSelector(AppState.getRegions)
  useOnUpdate(() => {
    dispatch(AppActions.updateRegions(sortRegions(regions, i18n)))
  }, [i18n])
  return regions
}
/**
 * regionGroup =
 {
    "id": 1,
    "name": "fra",
    "order": 0
  },
 */
export const useGroupedRegions = () => {
  const regionGroups = useSelector(AppState.getRegionGroups)
  const regions = useRegions()
  return (regionGroups as any).map((rg: any) => ({
    ...rg,
    regions: (regions as any).filter((region: any) => region.regionGroup === rg.id),
  }))
}

/**
 * Returns array of region_codes
 * @returns {*}
 */
export const useFraRegions = () => {
  const groupedRegions = useGroupedRegions()
  const _fraRegionGroup = groupedRegions.find((groupedRegion) => groupedRegion.name === FRA.type)
  return _fraRegionGroup.regions.map((region) => region.regionCode)
}
