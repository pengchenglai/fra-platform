const {mostPowerfulRole, isReviewer} = require('../../common/countryRole')

function AccessControlException (message) {
  this.message = message
  Error.captureStackTrace(this, AccessControlException)
}

AccessControlException.prototype = Object.create(Error.prototype)
AccessControlException.prototype.name = 'AccessControlException'
AccessControlException.prototype.constructor = AccessControlException

// Checks whether user should have access to the specified country
// Throws a custom Error user has no access (handled in sendErr)
const checkCountryAccess = (countryIso, user) => {
  const role = mostPowerfulRole(countryIso, user)
  if (role.role === 'NONE') {
    const errMsg = `User ${user.name} tried to access ${countryIso} but no role has been specified`
    throw new AccessControlException(errMsg)
  }
}

// Checks whether user is reviewer of the specified country
// Throws a custom Error user has no access (handled in sendErr)
const checkReviewerCountryAccess = (countryIso, user) => {
  if (!isReviewer(countryIso, user)) {
    const errMsg = `User ${user.name} tried to access ${countryIso} of which is not reviewer`
    throw new AccessControlException(errMsg)
  }
}

// Digs the countryIso from path or request params and checks access
// WARNING: the param name needs to be exactly 'countryIso'
// If it's not, use checkCountryAccess instead
const checkCountryAccessFromReqParams = (req) => {
  if (req.params.countryIso) checkCountryAccess(req.params.countryIso, req.session.passport.user)
  if (req.query.countryIso) checkCountryAccess(req.query.countryIso, req.session.passport.user)
}

module.exports.checkCountryAccess = checkCountryAccess
module.exports.checkCountryAccessFromReqParams = checkCountryAccessFromReqParams
module.exports.AccessControlException = AccessControlException
