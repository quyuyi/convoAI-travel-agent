#!/usr/bin/env python

import os
import io
from flask import Flask, render_template, request, jsonify, send_file, url_for
import requests
from api import request_clinc
import pprint

"""
# comment1 here
from record import record
# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types
from google.cloud import texttospeech
# end comment1 here
"""


pp = pprint.PrettyPrinter(indent=2)
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/Users/quyuyi/Downloads/WebpageClassifier-2cf78af630ef.json"


"""
# comment2
# Instantiates a speech to text client
speech_to_text_client = speech.SpeechClient()

# Instantiates a text to speech client
text_to_speech_client = texttospeech.TextToSpeechClient()
# end comment2
"""

'''
global variables
'''
preferences = {
    # update global variable (city, length_of_visit, number_of_people)
    # in resolve_basic_info(clinc_request)
    "city": -1,
    "length_of_visit": -1,
    "number_of_people": -1,
    # TODO
    # update global variable you figured out
    # in resolve_recommendation(clinc_request)
}

# TODO
# resolve add_destination and remove destination
# to update global variable: destinations
destinations = []
destinations_info = {}

count = 0
recommend = None



app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')



# comment3
@app.route("/record_to_text/", methods=["GET", "POST"])
def record_to_text():
    record()

    print("transcribing the audio file...")
    # call asr api to turn the blocking.wav to text
    # The name of the audio file to transcribe
    file_name = 'blocking.wav'
    # Loads the audio into memory
    with io.open(file_name, 'rb') as audio_file:
        content = audio_file.read()
        audio = types.RecognitionAudio(content=content)

    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code='en-US')

    # Detects speech in the audio file
    response = speech_to_text_client.recognize(config, audio)

    transcript = ''
    for result in response.results:
        transcript += result.alternatives[0].transcript
        print('Transcript: {}'.format(result.alternatives[0].transcript))

    print("transcript is:")
    print(transcript)
    data = {
        "response": transcript
    }
    return jsonify(**data)


@app.route('/get_audio/')
def get_audio():
    filename = 'output.mp3'
    return send_file(filename, mimetype='audio/mp3')

@app.route('/start_audio/')
def get_silence():
    filename = 'start.mp3'
    return send_file(filename, mimetype='audio/mp3')

def text_to_speech(text):
    # Set the text input to be synthesized
    synthesis_input = texttospeech.types.SynthesisInput(text=text)

    # Build the voice request, select the language code ("en-US") and the ssml
    # voice gender ("neutral")
    voice = texttospeech.types.VoiceSelectionParams(
        language_code='en-US',
        ssml_gender=texttospeech.enums.SsmlVoiceGender.NEUTRAL)

    # Select the type of audio file you want returned
    audio_config = texttospeech.types.AudioConfig(
        audio_encoding=texttospeech.enums.AudioEncoding.MP3)

    # Perform the text-to-speech request on the text input with the selected
    # voice parameters and audio file type
    response = text_to_speech_client.synthesize_speech(synthesis_input, voice, audio_config)

    # The response's audio_content is binary.
    with open('output.mp3', 'wb') as out:
        # Write the response to the output file.
        out.write(response.audio_content)
        print('Audio content written to file "output.mp3"')

# get the user query from the front end
# query clinc in the required format
# get the response from clinc, which contains speakableResponse
# return back to the front end
@app.route("/query_clinc/", methods=["GET", "POST"])
def add_destination():
    # get query frrom the front end
    query = request.json['query']

    # request clinc will make clinc to call our business logic server
    # (if that competency has its business logic enabled)
    print("_____________________get response from clinc_____________________")
    response = request_clinc(query)

    # return response to the front end
    # update the front end about the preferences and destinations
    result = 'no speakableResponse from clinc'
    dest = ""
    isRecommendation = False
    intro = ""
    img = ""    
    city = ""
    visitor = ""
    length = ""
    addCity = "_CITY_" in response["slots"].keys()
    if addCity:
        city = response['slots']['_CITY_']['values'][0]['value']
    addLength = "_LENGTH_OF_VISIT_" in response["slots"].keys()
    if addLength:
        length = response['slots']['_LENGTH_OF_VISIT_']['values'][0]['value'] 
    addVisitor = 'The_NUMBER_OF_PEOPLE_' in response['slots'].keys()  
    if addVisitor:
        visitor = response['slots']['The_NUMBER_OF_PEOPLE_']['values'][0]['value'] 

    if 'visuals' in response:
        print("have a speakable repsponse")
        result = response['visuals']['speakableResponse']
        if "intro" in response['visuals'].keys():
            isRecommendation = True
            intro = response['visuals']['intro']
            img = response['visuals']['image']
            dest = response['bl_resp']['slots']['_RECOMMENDATION_']['values'][0]['value']
    
    # print('destination got from clinc')
    # print(response['visuals']['destinations'])

    # TODO
    # request destinations from business logic server
    # dest = requests.get('http://convo-ai.herokuapp.com/api/return_destinations/')
    # dest = dest.json()
    # print('destination list from business logic server is:')
    # print(dest)
    data = {
        'response': result,
        # 'destinations': dest['result'],
        'destinations': ['for', 'test', 'only'],
        'isRecommendation': isRecommendation, 
        'intro': intro,
        'img': img,
        'dest': dest,
        'addVisitor': addVisitor,
        'visitor': visitor,
        'addLength': addLength,
        'length': length,
        'addCity': addCity,
        'city': city
    }
    print("response from clinc is:")
    print(result)
    # text_to_speech(result)
    return jsonify(**data)
