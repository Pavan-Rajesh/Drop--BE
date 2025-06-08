import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('private')
export class PrivateController {
  @Get('protected')
  getPrivate() {
    return 'Private';
  }

  @Get('public')
  @Public()
  getTest() {
    return 'Test';
  }
}
