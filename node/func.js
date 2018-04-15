module.exports = {
  // check if user is logged from sessions
  isLogged: req => {
    if (req.session.username && req.session.uid && req.session.role) {
      return true
    }
    return false
  }
}