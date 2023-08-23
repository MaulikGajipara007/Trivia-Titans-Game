import json
import requests
import boto3

TEAM_TABLE_NAME = 'Team'
dynamoDB = boto3.resource('dynamodb')
teamTable = dynamoDB.Table(TEAM_TABLE_NAME)
#team_id and UserEmail provided in event

def get_team_details_by_id(id):
    response = teamTable.get_item(Key={"team_id": id})
    return response["Item"]
    
def get_user_details(email):
    url= 'https://us-central1-serverless-project-sdp36.cloudfunctions.net/get-user'
    # payload {email: email}
    payload = json.dumps({
        "email": email
    })
    headers = {
        'Content-Type': 'application/json'
    }
    response = requests.request("POST", url, headers=headers, data=payload)
    response_data = response.json()
    print(response_data['user'])
    return response_data['user']

def update_team_member(id,data):
    update_attribute_name = 'teamMember'
    update_attribute_value =  data
    try:
        # Update the item using the update_item method
        response = teamTable.update_item(
            Key={"team_id": id},
            # UpdateExpression='SET #attr = :val',  # UpdateExpression to specify the attribute and value to update
            # ExpressionAttributeNames={'#attr': update_attribute_name},  # ExpressionAttributeNames to handle reserved keywords
            # ExpressionAttributeValues={':val': update_attribute_value}  # ExpressionAttributeValues to provide the new value
            UpdateExpression=f'SET {update_attribute_name} = list_append({update_attribute_name}, :val)',
            ExpressionAttributeValues={':val': [data]}
        )
        
        return {
            'statusCode': 200,
            'body': 'Item updated successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }

def lambda_handler(event, context):
    # TODO implement
    print(event)
    querystring = event['params']['querystring']
    team_id = querystring['team_id']
    email= querystring['email']
    user_details = get_user_details(email)
    update_team_member(team_id,{
       "email": user_details["email"],
       "family_name": user_details["family_name"],
       "given_name": user_details["given_name"],
       "isTeamMember": True,
       "isTeamOwner": False,
      })
    # team_details = get_team_details_by_id(team_id)
    return {
            "status": True,
            "message": "Team update successfully"
    }
    
