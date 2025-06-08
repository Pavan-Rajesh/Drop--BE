import { createClerkClient, verifyToken } from '@clerk/backend';
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { type User } from '@clerk/backend';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request & { user?: User }, res: Response, next: NextFunction) {
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    });

    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    const auth = await clerkClient.authenticateRequest(
      new Request(fullUrl, {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
        body: JSON.stringify(req.body),
      }),
    );

    if (!auth.isAuthenticated) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const tokenDetails = await verifyToken(auth.token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const user = await clerkClient.users.getUser(tokenDetails.sub);

    req.user = user;

    next();
  }
}
