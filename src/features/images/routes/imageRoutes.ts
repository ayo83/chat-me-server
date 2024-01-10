import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@image/controllers/add-image';
import { Delete } from '@image/controllers/delete-image';
import { Get } from '@image/controllers/get-images';

class ImageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/images/:userId', authMiddleware.checkUserAuth, Get.prototype.images);
    this.router.post('/images/profile', authMiddleware.checkUserAuth, Add.prototype.profileImage);
    this.router.post('/images/background', authMiddleware.checkUserAuth, Add.prototype.backgroundImage);
    this.router.delete('/images/:imageId', authMiddleware.checkUserAuth, Delete.prototype.image);
    this.router.delete('/images/background/:bgImageId', authMiddleware.checkUserAuth, Delete.prototype.backgroundImage);

    return this.router;
  }
}

export const imageRoutes: ImageRoutes = new ImageRoutes();
