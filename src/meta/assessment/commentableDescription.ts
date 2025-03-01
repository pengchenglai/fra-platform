import { CountryIso } from '@meta/area'

export enum CommentableDescriptionName {
  dataSources = 'dataSources',
  generalComments = 'generalComments',
  nationalClassificationAndDefinitions = 'nationalClassificationAndDefinitions',
  originalData = 'originalData',
  reclassification = 'reclassification',
  estimationAndForecasting = 'estimationAndForecasting',
  introductoryText = 'introductoryText',
}
export interface DataSource {
  reference: string
  type: string
  fraVariables: string[]
  year: string
  comments: string
}

export interface CommentableDescriptionValue {
  text: string
  dataSources?: Array<DataSource>
}

export interface CommentableDescription {
  id: number
  countryIso: CountryIso
  sectionName: string
  name: CommentableDescriptionName
  value: CommentableDescriptionValue
}
