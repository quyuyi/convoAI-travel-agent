#!/usr/bin/env python

import os
import io
from flask import Flask, render_template, request, jsonify, send_file, url_for
import requests
from api import request_clinc
import pprint
from utils import get 
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from business_logic_utils import capitalize_name
from itinerary_generator import ItineraryGen

# Use a service account
cred = credentials.Certificate('convai498-1572652809131-firebase-adminsdk-i8c6i-de8d470e32.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
collection = db.collection('users')

# user_id = "10086"
# doc_ref = collection.document(user_id)
# doc_ref.set({
#     'dummy' : 'dummy'
# })

city_collection = db.collection('city')

pp = pprint.PrettyPrinter(indent=4)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('businessLogic.html')



# business logic server
# http://heroku.travel_agent.com/api/v1/clinc/
# get request from clinc
# check state, add slot values, etc.
# Only the state and slots properties can be manipulated
# return reponse to clinc
@app.route("/api/v1/clinc/", methods=["GET", "POST"])
def business_logic():
    clinc_request = request.json # read clinc's request.json
    print("got request from clinc...")
    pp.pprint(clinc_request)
    user_id = clinc_request['external_user_id']
    print("user ID is...", user_id)
    curr_intent = clinc_request['state'] # extract state

    # resolve request depends on the specific state
    if (curr_intent == "add_destination"):
        return resolve_add_destination(clinc_request)
    elif (curr_intent == "clean_hello"):
        return resolve_clean_hello(clinc_request)
    elif (curr_intent == "basic_info"):
        return resolve_basic_info(clinc_request)
    elif (curr_intent == "destination_info"):
        return resolve_destination_info(clinc_request)
    elif (curr_intent == "generate_shedule"):
        return resolve_generate_schedule(clinc_request)
    elif (curr_intent == "recommendation"):
        return resolve_recommendation(clinc_request)
    elif (curr_intent == "remove_destination"):
        return resolve_remove_destination(clinc_request)
    elif (curr_intent == "clean_goodbye"):
        return resolve_clean_goodbye(clinc_request)
    else:
        print("intent out of scope")







# Only the state and slots properties can be manipulated
def resolve_add_destination(clinc_request):
    print("start resolve add_destination...")
    user_id = clinc_request['external_user_id']
    doc_ref = collection.document(user_id)
    doc = doc_ref.get()
    if not doc.exists:
        doc_ref.set({
            'sessionId' : user_id
        })

    city_dict = doc_ref.get().to_dict()
    if  "city" not in city_dict or "length_of_visit" not in city_dict or "number_of_people" not in city_dict:
        clinc_request['slots'] = {
            "_NOBASICINFO_": {
                "type" : "string",
                "values" : [
                    {
                        "resolved" : 1,
                        "value" : "Sorry, please provide your basic information before I can add destination. "
                    }
                ]
            }
        }
        print("finish resolving, send response back to clinc...")
        pp.pprint(clinc_request)
        return jsonify(**clinc_request)

    # TODO
    # determine if need business transition
    # clinc_request['state'] = "generate_shedule"
    try:
        count = doc_ref.get().to_dict()["count"]
        city = doc_ref.get().to_dict()['city']
    except KeyError:
        city = "-1"
        print("No count or city.")

    if clinc_request['slots']:
        destination = capitalize_name(clinc_request['slots']['_DESTINATION_']['values'][0]['tokens'])
        # clinc_request['visual_payload'] = {
        #     'destination': destination
        # }
        clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = destination
        clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = 1  # why the value of 'values' is list???
    
        city_doc_ref = city_collection.document(city)
        city_recommendations = city_doc_ref.get().to_dict()["recommendations"]
        city_name_dict = city_doc_ref.get().to_dict()["name_to_index"]
        
        print("city_recommendations: ", city_recommendations)
        if destination in ["This Place", "This", "It", "There", "That"]:
            print("count", count)
            destination_name = city_recommendations['results'][count-1]['name']
            added_destinations = doc_ref.get().to_dict()['destinations']
            if destination_name not in added_destinations:
                added_destinations.append(destination_name)
                doc_ref.update({
                    'destinations' : added_destinations
                })
            else:
                clinc_request['slots']['_ADDTWICE_'] = {
                    "type": "string",
                    "values": [{
                        "resolved": 1,
                        "value": destination_name + " is already in the list. No need to add twice."
                    }]
                }

            clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = destination_name

        else: # Directly add place by name
            print('destination: ', destination)
            print('city_name_dict.keys():', city_name_dict)
            if destination in city_name_dict: # destination exists
                print('destination in dict')
                added_destinations = doc_ref.get().to_dict()['destinations']
                if destination not in  added_destinations: # and haven't been added to the list
                    added_destinations.append(destination)
                    doc_ref.update({
                        'destinations' : added_destinations
                    })
                else: # This place is already in your list. No need to add twice.
                    clinc_request['slots']['_ADDTWICE_'] = {
                        "type": "string",
                        "values": [{
                            "resolved": 1,
                            "value": destination + " is already in the list. No need to add twice."
                        }]
                    }
            else: # destination not in recommendation list, cannot add
                clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = -1


    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)









