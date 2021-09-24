import { Component, Input, OnInit } from '@angular/core';
import { EventModel } from 'src/app/interfaces/event-model';

@Component({
  selector: 'etm-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() eventItem!: EventModel;
  constructor() { }

  ngOnInit(): void {
  }

}
