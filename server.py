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
    clinc_request = request.json()

    # extract state
    curr_intent = clinc_request['state']

    # resolve request depends on the specific state
    if (curr_intent == "add_destination"):
        return resolve_add_destination(clinc_request)


    # return the response.json back to clinc





# get the user query from the front end
# query clinc in the required format
# get the response from clinc, which contains speakableResponse
# return back to the front end
@app.route("/query_clinc/", methods=["GET", "POST"])
def add_destination():
    url = "https://HOSTNAME/v1/query/" # what should HOSTNAME be replaced with?

    payload = {
        "query": "I want to travel to Boston for 3 days with my best friend.",
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
    return jsonify(clinc_request)






all_states = [
    "add_destination", "basic_info", "clean_goodbye", "clean_hello",
    "destination_info", "generate_schedule", "recommendation", "remove_destination"]

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
