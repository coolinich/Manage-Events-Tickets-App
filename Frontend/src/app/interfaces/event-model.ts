import { TickesStats } from "./ticket-model";

export interface EventModel {
    id?: string;
    name: string;
    type: string;
    location: string;
    date: string;
    description?: string; 
    capacity?: number;
    tickets?: TickesStats;
}

export interface EventCreateRequest {
    event: EventModel
}


