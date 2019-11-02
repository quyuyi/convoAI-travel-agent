#!/usr/bin/env python

import os
from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')



# http://heroku.travel_agent.com/api/v1/clinc/
# get request from clinc
# check state, add slot values, etc.
# Only the state and slots properties can be manipulated
# return reponse to clinc
@app.route("/api/v1/clinc/", methods=["GET", "POST"])
def business_logic():
    # read clinc's request.json
    clinc_request = request.json
    print("print from bussiness_logic")
    print(clinc_request)

    # extract state
    curr_intent = clinc_request['state']
    print("current intent is")
    print(curr_intent)

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


    # return the response.json back to clinc





# get the user query from the front end
# query clinc in the required format
# get the response from clinc, which contains speakableResponse
# return back to the front end
@app.route("/query_clinc/", methods=["GET", "POST"])
def add_destination():
    # get query frrom the front end
    query = request.json['query']

    url = "https://HOSTNAME/v1/query/" # TODO what should HOSTNAME be replaced with?

    payload = {
        "query": query,
        "language": "en",
        "device": "Alexa",
        "lat": 42.2810237,
        "lon": -83.7467534,
        "time_offset": 300,
        "dialog": "40C0QYWuywZbF3AwFNNohraKgX8MotY", 
        # Dialog token to keep context between queries, 
        # this is found in a field of the same name from the previous query response
        # which means we need to store the previous one in our server?
        "ai_version": "d2462c12-e625-49fd-9cfe-c781ddedf060"
    }

    headers = {
        "Authorization": "app-key RQWkiEhwqp9BU04533bnT67FXaqwd0", # how to do authorization???
        "Content-Type": "application/json",
    }

    response = requests.post(url, json=payload, headers=headers)

    print(response.json())

    # return response to the front end
    speakableResponse = response['visuals']['speakableResponse']
    return jsonify(speakableResponse)







# Only the state and slots properties can be manipulated
def resolve_add_destination(clinc_request):
    # no need to change state here
    # no need to change/add slot value here
    print("print from resolve_add_destination")
    clinc_request['state'] = "generate_shedule"
    clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = 'someplace'
    # why the value of 'values' is list???
    clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = 1

    print("change state")

    print(clinc_request)
    return jsonify(**clinc_request)


def resolve_basic_info(clinc_request):
    print("start resolve basic info...")
    print("request body is:")
    print(clinc_request)
    # slots: city, length_of_visit, number_of_people
    # example request body
    '''
    {'ai_version': 'd2462c12-e625-49fd-9cfe-c781ddedf060', 'device': 'default', 'dialog': 'KIuP1skcNGBdxFjVc5NWl6NqvFY3LnaL', 'lat': 0, 'lon': 0, 'time_offset': 0, 'external_user_id': '1', 'query': 'I want to travel to Ann Arbor for 3 days with mum.', 'qid': '98477a05-bc61-48e9-94cc-3aa04265444c', 'state': 'basic_info', 'slots': {'_CITY_': {'type': 'string', 'values': [{'resolved': -1, 'tokens': 'ann arbor'}]}, '_LENGTH_OF_VISIT_': {'type': 'string', 'values': [{'resolved': -1, 'tokens': '3'}]}, '_NUMBER_OF_PEOPLE_': {'type': 'string', 'values': [{'resolved': -1, 'tokens': 'with mum'}]}}, 'sentiment': 0, 'intent_probability': 0.9865199534733209, 'session_id': '1c0e6e95e60f4ef0bd8e20bee0f12320', 'intent': 'basic_info_start'}
    '''
    # if you can get slot value from token, then set resolve to 1
    # if resolve is -1, edit response in clinc to continue query that slot
    # TODO
    # 1. check if all slots have token and whether the token is valid
    # 2. turn token to value, using regex or exact
    clinc_request['slots']['_CITY_']['values'][0]['resolved'] = 1
    clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['resolved'] = 1
    clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['resolved'] = 1
    '''
    clinc_request['slots']['_CITY_']['values'][0]['value'] = clinc_request['slots']['_CITY_']['values'][0]['token']
    clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['value'] = clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['token']
    clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value'] = clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['token']
    '''
    return jsonify(**clinc_request)

def resolve_clean_hello(clinc_request):
    clinc_request['state'] = "basic_info"
    return jsonify(**clinc_request)

def resolve_destination_info(clinc_request):
    clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = clinc_request['slots']['_DESTINATION_']['values'][0]['token']
    clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = 1
    return jsonify(**clinc_request)

def resolve_generate_schedule(clinc_request):
    return jsonify(**clinc_request)

def resolve_recommendation(clinc_request):
    return jsonify(**clinc_request)


def resolve_remove_destination(clinc_request):
    return jsonify(**clinc_request)






all_states = [
    "add_destination", "basic_info", "clean_goodbye", "clean_hello",
    "destination_info", "generate_shedule", "recommendation", "remove_destination"]

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
