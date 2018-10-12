// import { Injectable } from '@angular/core';
// import { AngularFireAuth, AngularFireDatabase, FirebaseAuthState, AuthProviders, AuthMethods, AngularFire } from "angularfire2";
// import { Router } from "@angular/router";


// var firebase;

// @Injectable()
// export class AuthService {

// 	authState: FirebaseAuthState = null;

// 	constructor(private af: AngularFire,
// 		private db: AngularFireDatabase,
// 		private router: Router) {

// 		af.auth.subscribe((auth) => {
// 			this.authState = auth;
// 		});
// 	}

// 	// Returns true if user is logged in
// 	get authenticated(): boolean {
// 		return this.authState !== null;
// 	}
// 	get currentUser(): any {
// 		return this.authenticated ? this.authState.auth : null;
// 	}

// 	// Returns current user UID
// 	get currentUserId(): string {
// 		return this.authenticated ? this.authState.uid : '';
// 	}


// 	private socialSignIn(provider: number): firebase.Promise<FirebaseAuthState> {
// 		return this.af.auth.login({ provider, method: AuthMethods.Popup })
// 			.then(() => this.updateUserData())
// 			.catch(error => console.log(error));
// 	}

// 	private updateUserData(): void {

// 		let path = `users/${this.currentUserId}`; // Endpoint on firebase
// 		let data = {
// 			name: this.currentUser.displayName,
// 			email: this.currentUser.email,
// 		}

// 		this.db.object(path).update(data)
// 			.catch(error => console.log(error));

// 	}

// 	githubLogin(): firebase.Promise<FirebaseAuthState> {
// 		return this.socialSignIn(AuthProviders.Github);
// 	}

// 	googleLogin(): firebase.Promise<FirebaseAuthState> {
// 		return this.socialSignIn(AuthProviders.Google);
// 	}

// 	signOut(): void {
// 		this.af.auth.logout();
// 		this.router.navigate(['/']);
// 	}

// }