import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventModel } from 'src/app/interfaces/event-model';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'etm-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css']
})
export class EventsListComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  getEventsData$!: Observable<EventModel[]>;
  
  constructor(private eventsService: EventsService) { }

  ngOnInit(): void {
    this.getEventsData$ = this.eventsService.getAllEvents();
  }

}
