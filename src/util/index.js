function asyncHandler(asyncFunction) {
  return async (req, res, next) => Promise.resolve(asyncFunction(req, res, next).catch(next));
}

export default {
  asyncHandler
}