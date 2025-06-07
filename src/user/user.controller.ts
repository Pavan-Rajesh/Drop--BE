// src/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { verifyWebhook, WebhookEvent } from '@clerk/express/webhooks';
import { Request, Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Post('webhook')
  async syncData(
    @Req() request: Request,
    @Body() webhookEvent: WebhookEvent,
    @Res() response: Response,
  ) {
    try {
      const clerkWebhookEvent = await verifyWebhook(request);
      console.log('verifiedevent', clerkWebhookEvent);
      console.log('request body', webhookEvent);
      return response.status(HttpStatus.OK).json(clerkWebhookEvent);
    } catch (error) {
      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:
          error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
