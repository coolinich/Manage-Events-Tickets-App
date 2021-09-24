import EventsRepository from '../src/business-logic/events-repository.js';
import EventsManager from '../src/business-logic/events-manager.js';

jest.mock('../src/business-logic/events-repository.js');

beforeEach(() => {
    EventsRepository.mockClear(); 
});

describe('Check EventsManager ', () => {
    it('gets data from EventsRepository', async () => {
        const eventsRepositoryMock = new EventsRepository();
        const eventsManager = new EventsManager(eventsRepositoryMock);
        const eventsMocked = [];
        eventsRepositoryMock.getAllEventsWithTicketsStats.mockReturnValueOnce(eventsMocked);
        
        const actualResult = await eventsManager.getAllEventsWithTicketsStats();
    
        expect(actualResult).toBe(eventsMocked);
    });

    it('adds data to EventsRepository', async () => {
        const eventsRepositoryMock = new EventsRepository();
        const eventsManager = new EventsManager(eventsRepositoryMock);
        const eventToBeAddedMocked =  {
            "name": "Test event",
            "type": "movie",
            "location": "Tallinn",
            "date": "Wed Sep 24 2021 22:00:00 GMT+0300",
            "capacity": 100
        };
    
        eventsRepositoryMock.addEvent.mockReturnValueOnce(eventToBeAddedMocked);
        const actualResult = await eventsManager.addNewEvent({...eventToBeAddedMocked});
    
        expect(actualResult.id).not.toBe(undefined);
        expect(actualResult.id).toMatch(/^[0-9a-z]+$/);
    
        delete actualResult.id;
        delete actualResult.tickets;
        expect(actualResult).toMatchObject(eventToBeAddedMocked);
    });
});

