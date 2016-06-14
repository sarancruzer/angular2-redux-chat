/**
 * Copyright 2016, Fullstack.io, LLC.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Component,
  ChangeDetectionStrategy,
  ElementRef
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import {
  User,
  Message,
  Thread
} from '../models';
import {
  ThreadActions
} from '../actions';
import {
  AppState,
  getCurrentThread,
  getCurrentUser
} from '../reducers';
import ChatMessage from '../components/ChatMessage';

@Component({
  selector: 'chat-window',
  directives: [ChatMessage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chat-window-container">
      <div class="chat-window">
        <div class="panel-container">
          <div class="panel panel-default">

            <div class="panel-heading top-bar">
              <div class="panel-title-container">
                <h3 class="panel-title">
                  <span class="glyphicon glyphicon-comment"></span>
                  Chat - {{currentThread.name}}
                </h3>
              </div>
              <div class="panel-buttons-container"  >
                <!-- you could put minimize or close buttons here -->
              </div>
            </div>

            <div class="panel-body msg-container-base">
              <chat-message
                   *ngFor="let message of currentThread.messages"
                   [message]="message">
              </chat-message>
            </div>

            <div class="panel-footer">
              <div class="input-group">
                <input type="text"
                       class="chat-input"
                       placeholder="Write your message here..."
                       (keydown.enter)="onEnter($event)"
                       [(ngModel)]="draftMessage.text" />
                <span class="input-group-btn">
                  <button class="btn-chat"
                     (click)="onEnter($event)"
                     >Send</button>
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `
})
export default class ChatWindow {
  currentThread: Thread;
  draftMessage: {text: string};
  currentUser: User;

  constructor(private store: Store<AppState>,
              private threadActions: ThreadActions,
              private el: ElementRef) {
    store.let(getCurrentThread()).subscribe((t) => this.currentThread = t);
    store.let(getCurrentUser()).subscribe((u) => this.currentUser = u);
    this.draftMessage = { text: '' };
  }

  // ngOnInit(): void {
  //   this.messages = this.threadsService.currentThreadMessages;
  //
  //   this.draftMessage = new Message();
  //
  //   this.threadsService.currentThread.subscribe(
  //     (thread: Thread) => {
  //       this.currentThread = thread;
  //     });
  //
  //   this.userService.currentUser
  //     .subscribe(
  //       (user: User) => {
  //         this.currentUser = user;
  //       });
  //
  //   this.messages
  //     .subscribe(
  //       (messages: Array<Message>) => {
  //         setTimeout(() => {
  //           this.scrollToBottom();
  //         });
  //       });
  // }
  //
  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }

  sendMessage(): void {
    this.store.dispatch(this.threadActions.addMessage(
      this.currentThread,
      {
        author: this.currentUser,
        isRead: true,
        text: this.draftMessage.text
      }
    ));
  }

  scrollToBottom(): void {
    let scrollPane: any = this.el
      .nativeElement.querySelector('.msg-container-base');
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }
}
