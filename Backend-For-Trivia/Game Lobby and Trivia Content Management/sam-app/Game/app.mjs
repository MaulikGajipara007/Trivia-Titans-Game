import * as game from './game.js'; // Import the code from game.js

export const handler = async (event, context) => {
  console.log('Event:', event); // Log the event object

  try {
    // Extract HTTP method and path from the routeKey
    const [httpMethod, rawPath] = event.routeKey.split(' ');

    // Invoke the appropriate function based on the API path
    if (rawPath === '/create' && httpMethod === 'POST') {
      return await game.createGame(event);
    } else if (rawPath.startsWith('/games/addedquestions/') && httpMethod === 'PUT') {
      return await game.addQuestionsToGame(event);
    } else if (rawPath.startsWith('/games/removequestions/') && httpMethod === 'PUT') {
      return await game.removeQuestionsFromGame(event);
    } else if (rawPath === '/games/get' && httpMethod === 'GET') {
      return await game.getGames(event);
    } else if (rawPath.startsWith('/gameget') && httpMethod === 'GET') {
      return await game.getGameById(event);
    } else if (rawPath.startsWith('/games/delete/') && httpMethod === 'DELETE') {
      return await game.deleteGame(event);
    } else if (rawPath.startsWith('/games/edit/') && httpMethod === 'PUT') {
      return await game.updateGame(event);
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Route not found' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
