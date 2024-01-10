import express, { Router } from 'express';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Add } from '@chat/controllers/add-chat-message';
import { Get } from '@chat/controllers/get-chat-message';
import { Delete } from '@chat/controllers/delete-chat-message';
import { Update } from '@chat/controllers/update-chat-message';
import { Message } from '@chat/controllers/add-message-reaction';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/chat/message/conversation-list', authMiddleware.checkUserAuth, Get.prototype.conversationList);
    this.router.get('/chat/message/user/:receiverId', authMiddleware.checkUserAuth, Get.prototype.messages);
    this.router.post('/chat/message', authMiddleware.checkUserAuth, Add.prototype.message);
    this.router.post('/chat/message/add-chat-users', authMiddleware.checkUserAuth, Add.prototype.addChatUsers);
    this.router.post('/chat/message/remove-chat-users', authMiddleware.checkUserAuth, Add.prototype.removeChatUsers);
    this.router.put('/chat/message/mark-as-read', authMiddleware.checkUserAuth, Update.prototype.message);
    this.router.put('/chat/message/reaction', authMiddleware.checkUserAuth, Message.prototype.reaction);
    this.router.delete(
      '/chat/message/mark-as-deleted/:messageId/:senderId/:receiverId/:type',
      authMiddleware.checkUserAuth,
      Delete.prototype.markMessageAsDeleted
    );

    return this.router;
  }
}

export const chatRoutes: ChatRoutes = new ChatRoutes();
