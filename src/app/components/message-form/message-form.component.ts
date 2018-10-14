import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DFResponse, Message } from '../../models/response';
import { DialogflowService } from '../../services/dialogflow.service';
import { SpeechRecognitionService } from '../../services/Speech.service';
import { Router } from '@angular/router';
import { AIAPIClient } from '../../services/dialogflow.googleservice';

interface request { text: string; }

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
  providers: [AIAPIClient]
})
export class MessageFormComponent implements OnInit, OnDestroy {
  showSearchButton: boolean;
  speechSubscription: any;
  user: any;
  sugesstions = ['Hi', 'Hello', 'Help', 'What can you do for me?', 'Search Doctor', 'Search Dentist', 'Thanks'];
  request: request;


  // tslint:disable-next-line:no-input-rename
  @Input('message')
  public message: Message;

  // tslint:disable-next-line:no-input-rename
  @Input('messages')
  public messages: Message[];

  localMessages: any;

  constructor(private router: Router,
    private dialogFlowService: DialogflowService,
    public speechRecognitionService: SpeechRecognitionService,
    public dialogflowClient: AIAPIClient
  ) {
    this.request = { text: '' };
    this.showSearchButton = true;
    const stringJsonUser = localStorage.getItem('user_cred');
    if (stringJsonUser == null) {
      this.router.navigate(['home']);
    } else {
      this.user = JSON.parse(stringJsonUser);
    }
  }

  ngOnInit() {
    this.dialogflowClient.talk('hello');
  }

  public sendMessage(): void {
    if (this.request.text !== '') {
      // add ...

      this.sugesstions = [];

      this.message = new Message(this.request.text, this.user.providerData[0].photoURL, new Date(), [{ speech: this.request.text }], false);
      this.messages.push(this.message);

      const amessage = new Message('Hello', 'assets/images/bot.png', new Date(), [{ speech: '...', type: 0 }], true);
      this.messages.push(amessage);


      this.dialogFlowService.getResponse(this.request.text).subscribe((res: DFResponse) => {
        console.log(res);
        this.messages.pop();
        this.messages.push(new Message('', 'assets/images/bot.png', res.timestamp, res.result.fulfillment.messages, true));
        res.result.fulfillment.messages.forEach(element => {
          if (element.type === 2 || element.type === 'suggestion_chips') {
            if (element.platform === 'google') {
              element.suggestions.forEach(sugession => {
                this.sugesstions.push(sugession.title);
              });
            } else {
              element.replies.forEach(sugession => {
                this.sugesstions.push(sugession);
              });
            }
          }
        });

      });
      this.request.text = '';
      this.message = new Message('', this.user.providerData[0].photoURL);
    }
  }
  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }
  activateSpeechSearchMovie(): void {
    this.showSearchButton = false;

    this.speechSubscription = this.speechRecognitionService.record()
      .subscribe(
        // listener
        (value) => {
          this.request.text = value;
          console.log(value);
        },
        // errror
        (err) => {
          console.log(err);
          if (err.error === 'no-speech') {
            console.log('--restatring service--');
            this.activateSpeechSearchMovie();
          }
        },
        // completion
        () => {
          this.showSearchButton = true;
          console.log('--complete--');
          this.activateSpeechSearchMovie();
        });
  }
  suggest(suggestion) {
    this.request.text = suggestion;
    this.sendMessage();
    this.sugesstions = [];
  }
  stopSpeechSearchMovie() {
    this.speechRecognitionService.DestroySpeechObject();
    this.speechSubscription.unsubscribe();
    this.showSearchButton = !this.showSearchButton;
  }

}
