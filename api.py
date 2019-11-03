import requests

app_key = 'd5c427b6678dece62b966bea504b00b511893ec1'
ai_version = 'd2462c12-e625-49fd-9cfe-c781ddedf060'


print(requests.post(
    'https://api.clinc.ai:443/v1/query',
    json={
        'query' : 'What\'s the weather in boston?',
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
).json())