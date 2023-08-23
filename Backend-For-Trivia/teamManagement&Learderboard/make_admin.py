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
    print("INSIDE USER UPDATE")
    url= 'https://us-central1-serverless-project-sdp36.cloudfunctions.net/update-user'
    # payload {email: email}
    payload = json.dumps({
        "email":email,
        "isTeamMember": True,
        "isTeamOwner": True,
    })
    headers = {
        'Content-Type': 'application/json'
    }
    user_details = requests.request("POST", url, headers=headers, data=payload)
    print(user_details.json())
    return user_details.json()

def make_team_member_admin(id,email):
    print("INSIDE TEAM MEMBER ADMIN FUNCTION")
    update_attribute_name = 'teamMember'
    try:
        teamDetails = get_team_details_by_id(id)
        updated_team_member = [member for member in teamDetails['teamMember'] if member['email'] != email]
        user_will_be_admin = [member for member in teamDetails['teamMember'] if member['email'] == email][0]
        print("user_will_be_admin",user_will_be_admin)
        user_will_be_admin["isTeamOwner"] = True
        updated_team_member.append(user_will_be_admin)
        print("updated_team_member===========+>",user_will_be_admin,updated_team_member)

        # Update the item using the update_item method
        response = teamTable.update_item(
            Key={"team_id": id},
            UpdateExpression='SET #attr = :val',  # UpdateExpression to specify the attribute and value to update
            ExpressionAttributeNames={'#attr': update_attribute_name},  # ExpressionAttributeNames to handle reserved keywords
            ExpressionAttributeValues={':val': updated_team_member}  # ExpressionAttributeValues to provide the new value
        )
        
        udpate_user_response = udpate_user(email)
        print(udpate_user_response)
        latestTeamDetails = get_team_details_by_id(id)
        return latestTeamDetails
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }

def lambda_handler(event, context):
    # TODO implement
    querystring = event['params']['querystring']
    team_id = querystring['team_id']
    email= querystring['email']
    
    try:
        # TODO: write code...
        latestTeamDetails = make_team_member_admin(team_id,email)
        return {
                "status": True,
                "message": "user updated successfully",
                "data":latestTeamDetails
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': f'Error: {str(e)}'
        }
    
    
