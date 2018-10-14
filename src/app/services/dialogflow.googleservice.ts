// import { ApiAiClient } from 'api-ai-javascript';
import { Injectable } from '../../../node_modules/@angular/core';


@Injectable()
export class AIAPIClient {
    apiClient: any;
    sessionPath: any;

    constructor() {
        // this.apiClient = new ApiAiClient({ accessToken: 'b5833de0143640918029c8f6349ccd26' });
        // this.sessionClient = new dialogflow.SessionsClient();
        // this.sessionPath = this.sessionClient.sessionPath('healthapp-7e8f7', '12345');
    }

    talk(query) {
        // this.apiClient.textRequest('Hello!')
        //     .then((response) => { console.log(response); })
        //     .catch((error) => { console.log(error); });
    }


    logQueryResult(session, response) {
        console.log(session, response);
    }


}

