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

users_ref = db.collection(u'users')
docs = users_ref.stream()

# cities_ref = db.collection('cities')
# city_docs = users_ref.stream()

for doc in docs:
    print(u'{} => {}'.format(doc.id, doc.to_dict()))
    # print(u'{} => {}'.format(city_docs.id, city_docs.to_dict()))