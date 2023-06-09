import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@reaction/controllers/add-reaction';
import { Remove } from '@reaction/controllers/remove-reaction';
import { Get } from '@reaction/controllers/get-reactions';

class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/reactions/:postId', authMiddleware.checkUserAuth, Get.prototype.reactions);

    this.router.get('/post/single/reaction/username/:username/:postId', authMiddleware.checkUserAuth, Get.prototype.singleReactionByUsername);

    this.router.get('/post/reactions/username/:username', authMiddleware.checkUserAuth, Get.prototype.reactionsByUsername);

    this.router.post('/post/reaction', authMiddleware.checkUserAuth, Add.prototype.reaction);

    this.router.delete('/post/reaction/:postId/:previousReaction/:postReactions', authMiddleware.checkUserAuth, Remove.prototype.reaction);

    return this.router;
  }
}

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
