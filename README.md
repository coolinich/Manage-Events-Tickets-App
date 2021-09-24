# Project "Events List"

This WEB application was developed with using:
 - Angular framework (version 12.1.0 ) for frontend part;
 - NodeJS Express framework (version 4.17.1) for backend part.

## Overview
The task was to create WEB application where user can:
 - see list of existiing events and check stats of sold and verified tickets;
 - load tickets to events;
 - validate particular ticket.

## Manual
_Precondition._ Supposing Docker is installed in advance.

Backend can be run in Docker:
1. in terminal go to the project /Backend folder and run:
```
docker build -t <image-name> .
docker run -p <custom_port>:3001 <image-name>
```
2. server can be reached by endpoints:
  - GET http://localhost:{custom_port}/events
  - POST http://localhost:{custom_port}/events
  - POST http://localhost:{custom_port}/events/:eventId/tickets
  - PUT http://localhost:{custom_port}/events/:eventId/tickets/:ticketId

## Development server
### **Backend**
Go to the project /Backend folder.
### _Running project_
1. Execute command 
```
npm install
```
2. Run 
```
npm run start
```
for a dev server.
Server can be reached by endpoints:
  - GET http://localhost:{custom_port}/events
  - POST http://localhost:{custom_port}/events
  - POST http://localhost:{custom_port}/events/:eventId/tickets
  - PUT http://localhost:{custom_port}/events/:eventId/tickets/:ticketId

### _Running unit tests_
Run 
```
npm run test
```
to execute unit tests via Jest.

### _Running lint_
Run 
```
npm run lint
```
to see the list of possible fixes.

### **Frontend**
Go to the project /Frontend folder.
### _Running project_
1. Execute command 
```
npm install
```
2. Run 
```
ng serve
```
for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run 
```
ng build
```
to build the project. The build artifacts will be stored in the `dist/` directory.

### _Running unit tests_
Run
```
ng test
```
to execute unit tests via [Karma](https://karma-runner.github.io).

### _Running lint_
Run 
```
ng lint
```
to see the list of possible fixes.
