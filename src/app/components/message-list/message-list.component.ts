import { Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Message } from '../../models/message';
import { MessageItemComponent } from '../../components/message-item/message-item.component';

@Component({
  selector: 'message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit, AfterViewInit {

  // tslint:disable-next-line:no-input-rename
  @Input('messages')
  public messages: Message[];

  @ViewChild('chatlist', { read: ElementRef }) chatList: ElementRef;
  @ViewChildren(MessageItemComponent, { read: ElementRef }) chatItems: QueryList<MessageItemComponent>;

  constructor() { }

  ngAfterViewInit() {
    console.log('Messages', this.messages);
    this.chatItems.changes.subscribe(elements => {
      // console.log('messsage list changed: ' + this.messages.length);
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight;
    } catch (err) {
      console.log('Could not find the "chatList" element.');
    }
  }

  ngOnInit() {
  }

}
