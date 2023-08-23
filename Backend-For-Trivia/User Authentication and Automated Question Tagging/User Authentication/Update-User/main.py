from flask import jsonify, abort
from google.cloud import firestore
from functions_framework import http  # Import functions_framework

db = firestore.Client()

@http  # Use the http decorator from functions_framework
def update_user(request):
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
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)

    if request.method != 'POST':
        return abort(405, 'Method not allowed')

    request_json = request.get_json(silent=True)

    if not request_json or 'email' not in request_json:
        return abort(400, 'Bad Request: Must POST JSON payload with "email" field.')

    email = request_json['email']
    del request_json['email']

    # Query for the user with the provided email
    users_ref = db.collection('users')
    user_query = users_ref.where('email', '==', email).get()

    # Check if the user exists
    if not user_query:
        return jsonify({
            'statusCode': 404,
            'message': 'User not found'
        }), 404

    user_doc_ref = users_ref.document(user_query[0].id)

    # Update the user with provided fields
    user_doc_ref.update(request_json)

    headers = {'Access-Control-Allow-Origin': '*'}
    return jsonify({
        'statusCode': 200,
        'message': 'User updated successfully'
    }), 200, headers
