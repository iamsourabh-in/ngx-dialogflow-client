export class Message {
  speech: string;
  timestamp: Date;
  avatar: string;
  messages: any;
  isBot: boolean;
  type: number;
  replies: any;

  constructor(speech: string, avatar: string, timestamp?: Date, messages: any = [], isBot: boolean = false) {
    this.speech = speech;
    this.timestamp = timestamp;
    this.avatar = avatar;
    this.messages = messages;
    this.isBot = isBot;
  }
}
