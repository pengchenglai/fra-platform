import { CountryIso } from '@meta/area'
import { Assessment, Cycle, Row } from '@meta/assessment'
import { User } from '@meta/user'

const getDataReviewTopicKey = (row: Row): string => row.uuid

const getMessageBoardCountryKey = (): string => `message_board`

const getMessageBoardChatKey = (userA: User, userB: User): string => {
  const userKeys = [userA.id, userB.id].sort((idA, idB) => idA - idB).join('_')
  const countryKey = getMessageBoardCountryKey()
  return `${countryKey}_chat_${userKeys}`
}

const getCommentableDescriptionKey = (
  countryIso: CountryIso,
  assessment: Assessment,
  cycle: Cycle,
  sectionName: string,
  name: string
): string => `commentable-description-${[countryIso, assessment.props.name, cycle.name, sectionName, name].join('_')}`

export const Topics = {
  getDataReviewTopicKey,
  getMessageBoardCountryKey,
  getMessageBoardChatKey,
  getCommentableDescriptionKey,
}
