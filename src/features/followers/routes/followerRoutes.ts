import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@follower/controllers/follower-user';
import { Remove } from '@follower/controllers/unfollow-user';
import { Get } from '@follower/controllers/get-followers';
import { AddUser } from '@follower/controllers/block-user';

class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/user/following', authMiddleware.checkUserAuth, Get.prototype.userFollowing);
    this.router.get('/user/followers/:userId', authMiddleware.checkUserAuth, Get.prototype.userFollowers);

    this.router.put('/user/follow/:followerId', authMiddleware.checkUserAuth, Add.prototype.follower);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkUserAuth, Remove.prototype.follower);
    this.router.put('/user/block/:followerId', authMiddleware.checkUserAuth, AddUser.prototype.block);
    this.router.put('/user/unblock/:followerId', authMiddleware.checkUserAuth, AddUser.prototype.unblock);

    return this.router;
  }
}

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
