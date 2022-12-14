## Changes

In our original proposal, we were intending to use Oracle for the DBMS. However, as we were unable to connect to the database via Oracle, we changed to use PostgreSQL instead.

In addition, to allow for more interesting queries, we decided to make some changes:
- one-to-one relationship of vehicleOwner and vehicle => one-to-many
- Updated field types
    - Specifically made chars into varchars so varying data length can be added
    - Added type SERIAL (PostgreSQL) which is basically just an integer that auto increments for id creation of tickets and parkingSessions
- Changed relation ship between vehicleOwner and personalDetails
    - Rather than using (name, address) as key for personalDetails, we made it use the foreign key to owner id. It didn't make sense to use (name, address) when we already create a key ownerID.
    - Removed foreign keys constraint for (name, address) for vehicleOwner
- Updated foreign key for tickets (licensePlate -> sessionId) 
    - since each ticket will be assigned for a specific parking session, it makes sense to connect it to sessionId rather than licensePlate. 
    - This is a one to one relationship with partial participation for parking session and full participation for tickets

As group committed to our project repository using our personal github account, our accounts are the following:
- Jim 'Ming Chun' Wei (jimwei/jimwei6)
- Asad Dhorajiwala (AnimeAllstar/ad2001)
- Richard Lee (Richard Lee/rlee2002)
