const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to preform this action."
    });
  } 

  next();
}

const checkAdmin = async () => {
  if (req.user.isAdmin) {
    return true;
  } else {
    return false;
  }
}

module.exports = { requireUser, checkAdmin };