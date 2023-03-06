import { IUserDocument } from '@user/interfaces/user.interface';
import { ObjectId } from 'mongodb';
import JWT from 'jsonwebtoken';
import { UploadApiResponse } from 'cloudinary';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { DuplicateError, BadRequestError } from '@global/helpers/error-handler';
import { authService } from '@service/database/auth.service';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { uploads } from '@global/helpers/cloudinary-upload';
import { Helpers } from '@global/helpers/helpers';
import { UserCache } from '@service/redis/user.cache';
import { config } from '@root/config';
import { omit } from 'lodash';
import { authQueue } from '@service/queues/auth.queue';
import { userQueue } from '@service/queues/user.queue';

const userCache: UserCache = new UserCache();

export class SignUp {
  @joiValidation(signupSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, avatarColor, avatarImage } = req.body;
    const checkUserExist: IAuthDocument = await authService.getUserByEmailOrUsername(username, email);
    if (checkUserExist) {
      throw new DuplicateError('Account Already Exist With User Or Email');
    }

    const authObjectId: ObjectId = new ObjectId();
    const userObjectId: ObjectId = new ObjectId();
    const uId = `${Helpers.generateRadomIntegers(12)}`;

    const authData: IAuthDocument = SignUp.prototype.signupData({
      _id: authObjectId,
      uId,
      username,
      email,
      password,
      avatarColor
    });

    // UPLOAD IMAGE TO CLOUD
    const imageUpload: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
    if (!imageUpload) {
      throw new BadRequestError('Error occurred During File Upload. Try Again');
    }

    // ADD TO REDIS CACHE
    const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);

    userDataForCache.profilePicture = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${imageUpload.version}/${userObjectId}`;

    await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache);

    // ADD TO DATABASE
    const omittedUserDated = omit(userDataForCache, ['uId', 'username', 'email', 'avatarColor', 'password']);
    authQueue.addAuthUserJob('addAuthUserToJob', { value: authData });
    userQueue.addUserJob('addUserToJob', { value: omittedUserDated });

    // SIGN TOKEN
    const userJwt: string = SignUp.prototype.signToken(authData, userObjectId);
    req.session = { jwt: userJwt };

    res.status(HTTP_STATUS.CREATED).json({ status: 'success', message: 'Account Created', user: userDataForCache, token: userJwt });
  }

  private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
    return JWT.sign(
      {
        userId: userObjectId,
        uId: data.uId,
        email: data.email,
        username: data.username,
        avatarColor: data.avatarColor
      },
      config.JWT_TOKEN!
    );
  }

  private signupData(data: ISignUpData): IAuthDocument {
    const { _id, uId, username, email, password, avatarColor } = data;
    return {
      _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email: Helpers.lowerCase(email),
      password,
      avatarColor,
      createdAt: new Date()
    } as IAuthDocument;
  }

  private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
    const { _id, uId, username, email, password, avatarColor } = data;
    return {
      _id: userObjectId,
      authId: _id,
      uId,
      username: Helpers.firstLetterUppercase(username),
      email,
      password,
      avatarColor,
      profilePicture: '',
      blocked: [],
      blockedBy: [],
      work: '',
      location: '',
      school: '',
      quote: '',
      bgImageVersion: '',
      bgImageId: '',
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      notifications: {
        messages: true,
        reactions: true,
        comments: true,
        follows: true
      },
      social: {
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
      }
    } as unknown as IUserDocument;
  }
}
