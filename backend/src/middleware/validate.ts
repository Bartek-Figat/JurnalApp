import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";
import { LoginDto, RegisterDto } from "../dto/dto";

async function validateLoginIncomingFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userRegisterValidation = new LoginDto();
  Object.assign(userRegisterValidation, req.body);

  const validationErrors = await validate(userRegisterValidation);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors });
  }
  return next();
}

async function validateRegisterIncomingFields(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userRegisterValidation = new RegisterDto();
  console.log(req.body);
  Object.assign(userRegisterValidation, req.body);

  const validationErrors = await validate(userRegisterValidation);
  if (validationErrors.length > 0) {
    return res.status(400).json({ error: validationErrors });
  }
  return next();
}

export { validateLoginIncomingFields, validateRegisterIncomingFields };
