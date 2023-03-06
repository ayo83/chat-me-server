import JWT from 'jsonwebtoken';
import { NotAuthorizedError } from './error-handler';
import { Request, Response, NextFunction } from 'express';
import { AuthPayload } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';

export class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token Not Available. Please Login Again');
    }

    try {
      const payload: AuthPayload = JWT.verify(req.session?.jwt, config.JWT_TOKEN!) as AuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token Is Invalid. Please Login Again');
    }
    next();
  }

  public checkUserAuth(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Please Authenticate');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
