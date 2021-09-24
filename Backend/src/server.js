import express from 'express';
import cors from 'cors';
import EventsManager from './business-logic/events-manager.js';
import InMemoryEventsRepository from './repositories-impl/inmemory-events-repository.js';
import InFileEventsRepository from './repositories-impl/infile-events-repository.js';
import { validateEventModel } from '../models/EventModel.js'
import { validateTicketModel } from '../models/TicketModel.js';

const PORT = 3001;

class Server {
    constructor() {
        this.configureDependencies();
        this.app = express();
        this.configureServer();  
        this.startServer();
    }

    configureDependencies() {
        // implementation with ImMemory repository       
        // const repository = new InMemoryEventsRepository();
        // implementation with File system
        const repository = new InFileEventsRepository();
        
        this.eventsManager = new EventsManager(repository);


    } 

    configureServer() {
        this.app.use(express.json());
        this.app.use(cors());
       
        let eventsManager = this.eventsManager;

        this.app.get('/raw-events', async (req, res) => {
            const listOfAllEvents = await eventsManager.getAllEvents();
            return res.json(listOfAllEvents);
        })
       
        this.app.get('/events', async (req, res) => {
            const listOfAllEvents = await eventsManager.getAllEventsWithTicketsStats();
            return res.json(listOfAllEvents);
        })
       
        this.app.post('/events', async (req, res) => {
            const { event } = req.body;
            if (!event || !validateEventModel(event)) {
                return res.status(400).send({
                    statusCode: 400,
                    errorMessage: "Bad request",
                    details: `${event}`
                })
            }
            const newEvent = await eventsManager.addNewEvent(event);
            return res.status(201).json(newEvent);
        });

        this.app.post('/events/:eventId/tickets', async (req, res) => {
            const eventId = req.params.eventId;
            const listOfTickets = req.body;
            const validateListOfTicketsModel = Array.isArray(listOfTickets) && listOfTickets.every(ticket => validateTicketModel(ticket));
            if (!listOfTickets || !validateListOfTicketsModel) {
                return res.status(400).send({
                    statusCode: 400,
                    errorMessage: "Bad request",
                    details: `${listOfTickets}`
                })
            }

            const loadTickets = await eventsManager.addTicketsToEvent(eventId, listOfTickets);
            return res.status(201).json(`Loaded successfuly: ${loadTickets ? loadTickets.addedTickets.length : 0}; Rejected tickets: ${loadTickets ? loadTickets.rejectedTickets.length : 0}`);

        })

        this.app.put('/events/:eventId/tickets/:ticketId', async (req, res) => {
            const eventId = req.params.eventId;
            const ticketId = req.params.ticketId;
            const ticketNewData = req.body;
            if (!ticketNewData ||
                !(ticketNewData && ticketNewData.id && ticketNewData.id === ticketId) ||
                !(ticketNewData && ticketNewData.eventRef && ticketNewData.eventRef === eventId) ||
                !validateTicketModel(ticketNewData)) {
                    return res.status(400).send({
                        statusCode: 400,
                        errorMessage: "Bad request",
                        details: `Bad request`
                    })
            }

            const validateTicket = await eventsManager.validateTicketForEvent(eventId, ticketId);
            if (validateTicket.result) {
                return res.status(204).end();
            } else {
                return res.status(400).send({
                    statusCode: 400,
                    errorMessage: "Bad request",
                    details: `Bad request: ${validateTicket.details}`
                })
            }        
        })


        
        this.app.use((req, res) => {
            res.status(404).send({
                statusCode: 404,
                errorMessage: "This page is not found"
            })
        })
    }

    startServer() {
        this.app.listen(PORT, () => {
            console.log(`Server is runnung on http://localhost:${PORT}`);
        });
    }
}

export default new Server();
