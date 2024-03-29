import createHttpError from "http-errors"

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Admin") {
    next()
  } else {
    next(createHttpError(403, "Admin Only Endpoint!"))
  }
}

export const hotelOwnerOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Owner") {
    next()
  } else {
    next(createHttpError(403, "Owner Only Endpoint!"))
  }
}