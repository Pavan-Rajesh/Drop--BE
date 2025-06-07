// clerk.controller.ts
import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { createClerkClient } from '@clerk/backend';
import { verifyWebhook } from '@clerk/express/webhooks';

@Controller('api/clerk')
export class ClerkController {
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  @Post('webhook')
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const event = await verifyWebhook(req);
      if (event.type == 'user.created') {
        console.log(event.data.id);
      }

      return res.status(200).send('ok');
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(400).send('Webhook verification failed');
    }
  }
}
