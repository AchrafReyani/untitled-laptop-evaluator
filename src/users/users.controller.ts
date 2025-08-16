import { Body, Controller, Post, Get, Patch, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post('/signup')
    createUser(@Body()  body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
       return this.usersService.findOne(parseInt(id)); 
    }

    @Get('/')
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }
}
