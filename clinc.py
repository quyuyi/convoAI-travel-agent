import requests

oauth_token = 'PODBMIDjizV32PyTOCo1muXxcqw7CI'

print(requests.post(
    'https://api.clinc.ai:443/v1/apps/applicationtoken/',
    params={'force': 'True', 'scopes': 'query'},
    headers={'Authorization': 'Bearer {}'.format(oauth_token),
      'Content-Type': 'application/x-www-form-urlencoded'}
).json())
