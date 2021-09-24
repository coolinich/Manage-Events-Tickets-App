import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_URL } from 'src/environments/environment';
import { EventCreateRequest, EventModel } from '../interfaces/event-model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${API_URL}/events`)
        .pipe(
          catchError(err => throwError(err))
        );
  }

  createNewEvent(event: EventModel): Observable<EventModel> {
    return this.http.post<EventModel>(`${API_URL}/events`, { event })
      .pipe(
        catchError(err => throwError(err)) 
      );
  }

}
