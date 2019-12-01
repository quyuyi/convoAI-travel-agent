# EECS498 Conversational AI - Travel Agent

## TODO
### Clinc:
1. Test Clinc classification and slot mapping
### Backend:
1. ~~Avoid getting "no speakable response" when itinerary cannot be generated~~
2. ~~Suggest user stop adding destination when there're enough places~~
3. Recommend nearby restaurant/hotel based on route
4. Recommend according to user preference
5. Use dynamic slot mapper in business logic to map destinations
6. Add business logic for mapping length_of_visit and number_of_people
7. Debug recommendation by looking at firebase, find reason for "out of index"
8. Say "Remove this place" to remove
### UI:
1. ~~Improve visualization of top left destination lists~~
2. ~~Enable top left cancel button~~
3. Enable cancel button in schedule list or enable modifying order of places in schedule
4. Enable route guide for multiple days
5. Display destination information at resolve_destination_info
6. Generate itinerary directly by clicking the "generate" button without speaking to it
7. Automatically displaying itinerary without clicking after saying "generate schedule"
8. Make "regenerate schedule" work
9. When clicking button, send request to clinc so that there's speakable response
### TTS&STT:
(1. Can user directly speak to AI without clicking 'record' button?)


## Notes:
1. Business Transition
- With out BT, user input -> clinc intent classification -> clinc slot extraction -> backend resolve state and slots
- With BT, user input -> clinc intent classification -> clinc slot extraction -> Business logic server BT -> clinc slot extraction based on the new state with the old query -> backend can't resolve slot?


### To run this app:
1. npm install
2. npm run dev
3. pip install -r requirements.txt
4. python server.py
5. Goto http://localhost:3000

If you would like to have webpack rebuild your javascript any time your React code changes, enter `npm run start` in a different terminal.
