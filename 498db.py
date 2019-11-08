import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
cred = credentials.Certificate('convai498-1572652809131-firebase-adminsdk-i8c6i-de8d470e32.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# doc_ref = db.collection(u'users').document(u'Adaf38ef33a-a384-4ca6-aeda-c743ac12dd05')
doc_ref = db.collection(u'users').document(u'1')
doc_ref.set({
    # u'uuid': u'1',
    u'city': u'Ann Arbor',
    # u'length': u'10',
    u'number_of_people': u'2',
    # u'destinations': {
    #     u'Big Bowl': u'1',
    #     u'Duderstadt': u'2'
    # }
})


doc_ref.update({
    'city': 'Detroit',
    'length': '10'
})

# retrieve the value of some key
doc = doc_ref.get()
doc_dict = doc.to_dict()
print(doc_dict['city'])
# print(u'Document data: {}'.format(doc.to_dict()))

# set a document
doc_ref = db.collection(u'users').document(u'a044aa6c-7628-4ab9-9499-58c70a2362f7')
doc_ref.set({
    u'uuid': u'a044aa6c-7628-4ab9-9499-58c70a2362f7',
    u'city': u'Boston',
    u'length': u'3',
    u'number_of_people': u'1',
    u'destinations': {
        u'Museum of Fine Arts': u'1',
        u'Newburry Street': u'2'
    }
})

doc_ref = db.collection(u'city').document(u'Ann Arbor')
doc_ref.set({
    u'city': u'Ann Arbor',
    u'destinations': [
        {
         u'poiid': u'T__5e9d1bf0ec52',
         u'name': u'Michigan Stadium',
         u'coordinates': {
            u'longitude': u'-83.74870457513223',
            u'latitude': u'42.26587360952903',
            },
         u'image': u'https://upload.wikimedia.org/wikipedia/commons/1/1d/Michigan_Stadium_2011.jpg', 
         u'intro': u'Michigan Stadium, nicknamed \"The Big House\", is the football stadium for the University of Michigan in Ann Arbor, Michigan. It is the largest stadium in the United States, the second largest stadium in the world and the 34th largest sports venue. Its official capacity is 107,601, but it has hosted crowds in excess of 115,000.\nMichigan Stadium was built in 1927 at a cost of $950,000 (equivalent to $ in ) and had an original capacity of 72,000. Prior to the stadium\'s construction, the Wolverines played football at Ferry Field. Every home game since November 8, 1975 has drawn a crowd in excess of 100,000, an active streak of more than 200 contests. On September 7, 2013, the game between Michigan and the Notre Dame Fighting Irish attracted a crowd of 115,109, a record attendance for a college football game since 1927, and an NCAA single-game attendance record at the time, overtaking the previous record of 114,804 set two years previously for the same matchup.Michigan Stadium was designed with footings to allow the stadium\'s capacity to be expanded beyond 100,000. Fielding Yost envisioned a day where 150,000 seats would be needed. To keep construction costs low at the time, the decision was made to build a smaller stadium than Yost envisioned but to include the footings for future expansion.\nMichigan Stadium is used for the University of Michigan\'s main graduation ceremonies; Lyndon Johnson outlined his Great Society program at the 1964 commencement ceremonies in the stadium. It has also hosted hockey games including the 2014 NHL Winter Classic, a regular season NHL game between the Toronto Maple Leafs and the Detroit Red Wings with an official attendance of 105,491, a record for a hockey game. Additionally, a 2014 International Champions Cup soccer match between Real Madrid and Manchester United had an attendance of 109,318, a record crowd for a soccer match in the United States.'
        },
        {u'poiid':u'T__test0',
         u'name':u'test0'
        }
    ]
})

users_ref = db.collection(u'city')
docs = users_ref.stream()

# cities_ref = db.collection('cities')
# city_docs = users_ref.stream()

for doc in docs:
    print(u'{} => {}'.format(doc.id, doc.to_dict()))
    # print(u'{} => {}'.format(city_docs.id, city_docs.to_dict()))