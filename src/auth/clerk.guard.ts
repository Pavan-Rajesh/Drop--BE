// auth/clerk.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: any }>();

    try {
      const requestState = await this.clerkClient.authenticateRequest(request, {
        authorizedParties: ['http://localhost:3000'],
      });

      if (requestState.isAuthenticated !== true)
        throw new UnauthorizedException('Unauthenticated');

      const verifiedTokenDetails = await verifyToken(requestState.token, {
        authorizedParties: ['http://localhost:3000'],
      });

      const user = await this.clerkClient.users.getUser(
        verifiedTokenDetails.sub,
      );

      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or missing Clerk session');
    }
  }
}
