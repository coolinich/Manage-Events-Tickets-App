import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventCreateRequest, EventModel } from 'src/app/interfaces/event-model';
import { EventsService } from 'src/app/services/events.service';
import { EVENT_TYPES } from 'src/assets/constants';

@Component({
  selector: 'etm-new-event-form',
  templateUrl: './new-event-form.component.html',
  styleUrls: ['./new-event-form.component.css']
})
export class NewEventFormComponent implements OnInit {
  eventTypes: string[] = EVENT_TYPES;
  private readonly activeFormSubject$ = new Subject;

  newEventForm = this.fb.group({
    name: ['', Validators.required],
    type: [this.eventTypes[0], Validators.required],
    location: ['', Validators.required],
    date: ['', Validators.required],
    description: [''], 
    capacity: ['']
  });


  
  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.activeFormSubject$.next(); 
  }

  onSubmit(formDirective: FormGroupDirective) {
    const newEventFormData = this.prepareFormData();
    this.eventsService
      .createNewEvent(newEventFormData)
      .pipe(takeUntil(this.activeFormSubject$))
      .subscribe(
        res => {
          formDirective.resetForm();
          this.newEventForm.reset();
        },
        err => {
          console.log(err);
        } 
      )
  }

  onCancel(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.newEventForm.reset();
  }

  prepareFormData(): EventModel {
    let submittedData = this.newEventForm.getRawValue();
    submittedData.date = new Date(submittedData.date);
    return submittedData;
  } 

  get eventDate() {
    return this.newEventForm.get('date');
  }

  get eventName() {
    return this.newEventForm.get('name');
  }

  get eventLocation() {
    return this.newEventForm.get('location');
  }

  get eventType() {
    return this.newEventForm.get('type');
  }

}
