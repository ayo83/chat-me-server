import { SignIn } from '@auth/controllers/signin';
import { SignOut } from '@auth/controllers/signout';
import { SignUp } from '@auth/controllers/signup';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/sign-up', SignUp.prototype.create);
    this.router.post('/auth/login', SignIn.prototype.login);

    return this.router;
  }

  public signOutRoute(): Router {
    this.router.get('/auth/sign-out', SignOut.prototype.logout);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
