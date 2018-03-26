var local = {
  // check if user is logged from sessions
  isLogged: req => {
    if (req.session.username) { return true }
    return false
  }
}
module.exports = local
