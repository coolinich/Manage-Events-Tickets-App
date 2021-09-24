import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsListComponent } from './components/events-list/events-list.component';
import { NewEventFormComponent } from './components/new-event-form/new-event-form.component';

const routes: Routes = [
  { path: 'new-event', component: NewEventFormComponent },
  { path: '', component:  EventsListComponent},
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: '**', component: EventsListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
