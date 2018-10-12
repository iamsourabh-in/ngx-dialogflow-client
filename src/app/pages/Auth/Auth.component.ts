import { Component, OnInit } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

@Component({
	selector: 'Auth',
	templateUrl: 'Auth.component.html'
})

export class UAuthComponent implements OnInit {

	constructor(private router: Router) {

	}
	ngOnInit() {
		const stringJsonUser = localStorage.getItem('user_cred');
		if (stringJsonUser !== null) {
			this.router.navigate(['home']);
		}
	}

	printUser(user) {
		console.log(user);
		localStorage.setItem('user_cred', JSON.stringify(user));
		this.router.navigate(['home']);
	}

	printError() {
		console.log();
	}
}