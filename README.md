# EECS498 Conversational AI - Travel Agent

## TODO

### UI
1. Conversational AI font
~~2. destination list~~
3. destination info popup window
4. add ASR

### Business Logic Server
1. if change state, can we know the slots of the new state?



To run this app:
1. npm install
2. npm run dev
3. pip install -r requirements.txt
4. python server.py
5. Goto http://localhost:3000

If you would like to have webpack rebuild your javascript any time your React code changes, enter `npm run start` in a different terminal.




## Notes:
1. Business Transition
- With out BT, user input -> clinc intent classification -> clinc slot extraction -> backend resolve state and slots
- With BT, user input -> clinc intent classification -> clinc slot extraction -> Business logic server BT -> clinc slot extraction based on the new state with the old query -> backend can't resolve slot?
