# EECS498 Conversational AI - Travel Agent

## TODO
### Clinc:
1. Test Clinc classification and slot mapping   
   Incorrect cases:   
   (1) "I want to go to Tokyo Tower", should be add_destination, extract as city   
   (2) "I want to go to xxx by myself"   
   (3) "the weekend" days (incorrect slot-value pairing)   
   (4) "I want to go to xxx alone" -> city: "xxx alone"   
   (5) I'll go to xxx with 3 boys and 4 girls.   
   (6) "a week and 2 days"   
   (7) "I'd like to go there." should be add_destination, extract as city  
   (8) "Hi, I'd like to go to Ann Arbor with my parents for 3 days" with "hi days" on the top instead of "3 days" (non-numerical days should be illegal)   
   
2. Add utterances, slot mapper, edit response for recommendation preference.   
3. (Add training data to support adding multiple places at once.)


### Backend:
1. Use dynamic slot mapper in business logic to map destination   
   "resolve_destination_info", add by name, remove by name   
2. Debug recommendation by looking at firebase, find reason for "out of index"   
3. Say "Remove this place" to remove    
4. Recommend according to user preference   

### UI:
#### Itinerary:
1. Display the destination name when there's only 1 place for the day.

#### General:
2. When clicking button, send request to clinc so that there's speakable response
   e.g. User clicks button to add, AI says "xxx has been added..."
3. Display destination information at resolve_destination_info
   e.g. "Tell me about Michigan Stadium" -> show photo and introduction on screen   

### TTS&STT:
1. Test and make sure it works.

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
