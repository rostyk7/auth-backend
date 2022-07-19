const asyncHandler = (callback) => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch(e) {
    console.log(e);
    next(e);
  }
};

module.exports = asyncHandler;