import { Component, Input, OnInit } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { EventModel } from 'src/app/interfaces/event-model';

@Component({
  selector: 'etm-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() eventItem!: EventModel;
  unsoldTicketsCounter: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.unsoldTicketsCounter = this.eventItem && this.eventItem.capacity && this.eventItem.tickets ?
    this.eventItem.capacity - this.eventItem.tickets.sold - this.eventItem.tickets.validated : 0;
  }

}
