import json
import boto3
import datetime

TEAM_TABLE_NAME = 'Team'
dynamoDB = boto3.resource('dynamodb')
teamTable = dynamoDB.Table(TEAM_TABLE_NAME)

def get_team_details_by_id(id):
    response = teamTable.get_item(Key={"team_id": id})
    print(response["Item"])
    return response["Item"]
        
def lambda_handler(event, context):
    # TODO implement
    print(event)
    body = event
    querystring = event['params']['querystring']
    teamId = querystring['team_id']
    try:
        teamDetails = get_team_details_by_id(teamId)
        # return team details
        print("Team created successfully")
        return {
                'status': True,
                'message': "team details fetch Successfully",
                'data': teamDetails
        }
    except Exception as e:
        print("Error creating todo:", str(e))
        return { 'error': 'Failed to fetch team details' }
