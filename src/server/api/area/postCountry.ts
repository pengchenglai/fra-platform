import { Response } from 'express'

import { CycleRequest } from 'meta/api/request'
import { Country } from 'meta/area'

import { AreaController } from 'server/controller/area'
import { AssessmentController } from 'server/controller/assessment'
import { MailService } from 'server/service'
import Requests from 'server/utils/requests'

export const postCountry = async (
  req: CycleRequest<{ notifySelf: string; notifyUsers: string }, { country: Country; message: string }>,
  res: Response
) => {
  try {
    const { countryIso, assessmentName, cycleName, notifySelf: notifySelfReq, notifyUsers: notifyUsersReq } = req.query

    const notifyUsers = notifyUsersReq === 'true'
    const notifySelf = notifySelfReq === 'true'

    const { country, message } = req.body
    const { assessment, cycle } = await AssessmentController.getOneWithCycle({ assessmentName, cycleName })

    const updatedCountry = await AreaController.updateCountry({
      countryIso,
      cycle,
      assessment,
      country,
      user: Requests.getUser(req),
    })

    if (notifyUsers || notifySelf) {
      await MailService.assessmentNotifyUsers({
        user: Requests.getUser(req),
        countryIso,
        assessmentName,
        country,
        cycle,
        message,
        notifyUsers,
        notifySelf,
      })
    }

    Requests.send(res, updatedCountry)
  } catch (e) {
    Requests.sendErr(res, e)
  }
}
