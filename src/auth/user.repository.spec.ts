import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';

const mockCredentialsDto = {
  username: 'TestUsername',
  password: 'TestPassword',
};

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn()  ;
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('should sign up a user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('should throw a conflict exception as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });

      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });
    it('should throw a conflict exception as username already exists', () => {
        save.mockRejectedValue({ code: '12123123' });//UNHANDLED ERROR CODE

        expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();

      user = new User();

      user.username = 'TestUsername';

      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is successful',async  () => {
      userRepository.findOne.mockResolvedValue(user);
        user.validatePassword.mockResolvedValue(true);
        const result = await userRepository.validateUserPassword(mockCredentialsDto);

        expect(result).toEqual('TestUsername');
        
    });

    it('returns null as user cannot be found', () => {});

    it('returns null as password is invalid', () => {});
  });
});
