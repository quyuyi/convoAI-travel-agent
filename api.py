import requests
import pprint

app_key = 'd5c427b6678dece62b966bea504b00b511893ec1'
ai_version = 'd2462c12-e625-49fd-9cfe-c781ddedf060'

pp = pprint.PrettyPrinter(indent=2)
query = "what's the weather in Boston?"
def request_clinc(query):
    response = requests.post(
        'https://api.clinc.ai:443/v1/query',
        json={
            'query' : query,
            'ai_version': ai_version,
            'lat': 0.0,
            'lon': 0.0,
            'time_offset': 0,
            'device': 'Derp',
        },
        headers={
            'Authorization': 'app-key {}'.format(app_key),
            'Content-Type': 'application/json'
        }
    ).json()
    pp.pprint(response)
    return response

if __name__ == "__main__":
    request_clinc(query)