# Parking Lot Management  

## About 

For the project, our group will be creating a parking lot management that oversees parking spaces, and allocates to vehicles. Unlike generic retail management which focuses on ordering, our application is an inventory tracker that features a parking log, a record of both vacant and occupied parking spaces, and updates instantaneously to ensure managers are able to gain insight of the usage of the parking spots. With the given information, and based on a given vehicle’s specifications, our application will be able to assign a designated parking spot for such vehicle, and contain information regarding both the vehicle and the vehicle owner. This includes the vehicle’s parking activities, and the vehicle owner’s identifications. 

## Database Specification
 
Given the complexity of administering an immense parking lot, our database will provide valuable information pertaining to a parking lot that will help regulate and manage it. Rather than monitoring vacant parking spaces visually, our database will ease the tension by storing parking lot statistics. Such information includes a parking lot’s capacity, as well as its vacant and occupied parking spaces. To expand, it will also contain a parking spaces’ details such as its type (reserved/normal), time limit, and subtypes (electric/accessibility). With such information, any parking lot management will be able to easily oversee its parking spaces (and if any individual violates their parking session, issue a parking ticket, or tow their vehicle if necessary). 
 
## Application Platform
 
Following the recommendations of CPSC 304’s course instructors, our group will be using PostgreSQL for the DBMS. However, as opposed to using Java and PHP, we decided to use React with TypeScript for the frontend, and Node.js for the backend - implementing a REST API to make changes to the database. 



## Commands 

Starting postgreSQL(mac): brew services start postgresql

Accessing postgreSQL: psql -U postgres -d postgres

Rebuild database: psql -U postgres -d postgres -f ./sql_scripts/rebuild_db.sql

Run server: yarn dev

Run client: yarn start


## Changes

In our original proposal, we were intending to use Oracle for the DBMS. However, as we were unable to connect to the database via Oracle, we changed to use PostgreSQL instead

In addition, to allow for more interesting queries, we decided to make some changes:

- one-to-one relationship of vechicleOwner and vehicle => one-to-many
- Updated field types
    - Specifically made chars into varchars so varying data length can be added
    - Added type SERIAL (PostgreSQL) which is basically just an integer that auto increments for id creation of tickets and parkingSessions
