import json
import boto3
import requests

TEAM_TABLE_NAME = 'Team'
dynamoDB = boto3.resource('dynamodb')
teamTable = dynamoDB.Table(TEAM_TABLE_NAME)
#team_id and UserEmail provided in event

def get_team_details_by_id(id):
    response = teamTable.get_item(Key={"team_id": id})
    return response["Item"]

def udpate_user(email):
    url= 'https://us-central1-serverless-project-sdp36.cloudfunctions.net/update-user'
    # payload {email: email}
    payload = json.dumps({
        "email":email,
        "isTeamMember": False,
        "isTeamOwner": False,
        "team_id": None
    })
    headers = {
        'Content-Type': 'application/json'
    }
    user_details = requests.request("POST", url, headers=headers, data=payload)
    print(user_details.json())
    return user_details.json()

def remove_team_member(id,email):
    update_attribute_name = 'teamMember'
    try:
        teamDetails = get_team_details_by_id(id)
        updated_team_member = [member for member in teamDetails['teamMember'] if member['email'] != email]
        # Update the item using the update_item method
        response = teamTable.update_item(
            Key={"team_id": id},
            UpdateExpression='SET #attr = :val',  # UpdateExpression to specify the attribute and value to update
            ExpressionAttributeNames={'#attr': update_attribute_name},  # ExpressionAttributeNames to handle reserved keywords
            ExpressionAttributeValues={':val': updated_team_member}  # ExpressionAttributeValues to provide the new value
        )

        update_user_response = udpate_user(email)
        team_data = get_team_details_by_id(id)
        return team_data
    except Exception as e:
        return str(e)

def lambda_handler(event, context):
    # TODO implement
    try:
        # TODO: write code...
        print(event)
        querystring = event['params']['querystring']
        team_id = querystring['team_id']
        email= querystring['email']
        team_data = remove_team_member(team_id,email)
        print(team_data)
        return {
            'statusCode': 200,
            'body': 'team updated successfully',
            "data": team_data
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }
    
    
