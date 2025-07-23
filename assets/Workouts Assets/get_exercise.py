import requests
import json

muscle = 'biceps'
api_url = 'https://api.api-ninjas.com/v1/exercises?muscle={}'.format(muscle)
response = requests.get(api_url, headers={'X-Api-Key': 'Jr8XpBgQ7m3LkSL1Tr1i1w==yX2kIwCXr1suXjJc'})

if response.status_code == requests.codes.ok:
    # Use a 'with' statement for safer file handling.
    # This will create a file named 'exercises.json' in the same directory as the script.
    with open("exercises.json", 'w') as f:
        # response.json() parses the text into a Python object
        data = response.json()
        # json.dump() writes the object to the file with nice formatting
        json.dump(data, f, indent=4)
    print("Successfully saved response to exercises.json")
else:
    print("Error:", response.status_code, response.text)