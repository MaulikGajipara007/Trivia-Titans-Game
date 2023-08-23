import json
import boto3
import datetime

TEAM_TABLE_NAME = 'Team'
dynamoDB = boto3.resource('dynamodb')
teamTable = dynamoDB.Table(TEAM_TABLE_NAME)
lambda_client = boto3.client('lambda')


def get_team_details_by_id(id):
    response = teamTable.get_item(Key={"team_id": id})
    print(response["Item"])
    return response["Item"]
        
def lambda_handler(event, context):
    # TODO implement
    print(event)
    body = event
    print(body)
    
    target_function_name = 'generate_team_name';
    try:
        
        response = lambda_client.invoke(
            FunctionName=target_function_name,
            InvocationType='RequestResponse',  # Use 'Event' for asynchronous invocation
        )
        
        response_payload = json.loads(response['Payload'].read().decode('utf-8'))
        print(response_payload)
        item = {
            "team_id": body["team_id"],
            "name": response_payload["team_name"],
            "teamMember": body["teamMember"]
        }
        
        
        teamTable.put_item(Item= item)
        teamDetails = get_team_details_by_id( body["team_id"])
        # return team details
        
        
        print("Team created successfully")
        return {
                'status': True,
                'message': "team Created Successfully",
                'data': teamDetails
        }
    except Exception as e:
        print("Error creating todo:", str(e))
        return { 'error': 'Failed to create team' }
