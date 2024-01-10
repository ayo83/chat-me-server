import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Get } from '@comment/controllers/get-comments';
import { Add } from '@comment/controllers/add-comment';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/comments/:postId', authMiddleware.checkUserAuth, Get.prototype.comments);
    this.router.get('/post/comment-names/:postId', authMiddleware.checkUserAuth, Get.prototype.commentsNamesFromCache);
    this.router.get('/post/single/comment/:postId/:commentId', authMiddleware.checkUserAuth, Get.prototype.singleComment);

    this.router.post('/post/comment', authMiddleware.checkUserAuth, Add.prototype.comment);

    return this.router;
  }
}

export const commentRoutes: CommentRoutes = new CommentRoutes();
