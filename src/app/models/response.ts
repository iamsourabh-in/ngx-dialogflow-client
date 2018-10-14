

export interface Context {
    name: string;
    parameters: any;
    lifespan: number;
}

export interface Metadata {
    intentId: string;
    webhookUsed: string;
    webhookForSlotFillingUsed: string;
    isFallbackIntent: string;
    intentName: string;
}

export class Message {
    type: any;
    platform: string;
    textToSpeech: string;
    avatar: string;
    speech: string;
    isBot: boolean;
    replies: string[];
    messages: any;
    timestamp: Date;
    suggestions: any;
    constructor(speech: string, avatar: string, timestamp?: Date, messages: any = [], isBot: boolean = false) {
        this.speech = speech;
        this.timestamp = timestamp;
        this.avatar = avatar;
        this.messages = messages;
        this.isBot = isBot;
    }
}

export interface Fulfillment {
    speech: string;
    messages: Message[];
}

export interface Result {
    source: string;
    resolvedQuery: string;
    action: string;
    actionIncomplete: boolean;
    parameters: any;
    contexts: Context[];
    metadata: Metadata;
    fulfillment: Fulfillment;
    score: number;
}

export interface Status {
    code: number;
    errorType: string;
}

export interface DFResponse {
    id: string;
    timestamp: Date;
    lang: string;
    result: Result;
    status: Status;
    sessionId: string;
}


