import EventsRepository from '../business-logic/events-repository.js';
import { TICKET_STATUSES } from '../../models/constants.js';
import { generateID } from '../utils.js';
import * as fs from'fs';

export default class InFileEventsRepository extends EventsRepository {
    fileAsDB = 'assets/events.json';
    constructor() {
        super();
        let getExistingEvents = fs.readFileSync(this.fileAsDB);
        this.events = JSON.parse(getExistingEvents);
    }

    async saveTofileAsDB(dataToSave) {
        const formattedData = JSON.stringify(dataToSave, null, 2)
        fs.writeFile(this.fileAsDB, formattedData, (err) => {
            if (err) throw err;
        });
    }

    async addEvent(newEvent) {
        this.events.push(newEvent);
        await this.saveTofileAsDB(this.events);
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
        });
    }

    async getAllTicketsPerEvent(eventId) {
        return this.events.filter(event => event.id === eventId)[0].tickets;
    }

    async addTicketsToEvent(eventId, listOfTickets) {
        const eventToAddTickets = this.events.find(eventToAddTickets => eventToAddTickets.id === eventId);
        const ticketsPerEvent = eventToAddTickets ? eventToAddTickets.tickets : [];

        const responseResult = {
            addedTickets: [],
            rejectedTickets: []
        }


        if (!eventToAddTickets || !eventId || !listOfTickets) { 
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
        responseResult['rejectedTickets'] = duplicatedRecords;
        
        if (ticketsToAdd.length) {
            if (eventToAddTickets && eventToAddTickets.capacity) {
                const availableCapacity = eventToAddTickets.capacity - ticketsPerEvent.length;
                const possibleToAdd = ticketsToAdd.slice(0, availableCapacity);
                ticketsPerEvent.push(...possibleToAdd);
                responseResult['addedTickets'] = possibleToAdd;
                responseResult['rejectedTickets'].push(...ticketsToAdd.slice(availableCapacity));
            } else {
                ticketsPerEvent.push(...ticketsToAdd);
                responseResult['addedTickets'] = ticketsToAdd;
            }
            
            eventToAddTickets.tickets = ticketsPerEvent;
            await this.saveTofileAsDB(this.events);
        }
        

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
            await this.saveTofileAsDB(this.events);
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