import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Schema } from 'mongoose';
import { LoginStreakParamsSchema } from './login-streak.params.schema';
import { InviteFriendsParamsSchema } from './invite-friends.params.schema';
import { CustomParamsSchema } from './custom.params.schema';

@Injectable()
export class ConditionDiscriminatorProvider implements OnModuleInit {
  constructor(@InjectConnection() private conn: Connection) {}

  onModuleInit() {
    const ConditionModel = this.conn.model('Condition');
    ConditionModel.discriminator('loginStreak', new Schema({ parameters: LoginStreakParamsSchema.obj }));
    ConditionModel.discriminator('inviteFriends', new Schema({ parameters: InviteFriendsParamsSchema.obj }));
    ConditionModel.discriminator('custom',       new Schema({ parameters: CustomParamsSchema.obj }));
  }
}
