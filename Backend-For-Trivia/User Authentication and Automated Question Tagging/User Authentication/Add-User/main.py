import functions_framework
from flask import request, jsonify
from firebase_admin import credentials, firestore, initialize_app

# Load the Firebase credentials
cred = credentials.Certificate('credentials.json')

# Initialize the Firebase app
default_app = initialize_app(cred)

# Get a reference to the Firestore service
db = firestore.client()

@functions_framework.http
def add_user(request):
    """
    HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    # Set CORS headers for preflight requests
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    request_json = request.get_json(silent=True)

    if request_json and 'email' in request_json:
        email = request_json['email']
        given_name = request_json['given_name']
        family_name = request_json['family_name']
        # additional user data can be added as required

        # Create a reference to the users collection
        users_ref = db.collection(u'users')

        # Create a new user document
        user_doc = users_ref.document()

        # Define the user data
        user_data = {
            'email': email,
            'given_name': given_name,
            'family_name': family_name,
            "gender": " ",
            "answer1": "default",
            "answer2": "default",
            "answer3": "default",
            "isTeamMember": False,  # Corrected key in the dictionary
            "isTeamOwner": False    # Corrected key in the dictionary
        }

        # Set the new user document with the user data
        user_doc.set(user_data)

        headers = {'Access-Control-Allow-Origin': '*'}

        response = {'success': True, 'user': user_data}
        return jsonify(response), 201, headers

    else:
        response = {'success': False, 'message': 'Invalid request: missing required fields'}
        return jsonify(response), 400, headers
