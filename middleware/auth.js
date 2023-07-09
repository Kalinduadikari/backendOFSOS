import jwt from "jsonwebtoken";
import Fishmonger from "../Models/fishmongers";
import CustomError from "../errors/CustomError";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new CustomError(401, "Not authorized, no token found", "NO_TOKEN_FOUND", "No token found in the request headers or cookies.", new Error().stack));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const fishmonger = await Fishmonger.findById(decoded.id).select("-password");

    if (!fishmonger) {
      return next(
        new CustomError(
          404,
          "No fishmonger found with this ID",
          "FISHMONGER_NOT_FOUND",
          `Fishmonger with ID ${decoded.id} not found.`,
          new Error().stack
        )
      );
    }

    req.fishmonger = fishmonger;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new CustomError(
          401,
          "Not authorized, invalid token",
          "INVALID_TOKEN",
          "The provided token is invalid or expired.",
          new Error().stack
        )
      );
    } else {
      next(error);
    }
  }
};
