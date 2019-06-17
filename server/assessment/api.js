const db = require('../db/db')
const repository = require('./assessmentRepository')
const { sendErr, sendOk, serverUrl } = require('../utils/requestUtils')
const { checkCountryAccessFromReqParams, checkAdminAccess } = require('../utils/accessControl')
const { sendAssessmentNotification } = require('./sendAssessmentNotification')

const fs = require('fs')
const JSZip = require('jszip')

module.exports.init = app => {

  app.post('/assessment/:countryIso', async (req, res) => {
    try {
      checkCountryAccessFromReqParams(req)
      const assessment = req.body
      const notifyUsers = req.query.notifyUsers === 'true'

      const isStatusChange = await db.transaction(
        repository.changeAssessment,
        [
          req.params.countryIso,
          req.user,
          assessment
        ]
      )

      if (isStatusChange && notifyUsers) {
        await sendAssessmentNotification(req.params.countryIso, assessment, req.user, serverUrl(req))
      }

      sendOk(res)
    } catch (err) {
      sendErr(res, err)
    }
  })

  app.get('/assessment/:countryIso/export', async (req, res) => {
    try {
      checkAdminAccess(req.user)

      const zip = new JSZip()
      zip.file('file.txt', 'a')
      zip
        .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        .pipe(res)
        .on('finish', function () {
          // JSZip generates a readable stream with a "end" event,
          // but is piped here in a writable stream which emits a "finish" event.
          res.end()
        })

    } catch (err) {
      sendErr(res, err)
    }
  })

}
