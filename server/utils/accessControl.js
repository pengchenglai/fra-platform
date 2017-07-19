const { mostPowerfulRole } = require('../../common/countryRole')

function AccessControlException(message) {
  this.message = message
  Error.captureStackTrace(this, AccessControlException)
}

AccessControlException.prototype = Object.create(Error.prototype);
AccessControlException.prototype.name = "AccessControlException";
AccessControlException.prototype.constructor = AccessControlException;

// Checks whether user should have access to the specified country
// Throws a custom Error user has no access (handled in sendErr)
const checkCountryAccess = (countryIso, req) => {
  const user = req.session.passport.user
  const role = mostPowerfulRole(countryIso, user)
  if (role.role === 'NONE') {
    const errMsg = `User ${user.name} tried to access ${countryIso} but no role has been specified`
    throw new AccessControlException(errMsg)
  }
}

// Digs the countryIso from path or request params and checks access
// WARNING: the param name needs to be exactly 'countryIso'
// If it's not, use checkCountryAccess instead
const checkCountryAccessFromReqParams = (req) => {
  if (req.params.countryIso) checkCountryAccess(req.params.countryIso, req)
  if (req.query.countryIso) checkCountryAccess(req.query.countryIso, req)
}

module.exports.checkCountryAccess = checkCountryAccess
module.exports.checkCountryAccessFromReqParams = checkCountryAccessFromReqParams
module.exports.AccessControlException = AccessControlException
