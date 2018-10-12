import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models/response';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.scss']
})
export class MessageItemComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('message')
  public message: Message;

  constructor() { }

  ngOnInit() {
    console.log('MessageItemComponent', this.message);
  }

}
