import { TestBed, inject } from '@angular/core/testing';

import { AuthComponent } from './Auth.component';

describe('a Auth component', () => {
	let component: AuthComponent;

	// register all needed dependencies
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthComponent
			]
		});
	});

	// instantiation through framework injection
	beforeEach(inject([AuthComponent], (AuthComponent) => {
		component = AuthComponent;
	}));

	it('should have an instance', () => {
		expect(component).toBeDefined();
	});
});