import requests
import pprint

app_key = 'd5c427b6678dece62b966bea504b00b511893ec1'
ai_version = 'd2462c12-e625-49fd-9cfe-c781ddedf060'
FIREBASE_AUTH = "speech-1572979010959-firebase-adminsdk-2918d-36021ad32f.json"
TTS_AUTH = "WebpageClassifier-2cf78af630ef.json"

pp = pprint.PrettyPrinter(indent=2)
query = "what's the weather in Boston?"
user_id = "62ea16cb-9c8e-4f0b-86d1-f4e6b98e6815"
def request_clinc(query, user_id):
    response = requests.post(
        'https://api.clinc.ai:443/v1/query',
        json={
            'query' : query,
            'ai_version': ai_version,
            'lat': 0.0,
            'lon': 0.0,
            'time_offset': 0,
            'device': 'Derp',
            'external_user_id': user_id,
        },
        headers={
            'Authorization': 'app-key {}'.format(app_key),
            'Content-Type': 'application/json'
        }
    ).json()
    pp.pprint(response)
    return response

if __name__ == "__main__":
    request_clinc(query, user_id)