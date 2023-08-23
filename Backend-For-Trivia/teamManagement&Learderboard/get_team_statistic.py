import functions_framework
import json
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
        if request_json and 'teamId' in request_json:
            teamId = request_json['teamId']
        elif request_args and 'teamId' in request_args:
            teamId = request_args['teamId']
        else:
            teamId = 'World'

        team_id = teamId
        print(team_id)
        # total quiz count
        games_ref = db.collection(u'games')
        query = games_ref.get()
        games_count = len(query)
        print("Total quiz",games_count)



        # total quiz played
        quizPlayed_ref = db.collection(u'quizPlayed').document(team_id)
        query_ref = quizPlayed_ref.collection("teamQuiz");
        team_scores = query_ref.get()
        team_score_data = []
        for user in team_scores:
            team_score_data.append(user.to_dict())
            print(user)
        quizPlayed = len(team_score_data)
        print("Total quiz played",quizPlayed)

        # win game count


        winGames = sum(item["quizPassed"] for item in team_score_data)
        if(winGames == 0):
            winGames = 0
        print("win games", winGames)


        # total points
        totalPoint = sum(item["correctCount"] for item in team_score_data)
        if(totalPoint == 0):
            totalPoint = 0
        print("Total points", totalPoint*10)
        
        data = {
            "totalPoint": totalPoint*10,
            "winGames":winGames,
            "quizPlayed":quizPlayed,
            "games_count":games_count
        }

        headers = {'Access-Control-Allow-Origin': '*'}

        # if user_data:
        #     response = {'success': True, 'user': user_data[0]}
        #     return jsonify(response), 200, headers  # Return first match
        response = {'success': True, 'data': data}
        return jsonify(response), 200, headers
    except Exception as e:
        return str(e);
    
