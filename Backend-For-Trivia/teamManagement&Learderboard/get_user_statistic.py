import functions_framework
from flask import request, jsonify
from firebase_admin import credentials, firestore, initialize_app

# Load the Firebase credentials
cred = credentials.Certificate('credentials.json')

# Initialize the Firebase app
default_app = initialize_app(cred)
db = firestore.client()
@functions_framework.http
def hello_http(request):
    """HTTP Cloud Function.
    Args:
        request (flask.Request): The request object.
        <https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <https://flask.palletsprojects.com/en/1.1.x/api/#flask.make_response>.
    """
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }

        return ('', 204, headers)
    try:
        request_json = request.get_json(silent=True)
        request_args = request.args
        print(request_args)
        if request_json and 'email' in request_json:
            email = request_json['email']
        elif request_args and 'name' in request_args:
            email = request_args['email']
        else:
            email = 'World'
            
        users_ref = db.collection(u'userScore')
        users = users_ref.get()
        user_score_data = []
        for user in users:
            user_score_data.append(user.to_dict())
        print(user_score_data)


        unique_categories = set()

        # Iterate through the data and add categories to the set
        for item in user_score_data:
            category = item['quizCategory']
            unique_categories.add(category)

        # Convert the set to a list (if needed)
        unique_categories_list = list(unique_categories)
        
        sorted_data = sorted(user_score_data, key=lambda x: x['userScore'], reverse=True)
        headers = {'Access-Control-Allow-Origin': '*'}

            # if user_data:
            #     response = {'success': True, 'user': user_data[0]}
            #     return jsonify(response), 200, headers  # Return first match
        response = {'success': True, 'data': {"userData":sorted_data , "categories": unique_categories_list}}
        return jsonify(response), 200, headers
        return 'Hello {}!'.format(email)
    except Exception as e:
        return str(e);

    
