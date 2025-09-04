import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filteredUsers = users.filter(user => user.email === email);
                return Promise.resolve(filteredUsers);
            },
            create: (email: string, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as User
                users.push(user);
                return Promise.resolve(user);
            },
        };

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ],
        }).compile();

        service = module.get(AuthService);
    });

    it('can create an instance of auth service', async () => {
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('generic@account.com', 'genericpassword');
    
        expect(user.password).not.toEqual('genericpassword');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('generic@account.com', 'genericpassword');
        await expect(service.signup('generic@account.com', 'genericpassword')).rejects.toThrow(
        BadRequestException,
        );
    });

    it('throws if signin is called with an unused email', async () => {
        await expect(
          service.signin('generic@account.com', 'genericpassword'),
        ).rejects.toThrow(NotFoundException);
    });

    it('throws if an invalid password is provided', async () => {
        await service.signup('generic@account.com', 'genericpassword');
        await expect(
            service.signin('generic@account.com', 'wrongpassword'),
        ).rejects.toThrow(BadRequestException);
    });

    it('returns a user if corrent password is provided', async () => {
        await service.signup('generic@account.com', 'genericpassword');

        const user = await service.signin('generic@account.com', 'genericpassword');
        expect(user).toBeDefined();
    });
});