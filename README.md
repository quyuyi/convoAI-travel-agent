# EECS498 Conversational AI - Travel Agent

## TODO
### Clinc:
1. Test Clinc classification and slot mapping, use Clinc slot mapper
### Backend:
1. Avoid getting "no speakable response" when itinerary cannot be generated
2. ~~Suggest user stop adding destination when there're enough places~~
3. Recommend nearby restaurant/hotel based on route
4. Recommend according to user preference
### UI:
1. Improve visualization of top left destination lists
2. Enable top left cancel button
3. Enable cancel button in schedule list or enable modify order of places in schedule
4. Enable route guide for multiple days
5. Display destination information at resolve_destination_info
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
