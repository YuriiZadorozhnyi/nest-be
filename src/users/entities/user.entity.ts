import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import * as bcrypt from 'bcrypt';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Factory((faker) => faker.name.findName())
  @Prop()
  name: string;

  @Factory((faker) => faker.name.lastName())
  @Prop()
  surname?: string;

  @Factory((faker) => faker.internet.email())
  @Prop()
  email: string;

  @Factory(() => bcrypt.hashSync('password', 10))
  @Prop()
  password: string;

  @Factory('refreshToken')
  @Prop()
  refreshToken: string;

  @Factory((faker) => faker.image.imageUrl())
  @Prop()
  imageUrl?: string;

  @Factory((faker) => faker.name.jobDescriptor())
  @Prop()
  description?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema.virtual('fullName')
  .set(function (fullName: string): void {
    const [name, surname] = fullName.split(' ');
    this.set({ name, surname });
  })
  .get(function (): string {
    return `${this.name} ${this.surname}`;
  });

UserSchema.index({
  name: 'text',
  surname: 'text',
  email: 'text',
  description: 'text',
});
