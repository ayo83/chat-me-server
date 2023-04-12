// import { ICommentDocument } from '@comment/interfaces/comment.interface';
// import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { Server, Socket } from 'socket.io';
import Logger from 'bunyan';
import { config } from '@root/config';

const log: Logger = config.createLogger('postSocket');

export let socketIOPostObject: Server;

export class SocketIOPostHandler {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOPostObject = io;
  }

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      log.info(`${socket.id} joined post socket`);
      // console.log('Post Socket Io Handler');
      // socket.on('reaction', (reaction: IReactionDocument) => {
      //   this.io.emit('update like', reaction);
      // });

      // socket.on('comment', (data: ICommentDocument) => {
      //   this.io.emit('update comment', data);
      // });
    });
  }
}
