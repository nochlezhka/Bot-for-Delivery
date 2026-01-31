import { Message } from 'typegram';

export type ExpectedState = Partial<ResultState>;

export interface ResultState {
  contact: Message.ContactMessage['contact'];
  gender: 'female' | 'male';
}