def resolve_basic_info(clinc_request):
    print("start resolve basic info...")
    user_id = clinc_request['external_user_id']
    doc_ref = collection.document(user_id)
    doc = doc_ref.get()
    if not doc.exists:
        doc_ref.set({
            'sessionId' : user_id
        })

    # slots: city, length_of_visit, number_of_people
    # example request body
    '''
    {'ai_version': 'd2462c12-e625-49fd-9cfe-c781ddedf060', 'device': 'default', 'dialog': 'KIuP1skcNGBdxFjVc5NWl6NqvFY3LnaL', 'lat': 0, 'lon': 0, 'time_offset': 0, 'external_user_id': '1', 'query': 'I want to travel to Ann Arbor for 3 days with mum.', 'qid': '98477a05-bc61-48e9-94cc-3aa04265444c', 'state': 'basic_info', 'slots': {'_CITY_': {'type': 'string', 'values': [{'resolved': -1, 'tokens': 'ann arbor'}]}, '_LENGTH_OF_VISIT_': {'type': 'string', 'values': [{'resolved': -1, 'tokens': '3'}]}, '_NUMBER_OF_PEOPLE_': {'type': 'string', 'values': [{'resolved': -1, 'tokens': 'with mum'}]}}, 'sentiment': 0, 'intent_probability': 0.9865199534733209, 'session_id': '1c0e6e95e60f4ef0bd8e20bee0f12320', 'intent': 'basic_info_start'}
    '''
    # if you can get slot value from token, then set resolve to 1
    # if resolve is -1, edit response in clinc to continue query that slot
    # TODO
    # 1. check if all slots have token and whether the token is valid
    # 2. turn token to value, using regex or exactgit

    #### process number_of_people
    # try:
    #     clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value'] = int()

    if '_CITY_' in clinc_request['slots']:
        clinc_request['slots']['_CITY_']['values'][0]['resolved'] = 1
        city_str = clinc_request['slots']['_CITY_']['values'][0]['tokens']
        city_value = city_str.capitalize()
        city_key = city_str.capitalize()
        city_tokens = city_str.split()
        if len(city_tokens) == 2:
            city_key = city_tokens[0].capitalize() + '_' + city_tokens[1].capitalize()
            city_value = city_tokens[0].capitalize() + ' ' + city_tokens[1].capitalize()
        if city_key == "New_York":
            city_key = "New_York_City"
        if city_key == "Ann_Arbor":
            city_key = "Ann_Arbor2C_Michigan"
        clinc_request['slots']['_CITY_']['values'][0]['value'] = city_value
        doc_ref.update({
            'city': city_value,
            'count': 0,
            'destinations' : ['dummy']
        })

        ### TO DO:
        # If the city document already exists, do not request API
        ###
        recommend = None

        # When user talks about city, get request from API
        url = 'https://www.triposo.com/api/20190906/poi.json?location_id='+city_key+'&fields=id,name,intro,images,coordinates&count=10&account=8FRG5L0P&token=i0reis6kqrqd7wi7nnwzhkimvrk9zh6a'
        recommend = requests.get(url).json()
        if not recommend['results']:
            clinc_request['slots']['_NORESPONSE_'] = {
                "type": "string",
                "values": [
                    {
                        "resolved": 1,
                        "value": "But currently " + city_value + " is not supported, you may choose another city. "     
                    }
                ]
            }
        else:
            city_doc_ref = city_collection.document(city_value)
            city_doc_ref.set({
                "recommendations" : recommend
            })
            name_index = {}
            for idx, r in enumerate(recommend['results']):
                name_index[r['name']] = idx
            city_doc_ref.update({
                "name_to_index" : name_index
            })


    else:
        if "city" in doc_ref.get().to_dict():
            clinc_request['slots']['_CITY_'] = {
                "type": "string",
                "values": [{
                    "resolved": 1,
                    "value": doc_ref.get().to_dict()["city"]
                }]
            }

    if '_LENGTH_OF_VISIT_' in clinc_request['slots']:
        clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['resolved'] = 1
        length_of_visit_tokens = clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['tokens']
        lov = length_of_visit_tokens
        lov_tokens = length_of_visit_tokens.split()
        if len(lov_tokens) == 2 and lov_tokens[1] == "days":
            lov = lov_tokens[0]
        if length_of_visit_tokens in ['a week', 'one week', '1 week']:
            lov = "7"
        if length_of_visit_tokens in ['weekend']:
            lov = "2"
        clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['value'] = lov
        # preferences['length_of_visit'] = lov
        doc_ref.update({
            'length_of_visit': lov
        })

    else:
        if "length_of_visit" in doc_ref.get().to_dict():
            clinc_request['slots']['_LENGTH_OF_VISIT_'] = {
                "type": "string",
                "values": [{
                    "resolved": 1,
                    "value": doc_ref.get().to_dict()["length_of_visit"]
                }]
            }

    if '_NUMBER_OF_PEOPLE_' in clinc_request['slots']:
        clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['resolved'] = 1
        number_of_people_str = clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['tokens']
        try:
            print("enter try")
            clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value'] = str(int(number_of_people_str))
        except:
            print("enter except")
            people_number = 1
            number_of_people_tokens = number_of_people_str.split()
            print(clinc_request['slots']['_NUMBER_OF_PEOPLE_'])
            for t in number_of_people_tokens:
                if t in ['with', 'and', 'take', 'parents', 'grandparents', ',']:
                    people_number += 1
            clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value'] = str(people_number)
        # preferences['number_of_people'] = clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value']
        doc_ref.update({
            'number_of_people': clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value']
        })

    else:
        if "number_of_people" in doc_ref.get().to_dict():
            clinc_request['slots']['_NUMBER_OF_PEOPLE_'] = {
                "type": "string",
                "values": [{
                    "resolved": 1,
                    "value": doc_ref.get().to_dict()["number_of_people"]
                }]
            }


    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)










