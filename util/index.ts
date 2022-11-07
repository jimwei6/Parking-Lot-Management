function asyncHandler(asyncFunction: Function) {
  return async (req: Express.Request, res: Express.Response, next: Function) => Promise.resolve(asyncFunction(req, res, next).catch(next));
}

export default {
  asyncHandler
}