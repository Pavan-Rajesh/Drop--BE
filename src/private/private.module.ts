import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrivateService } from './private.service';
import { PrivateController } from './private.controller';
import { AuthMiddleware } from 'src/auth/middlewares/auth.middleware';

@Module({
  providers: [PrivateService],
  controllers: [PrivateController],
})
export class PrivateModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PrivateController);
  }
}
