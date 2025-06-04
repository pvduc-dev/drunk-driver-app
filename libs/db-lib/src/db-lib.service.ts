import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class DbLibService implements OnApplicationBootstrap {
  constructor() {}

  async onApplicationBootstrap() {
    // TODO: Create indexes for the database
  }
}
