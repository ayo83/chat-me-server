/* eslint-disable @typescript-eslint/no-explicit-any */
import { authService } from '@service/database/auth.service';
import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';
import * as cloudinaryUploads from '@global/helpers/cloudinary-upload';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { SignUp } from '../signup';
import { CustomError } from '@global/helpers/error-handler';
import { UserCache } from '@service/redis/user.cache';

jest.useFakeTimers();
jest.mock('@service/queues/base.queue');
jest.mock('@service/queues/auth.queue');
jest.mock('@service/queues/user.queue');
jest.mock('@service/redis/user.cache');
jest.mock('@service/redis/base.cache');
jest.mock('@global/helpers/cloudinary-upload');

describe('SignUp', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  /** USERNAME TEST */
  it('Should throw an error when username not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: '',
        email: 'hames@gmail.com',
        password: '123456',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Username is a required field');
    });
  });

  it('Should throw an error when username length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'we',
        email: 'hames@gmail.com',
        password: '12345',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('Should throw an error when username length is greater than max length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'weredfgty',
        email: 'hames@gmail.com',
        password: '123345',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  /** EMAIL TEST */
  it('Should throw an error when email is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'ertyuiom',
        email: '',
        password: '12345',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email is a required field');
    });
  });

  it('Should throw an error when email is not valid', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'ertyuiom',
        email: 'not valid',
        password: '12345',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Email must be valid');
    });
  });

  /** PASSWORD TEST */
  it('Should throw an error when password not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'wertyuio',
        email: 'hames@gmail.com',
        password: '',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Password is a required field');
    });
  });

  it('Should throw an error when password length is less than minimum length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'werty',
        email: 'hames@gmail.com',
        password: '123',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  it('Should throw an error when pass length is greater than max length', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'werty',
        email: 'hames@gmail.com',
        password: '1233456789',
        avatarColor: 'green',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Invalid password');
    });
  });

  /** USER ALREADY EXIST TEST */
  it('Should throw an unauthorized error if user already exist', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@me.com',
        password: '12334567',
        avatarColor: 'red',
        avatarImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'
      }
    ) as Request;

    const res: Response = authMockResponse();

    jest.spyOn(authService, 'getUserByEmailOrUsername').mockResolvedValue(authMock);

    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      expect(error.statusCode).toEqual(400);
      expect(error.serializeErrors().message).toEqual('Account Already Exist With User Or Email');
    });
  });

  /** CREATED SUCCESS USER TEST */
  it('should set session data for valid credentials and send correct json response', async () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
      }
    ) as Request;
    const res: Response = authMockResponse();

    jest.spyOn(authService, 'getUserByEmailOrUsername').mockResolvedValue(null as any);
    const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache');
    jest.spyOn(cloudinaryUploads, 'uploads').mockImplementation((): any => Promise.resolve({ version: '1234737373', public_id: '123456' }));

    await SignUp.prototype.create(req, res);
    expect(req.session?.jwt).toBeDefined();
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: userSpy.mock.calls[0][2],
      token: req.session?.jwt
    });
  });
});
