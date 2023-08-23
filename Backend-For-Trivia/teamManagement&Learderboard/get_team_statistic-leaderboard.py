import functions_framework
import json
from flask import request, jsonify
from firebase_admin import credentials, firestore, initialize_app
import requests

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
            teamId = None

        team_id = teamId
        print(team_id)

        res = requests.get("https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/fetchteamidandname")
        res_data = res.json()
        team_name_dict = {entry["team_id"]: entry["name"] for entry in res_data["data"]}
        # {
        #     "status": true,
        #     "message": "team details fetch Successfully",
        #     "data": [
        #         {
        #             "team_id": "83ca19c8-c371-43c7-91e5-55f3898acebb",
        #             "name": "The Quiz Wizards"
        #         },
        #         {
        #             "team_id": "91ca435e-e4a2-4ddb-bc54-c921abfaa1d8",
        #             "name": "The Quiz Wizards"
        #         },
        #         {
        #             "team_id": "c80b0f87-0456-49f8-bca4-91ca0865d67b",
        #             "name": "The Brainiac Brigade"
        #         }
        #     ]
        # }

        # total quiz played
        quizPlayed_ref = db.collection(u'quizPlayed')
        teamDetails = quizPlayed_ref.get()
        document_ids = []
        for doc in teamDetails:
            document_ids.append(doc.id)
        print("team_ids",document_ids)
        
        
        teamLeaderBoardData = []
        unique_categories= set()
        # ek ek team ni quiz no data chhe
        for doc_id in document_ids:
            teamViseQuizData = []
            quizCount = 0
            quizResult_ref = quizPlayed_ref.document(doc_id).collection('teamQuiz')
            query_snapshot = quizResult_ref.get()

            # badhi quiz played ni details 
            for doc in query_snapshot:
                quizCount = quizCount + 1
                teamViseQuizData.append(doc.to_dict())
            print(teamViseQuizData)
            quiz_passed_count = sum(1 for item in teamViseQuizData if item['quizPassed'])

            for entry in teamViseQuizData:
                unique_categories.add(entry['quizCategory'])
            correct_count_sum = sum(item['correctCount'] for item in teamViseQuizData)
            teamLeaderBoardData.append({
                "playedGames": quizCount,
                "winGames": quiz_passed_count,
                "totalPoints": correct_count_sum*10,
                "name": team_name_dict[doc_id]
            })

        print("teamQuizData",teamLeaderBoardData)
        print("unique_categories",unique_categories)
        sorted_data = sorted(teamLeaderBoardData, key=lambda x: x['totalPoints'], reverse=True)
        data = {
            "teamLeaderBoardData": teamLeaderBoardData,
            "unique_categories":list(unique_categories)
        }

        headers = {'Access-Control-Allow-Origin': '*'}

        # if user_data:
        #     response = {'success': True, 'user': user_data[0]}
        #     return jsonify(response), 200, headers  # Return first match
        response = {'success': True, 'data': data}
        return jsonify(response), 200, headers
    except Exception as e:
        return str(e);
    
