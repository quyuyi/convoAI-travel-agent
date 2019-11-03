'''
get app_key which will be used in api.py for requesting clinc
rerun this file only if the app_key in api.py expired
'''


import requests

oauth_token = 'PODBMIDjizV32PyTOCo1muXxcqw7CI'

print(requests.post(
    'https://api.clinc.ai:443/v1/apps/applicationtoken/',
    params={'force': 'True', 'scopes': 'query'},
    headers={'Authorization': 'Bearer {}'.format(oauth_token),
      'Content-Type': 'application/x-www-form-urlencoded'}
).json())
