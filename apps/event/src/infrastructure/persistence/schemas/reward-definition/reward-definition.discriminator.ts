import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Schema } from 'mongoose';
import { PointsDetailSchema } from './points-detail.schema';
import { ItemDetailSchema } from './item-detail.schema';
import { CouponDetailSchema } from './coupon-detail.schema';


@Injectable()
export class RewardDefinitionDiscriminatorProvider implements OnModuleInit {
  constructor(@InjectConnection() private conn: Connection) {}

  onModuleInit() {
    const Model = this.conn.model('RewardDefinition');
    Model.discriminator('points', new Schema({ detail: PointsDetailSchema.obj }));
    Model.discriminator('item',   new Schema({ detail: ItemDetailSchema.obj }));
    Model.discriminator('coupon', new Schema({ detail: CouponDetailSchema.obj }));
  }
}