# end comment3












@app.route("/api/return_destinations", methods=["GET", "POST"])
def return_destinations():
    global destinations
    data = {
        "result": destinations,
    }
    return jsonify(**data)


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





# Only the state and slots properties can be manipulated
def resolve_add_destination(clinc_request):
    print("start resolve add_destination...")
    print("request body is:")
    pp.pprint(clinc_request)
    valid = True
    # TODO
    # check validity of state and slots,
    # set valid to false if not valid

    # TODO
    # determine if need business transition
    # clinc_request['state'] = "generate_shedule"


    if clinc_request['slots']:
        destination = clinc_request['slots']['_DESTINATION_']['values'][0]['tokens']
        # clinc_request['visual_payload'] = {
        #     'destination': destination
        # }
        clinc_request['slots']['_DESTINATION_']['values'][0]['value'] = destination
        clinc_request['slots']['_DESTINATION_']['values'][0]['resolved'] = 1  # why the value of 'values' is list???
        global destinations
        global recommend
        global destinations_info
        if destination == "this place"
            print("destination: ", destinations)
            destinations.append(recommend['name'])
            destinations_info[recommend['name']] = recommend
            print(destinations)


    print("change state")

    print(clinc_request)
    return jsonify(**clinc_request)


def resolve_basic_info(clinc_request):
    global preferences
    global recommend
    global count
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
        city_tokens = clinc_request['slots']['_CITY_']['values'][0]['tokens']
        clinc_request['slots']['_CITY_']['values'][0]['value'] = city_tokens
        preferences['city'] = city_tokens
        recommend = None
        count = 0


    if '_LENGTH_OF_VISIT_' in clinc_request['slots']:
        clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['resolved'] = 1
        length_of_visit_tokens = clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['tokens']
        clinc_request['slots']['_LENGTH_OF_VISIT_']['values'][0]['value'] = length_of_visit_tokens
        preferences['length_of_visit'] = length_of_visit_tokens

    if '_NUMBER_OF_PEOPLE_' in clinc_request['slots']:
        clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['resolved'] = 1
        number_of_people_tokens = clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['tokens']
        clinc_request['slots']['_NUMBER_OF_PEOPLE_']['values'][0]['value'] = number_of_people_tokens
        preferences['number_of_people'] = number_of_people_tokens

    return jsonify(**clinc_request)




def resolve_clean_hello(clinc_request):
    print("start resolve clinc_request..")
    print("request body is:")
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

    return jsonify(**clinc_request)



def resolve_generate_schedule(clinc_request):
    print("start resolve generate_schedule...")
    print("request body is:")
    pp.pprint(clinc_request)
    return jsonify(**clinc_request)



def resolve_recommendation(clinc_request):
    global preferences
    global recommend
    global count
    print("start resolve recommendation...")
    print("request body is:")
    pp.pprint(clinc_request)
    # TODO
    # extract necessary info from clinc's request
    # (refer to resolve_basic_info(clinc_request) above)

    # TODO
    # request the trip api
    # receive response(i.e., a destination or a list of destination) from the trip api
    print("preferences ", preferences)
    city = preferences['city']
    city = city.capitalize()
    print("city ", city)
    if recommend is None and len(preferences) == 3:
        url = 'https://www.triposo.com/api/20190906/poi.json?location_id='+city+'&fields=id,name,intro,images,coordinates&count=10&account=8FRG5L0P&token=i0reis6kqrqd7wi7nnwzhkimvrk9zh6a'
        count = 0
        recommend = requests.get(url)
        recommend = recommend.json()
    print(recommend)
    clinc_request['slots'] = {
        "_RECOMMENDATION_": {
            "type": "string",
            "values": [
                {
                    "resolved": 1,
                    "value": recommend['results'][count]['name']
                    
                }
            ]
        }
    }
    print(recommend['results'][count]['images'][0].keys())
    clinc_request['visual_payload'] = {
        "intro": recommend['results'][count]['intro'],
        "image": recommend['results'][count]['images'][0]['sizes']['original']['url']
    }
    count += 1
    print(clinc_request['slots'])
    print(clinc_request['visual_payload'])

    # TODO
    # figure out other preferences need by the trip api
    # tell Tianchun to add slots in clinc

    # TODO
    # format the response to clinc
    return jsonify(**clinc_request)





def resolve_remove_destination(clinc_request):
    print("start resolve remove_destination...")
    print("request body is:")
    pp.pprint(clinc_request)

    return jsonify(**clinc_request)









all_states = [
    "add_destination", "basic_info", "clean_goodbye", "clean_hello",
    "destination_info", "generate_shedule", "recommendation", "remove_destination"]

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
