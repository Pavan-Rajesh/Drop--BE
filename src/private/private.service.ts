import { Injectable } from '@nestjs/common';

@Injectable()
export class PrivateService {
  create() {
    console.log('this is public method');
  }

  privateCreate() {
    console.log('this is private method');
  }
}
