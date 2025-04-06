import { Message } from 'typegram';

export interface ResultState {
  gender: 'male' | 'female';
  contact: Message.ContactMessage['contact'];
}

export type ExpectedState = Partial<ResultState>;