def resolve_clean_hello(clinc_request):
    print("start resolve clean hello...")

    print("finish resolving, sned response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)

def resolve_clean_goodbye(clinc_request):
    print("start resolve clean goodbye...")

    print("finish resolving, sned response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)











def resolve_destination_info(clinc_request):
    print("start resolve destination_info...")

    clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = clinc_request['slots']['_DESTINATION_']['values'][0]['tokens']
    clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = 1

    # TODO
    # request the trip api to get information about the destination
    # figure out what to return back to the user

    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)









def resolve_generate_schedule(clinc_request):
    print("start resolve generate_schedule...")
    user_id = clinc_request['external_user_id']
    doc_ref = collection.document(user_id)
    added_destinations = doc_ref.get().to_dict()['destinations']
    city = doc_ref.get().to_dict()['city']
    city_doc_ref = city_collection.document(city)
    city_dict = city_doc_ref.get().to_dict()

    places = []
    for d in added_destinations:
        if d == 'dummy':
            continue
        index = city_dict['name_to_index'][d]
        coord = city_dict['recommendations']['results'][index]['coordinates']
        la = coord['latitude']
        lo = coord['longitude']
        places.append({
            'name' : d,
            'coordinates' : {
                'latitude' : la,
                'longitude' : lo
            }
        })

    try:
        it_gen = ItineraryGen(int(doc_ref.get().to_dict()['length_of_visit']), places)
        plan = it_gen.make()
        print('Schedule Generated:')
        print(plan)
        schedule = []
        for item in plan:
            schedule.append(item[1])

        doc_ref.update({
            "schedule": schedule
        })
        
    except TypeError:
        print('length_of_visit not int')

    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)




