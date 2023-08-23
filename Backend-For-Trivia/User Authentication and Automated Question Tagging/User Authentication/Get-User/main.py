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
def find_user_by_email(request):
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
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    request_json = request.get_json(silent=True)

    if request_json and 'email' in request_json:
        email = request_json['email']
        
        # Create a reference to the users collection
        users_ref = db.collection(u'users')

        # Create a query against the collection
        query_ref = users_ref.where(u'email', u'==', email)

        # Get a list of all matching documents
        users = query_ref.stream()

        user_data = []
        for user in users:
            user_data.append(user.to_dict())

        headers = {'Access-Control-Allow-Origin': '*'}

        if user_data:
            response = {'success': True, 'user': user_data[0]}
            return jsonify(response), 200, headers  # Return first match
        else:
            response = {'success': False, 'message': 'No user found'}
            return jsonify(response), 404, headers

    else:
        response = {'success': False, 'message': 'Invalid request: no email provided'}
        return jsonify(response), 400, headers
