import { Component, OnInit } from '@angular/core';
import { Message } from '../../models/response';
import { Router } from '@angular/router';


@Component({
	selector: 'home',
	templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
	public message: Message;
	public messages: Message[] = [];
	public user: any;

	ngOnInit() {
		const stringJsonUser = localStorage.getItem('user_cred');
		if (stringJsonUser !== null) {
			this.user = JSON.parse(stringJsonUser);
			// this.message = new Message('', this.user.photoURL);
			// const defaultMsg = new Message(, 'assets/images/bot.png', new Date(), [], true);
			// this.messages.push(defaultMsg);
		} else {
			this.router.navigate(['auth']);
		}

	}

	constructor(private router: Router) {

	}
	signout() {
		localStorage.removeItem('user_cred');
		this.router.navigate(['auth']);
	}
}