def resolve_recommendation(clinc_request):
    print("start resolve recommendation...")
    user_id = clinc_request['external_user_id']
    doc_ref = collection.document(user_id)
    doc = doc_ref.get()
    if not doc.exists:
        doc_ref.set({
            'sessionId' : user_id
        })

    city_dict = doc_ref.get().to_dict()

    if  "city" not in city_dict or "length_of_visit" not in city_dict or "number_of_people" not in city_dict:
        clinc_request['slots'] = {
            "_NOBASICINFO_": {
                "type" : "string",
                "values" : [
                    {
                        "resolved" : 1,
                        "value" : "Sorry, please provide your basic information before I can recommend. "
                    }
                ]
            }
        }
        pp.pprint(clinc_request)
        return jsonify(**clinc_request)

    try:
        city = doc_ref.get().to_dict()['city']
        count = doc_ref.get().to_dict()['count']
    except:
        city = "-1"
        count = 0
    print("city:", city)
    city_doc_ref = city_collection.document(city)
    city_recommendations = city_doc_ref.get().to_dict()["recommendations"]

    print('recommendation got from API:', city_recommendations)
    clinc_request['slots'] = {
        "_RECOMMENDATION_": {
            "type": "string",
            "values": [
                {
                    "resolved": 1,
                    "value": city_recommendations['results'][count]['name']               
                }
            ]
        },
        "_CITY_": {
            "type" : "string",
            "values": [
                {
                    "resolved" : 1,
                    "value": city
                }
            ]
        }
    }
    print("city_recommendations['results'][count]['images'][0].keys():")
    print(city_recommendations['results'][count]['images'][0].keys())
    clinc_request['visual_payload'] = {
        "intro": city_recommendations['results'][count]['intro'],
        "image": city_recommendations['results'][count]['images'][0]['sizes']['original']['url']
    }
    doc_ref.update({
        "count": count+1
    })

    print("slots:", clinc_request['slots'])

    # TODO
    # figure out other preferences need by the trip api
    # tell Tianchun to add slots in clinc

    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)












def resolve_remove_destination(clinc_request):
    print("start resolve remove_destination...")
    user_id = clinc_request['external_user_id']
    doc_ref = collection.document(user_id)
    doc = doc_ref.get()
    if not doc.exists:
        doc_ref.set({
            'sessionId' : user_id
        })

    if clinc_request['slots']:
        destination = capitalize_name(clinc_request['slots']['_DESTINATION_']['values'][0]['tokens'])
        # clinc_request['visual_payload'] = {
        #     'destination': destination
        # }
        clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = destination
        clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = 1  # why the value of 'values' is list???
        added_destinations = doc_ref.get().to_dict()['destinations']
        found_place = 0
        for idx, d in enumerate(added_destinations):
            if destination == d:
                added_destinations.pop(idx)
                doc_ref.update({
                    'destinations' : added_destinations
                })
                found_place = 1
                break
        if found_place == 0:
            clinc_request['slots']['_NOTINLIST_'] = {
                "type": "string",
                "values": [{
                    "resolved": 1,
                    "value": destination + " is not in your list."
                }]
            }

    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)


# @app.route("/api/return_destinations", methods=["GET", "POST"])
# def return_destinations():
#     global destinations
#     data = {
#         "result": destinations,
#     }
#     return jsonify(**data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 8000), debug=True)
