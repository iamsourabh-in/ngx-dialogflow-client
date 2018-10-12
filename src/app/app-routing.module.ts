import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '../../node_modules/ngx-auth-firebaseui';
import { MessageItemComponent } from './components/message-item/message-item.component';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { UAuthComponent } from './pages/Auth/Auth.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '', component: UAuthComponent },
  { path: 'auth', component: UAuthComponent },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }

export const RoutingComponents = [HomeComponent, UAuthComponent, MessageListComponent,
  MessageFormComponent, ProfileComponent,
  MessageItemComponent];
