import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './app-components/home/home.component';
import { AppointmentsComponent } from './app-components/appointments/appointments.component';

const routes: Routes = [
  {path : '',pathMatch: 'full', redirectTo: 'home'},
  { path : 'home', component:HomeComponent},
  { path : 'appointment', component:AppointmentsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
