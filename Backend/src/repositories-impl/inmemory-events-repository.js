import EventsRepository from '../business-logic/events-repository.js';
import { TICKET_STATUSES } from '../../models/constants.js';
import { generateID } from '../utils.js';

export default class InMemoryEventsRepository extends EventsRepository {
    constructor() {
        super();
        this.events = [];
    }

    async addEvent(newEvent) {
        this.events.push(newEvent);
    }

    async getAllEvents() {
        return this.events;
    }

    async getAllEventsWithTicketsStats() {
        return this.events.map(currentEvent =>
        {
            const ticketsPerEvent = currentEvent.tickets;
            return {
                ...currentEvent,
                tickets: {
                    sold: ticketsPerEvent.filter(ticket => ticket.status === TICKET_STATUSES[0]).length,
                    validated: ticketsPerEvent.filter(ticket => ticket.status === TICKET_STATUSES[1]).length
                }
            }

        }

        );
    }

    async getAllTicketsPerEvent(eventId) {
        return this.events.filter(event => event.id === eventId)[0].tickets;
    }

    async addTicketsToEvent(eventId, listOfTickets) {
        const findEvent = this.events.find(eventToAddTickets => eventToAddTickets.id === eventId);
        const ticketsPerEvent = findEvent ? findEvent.tickets : null;

        const responseResult = {
            addedTickets: [],
            rejectedTickets: []
        }


        if (!ticketsPerEvent || !eventId || !listOfTickets) { 
            return responseResult;
        }

        let ticketsToAdd = listOfTickets
            .filter(newTicket => 
                !ticketsPerEvent.some(existingTicket => newTicket.validationCode === existingTicket.validationCode) &&
                newTicket.eventRef === eventId
            )
            .map(newTicket => { 
                return {
                    ...newTicket,
                    id: generateID()
                }
            }); 

        let duplicatedRecords = listOfTickets
        .filter(newTicket => ticketsPerEvent.some(existingTicket => newTicket.validationCode === existingTicket.validationCode)); 

        ticketsPerEvent.push(...ticketsToAdd);
        responseResult['addedTickets'] = ticketsToAdd;
        responseResult['rejectedTickets'] = duplicatedRecords;
        return responseResult;
    }

    async validateTicketForEvent(eventId, ticketId) {
        const eventToVaildateTicket = this.events.find(eventToVaildateTicket => eventToVaildateTicket.id === eventId);
        const ticketToValidate = eventToVaildateTicket && (eventToVaildateTicket.tickets !== undefined) ?
            eventToVaildateTicket.tickets.find(ticket => ticket.id === ticketId) : null;

        if (!eventToVaildateTicket || !ticketToValidate || !eventId || !ticketId) { 
            return {
                result: false,
                details: 'Invalid Data'
            }
        }
        
        if (ticketToValidate['status'] === TICKET_STATUSES[0]) {
            ticketToValidate['status'] = TICKET_STATUSES[1];
            return {
                result: true,
                details: 'Ticket validated'
            };
        } else {
            return {
                result: false,
                details: 'Ticket was already validated'
            };
        }
    }

}