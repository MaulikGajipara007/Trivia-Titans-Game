import * as questions from './questions.js';

export const handler = async (event, context) => {
  console.log('Event:', event); // Log the event object

  try {
    // Extract HTTP method and path from the routeKey
    const [httpMethod, rawPath] = event.routeKey.split(' ');

    // Invoke the appropriate function based on the API path
    if (rawPath === '/questions/add' && httpMethod === 'POST') {
      return await questions.addQuestion(event);
    } else if (rawPath.startsWith('/questions/edit/') && httpMethod === 'PUT') {
      return await questions.editQuestion(event);
    } else if (rawPath.startsWith('/questions/delete/') && httpMethod === 'DELETE') {
      return await questions.deleteQuestion(event);
    } else if (rawPath === '/questions' && httpMethod === 'GET') {
      return await questions.getQuestions(event);
    } else if (rawPath.startsWith('/questions/') && httpMethod === 'GET') {
      return await questions.getQuestionById(event);
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
