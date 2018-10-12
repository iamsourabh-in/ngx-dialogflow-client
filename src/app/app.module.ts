import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule, RoutingComponents, routes } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DialogflowService } from './services';
import { HttpModule } from '../../node_modules/@angular/http';
import { SpeechRecognitionService } from './services/Speech.service';


@NgModule({
  declarations: [
    AppComponent,
    ...RoutingComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    // Specify the ngx-auth-firebaseui library as an import
    NgxAuthFirebaseUIModule.forRoot({
      apiKey: 'AIzaSyDP2f9u8h6y4nL1rr6B5mdaEM5LwDJ6xco',
      authDomain: 'healthapp-7e8f7.firebaseapp.com',
      databaseURL: 'https://healthapp-7e8f7.firebaseio.com',
      projectId: 'healthapp-7e8f7',
      storageBucket: 'healthapp-7e8f7.appspot.com',
      messagingSenderId: '208710504269'
    }),
  ],
  providers: [DialogflowService, SpeechRecognitionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
