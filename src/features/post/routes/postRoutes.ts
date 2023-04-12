import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Create } from '@post/controllers/create-post';
import { Get } from '@post/controllers/get-posts';
import { Delete } from '@post/controllers/delete-post';
// import { Delete } from '@post/controllers/delete-post';
import { Update } from '@post/controllers/update-post';

class PostRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/post/post-all/:page', authMiddleware.checkUserAuth, Get.prototype.posts);
    this.router.get('/post/post-images/:page', authMiddleware.checkUserAuth, Get.prototype.postsWithImages);
    // this.router.get('/post/videos/:page', authMiddleware.checkAuthentication, Get.prototype.postsWithVideos);

    this.router.post('/post/create-post', authMiddleware.checkUserAuth, Create.prototype.post);
    this.router.post('/post/create-image-post', authMiddleware.checkUserAuth, Create.prototype.postWithImage);
    // this.router.post('/post/video/post', authMiddleware.checkAuthentication, Create.prototype.postWithVideo);

    this.router.put('/post/edit-post/:postId', authMiddleware.checkUserAuth, Update.prototype.posts);
    this.router.put('/post/image/:postId', authMiddleware.checkUserAuth, Update.prototype.postWithImage);
    // this.router.put('/post/video/:postId', authMiddleware.checkAuthentication, Update.prototype.postWithVideo);

    this.router.delete('/post/delete-post/:postId', authMiddleware.checkUserAuth, Delete.prototype.post);

    return this.router;
  }
}

export const postRoutes: PostRoutes = new PostRoutes();
