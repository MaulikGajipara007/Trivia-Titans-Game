from flask import jsonify, abort
from google.cloud import firestore
from functions_framework import http  # Import functions_framework

db = firestore.Client()

@http  # Use the http decorator from functions_framework
def get_all_users(request):
    """
    HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`.
    """
    # Set CORS headers for preflight requests
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    if request.method != 'GET':
        return abort(405, 'Method not allowed')

    # Query for all users
    users_ref = db.collection('users')
    users_query = users_ref.stream()

    # Convert users to list of dictionaries
    users_list = [doc.to_dict() for doc in users_query]

    headers = {'Access-Control-Allow-Origin': '*'}
    return jsonify({
        'statusCode': 200,
        'users': users_list
    }), 200, headers
