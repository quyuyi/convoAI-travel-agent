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

# Use a service account
cred = credentials.Certificate('convai498-1572652809131-firebase-adminsdk-i8c6i-de8d470e32.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
collection = db.collection('users')
user_id = "10086"
doc_ref = collection.document(user_id)
doc_ref.set({})
city_collection = db.collection('city')

pp = pprint.PrettyPrinter(indent=4)

app = Flask(__name__)

'''
global variables
'''

# userId = 0

preferences = {
    # update global variable (city, length_of_visit, number_of_people)
    # in resolve_basic_info(clinc_request)
    "city": "-1",
    "length_of_visit": "-1",
    "number_of_people": "-1",
    # TODO
    # update global variable you figured out
    # in resolve_recommendation(clinc_request)
}
count = 0
# TODO
# resolve add_destination and remove destination
# to update global variable: destinations
destinations = []
destinations_info = {}
city_recommendations = {}

@app.route("/")
def index():
    return render_template('businessLogic.html')

# @app.route("/set_user_id/", methods=["GET", "POST"])
# def set_user_id(id):
#     global userId
#     userId = id


# business logic server
# http://heroku.travel_agent.com/api/v1/clinc/
# get request from clinc
# check state, add slot values, etc.
# Only the state and slots properties can be manipulated
# return reponse to clinc
@app.route("/api/v1/clinc/", methods=["GET", "POST"])
def business_logic():
    # read clinc's request.json
    clinc_request = request.json
    # print("print from bussiness_logic")
    # print(clinc_request)

    # extract state
    curr_intent = clinc_request['state']
    # print("current intent is")
    # print(curr_intent)

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
    else:
        print("intent out of scope")





# Only the state and slots properties can be manipulated
def resolve_add_destination(clinc_request):
    print("start resolve add_destination...")
    print("request body is:")
    pp.pprint(clinc_request)
    # TODO
    # check validity of state and slots,
    # set valid to false if not valid

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
        destination = clinc_request['slots']['_DESTINATION_']['values'][0]['tokens']
        # clinc_request['visual_payload'] = {
        #     'destination': destination
        # }
        clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = destination
        clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = 1  # why the value of 'values' is list???
    
        city_doc_ref = city_doc_ref = city_collection.document(city)
        city_recommendations = city_doc_ref.get().to_dict()["recommendations"]
        
        print("city_recommendations: ", city_recommendations)
        if destination in ["this place", "this", "it", "there", "that"]:
            print("destination: ", destinations)
            print("count", count)
            destination_name = city_recommendations['results'][count-1]['name']
            new_destination_list = doc_ref.get().to_dict()['destinations']
            new_destination_list.append(destination_name)
            doc_ref.update({
                'destinations' : new_destination_list
            })

            clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = destination_name

    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)


def resolve_basic_info(clinc_request):
    print("start resolve basic info...")
    print("request body is:")
    pp.pprint(clinc_request)
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
            'destinations' : []
        })

        ### TO DO:
        # If the city document already exists, do not request API
        ###
        recommend = None

        # When user talks about city, get request from API
        url = 'https://www.triposo.com/api/20190906/poi.json?location_id='+city_key+'&fields=id,name,intro,images,coordinates&count=10&account=8FRG5L0P&token=i0reis6kqrqd7wi7nnwzhkimvrk9zh6a'
        recommend = requests.get(url).json()
        if not recommend["results"]:
            clinc_request['slots']["_NORESPONSE_"] = {
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
            clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value'] = str(int(number_of_people_tr))
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
    print("start resolve clinc_request..")
    print("request body is:")
    pp.pprint(clinc_request)

    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)




def resolve_destination_info(clinc_request):
    print("start resolve destination_info...")
    print("request body is:")
    pp.pprint(clinc_request)

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
    print("request body is:")
    pp.pprint(clinc_request)

    print("finish resolving, send response back to clinc...")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)



def resolve_recommendation(clinc_request):
    global preferences
    global city_recommendations
    print("start resolve recommendation...")
    print("request body is:")
    pp.pprint(clinc_request)
    '''
    for p in prefereces:
        if p == -1:
            clinc_request['state'] = 'basic_info'
            return jsonify(**clinc_request)
    '''
    
    print("preferences ", preferences)
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
    print("request body is:")
    pp.pprint(clinc_request)

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