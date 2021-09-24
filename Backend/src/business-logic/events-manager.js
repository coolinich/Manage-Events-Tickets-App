import { generateID } from '../utils.js';

export default class EventsManager {
    constructor(eventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    async addNewEvent(newEvent) {
        newEvent.id = generateID();
        newEvent.tickets = [];
        await this.eventsRepository.addEvent(newEvent);
        return newEvent;
    }

    async getAllEvents() {
        return await this.eventsRepository.getAllEvents();
    }

    async getAllEventsWithTicketsStats() {
        return await this.eventsRepository.getAllEventsWithTicketsStats();
    }

    async getAllTicketsPerEvent(eventId) {
        return await this.eventsRepository.getAllTicketsPerEvent(eventId);
    }

    async addTicketsToEvent(eventId, listOfTickets) {
        return await this.eventsRepository.addTicketsToEvent(eventId, listOfTickets);
    }

    async validateTicketForEvent(eventId, ticketId) {
        return await this.eventsRepository.validateTicketForEvent(eventId, ticketId);
    }
}
