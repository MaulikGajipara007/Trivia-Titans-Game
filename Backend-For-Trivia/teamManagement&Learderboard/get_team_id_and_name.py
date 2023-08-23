import json
import boto3
import datetime

TEAM_TABLE_NAME = 'Team'
dynamodb = boto3.client('dynamodb')

def get_team_details():
    print("inside Funcrtion")
    response = dynamodb.scan(TableName=TEAM_TABLE_NAME)
    # Extract the items
    items = response['Items']
    
    python_data = []
    for item in items:
        python_data.append({
            'team_id': item["team_id"]["S"],
            'name': item["name"]["S"],
        })
    print(response)
    return python_data
        
def lambda_handler(event, context):
    # TODO implement
    print(event)
    try:
        teamDetails = get_team_details()
        # return team details
        return {
                'status': True,
                'message': "team details fetch Successfully",
                'data': teamDetails
        }
    except Exception as e:
        print("Error creating todo:", str(e))
        return { 'error': 'Failed to fetch team details' }
