const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serverlessproject-391916-ffba238aaacf.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create Firestore instance
const db = admin.firestore();

// Create a new game
// https://firebase.google.com/docs/firestore/manage-data/add-data
// Reference: Add data to Cloud Firestore
exports.createGame = async (event) => {
  try {
    const { name, difficulty, category, timeframe, starttime, endtime, description } = JSON.parse(event.body);

    // Create a new game document
    const gameData = {
      name,
      difficulty,
      category,
      timeframe,
      starttime,
      endtime,
      createdDate: new Date(),
      description,
      questions: [],
    };

    // Add the game to Firestore
    const docRef = await db.collection('games').add(gameData);
    const game = { id: docRef.id, ...gameData };

    return {
      statusCode: 201,
      body: JSON.stringify(game),
    };
  } catch (error) {
    console.error('Error creating game:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create game' }),
    };
  }
};

// Add questions to a game
// https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
// Reference: Update a document
exports.addQuestionsToGame = async (event) => {
  try {
    const gameId = event.pathParameters.id;
    const { questionIds } = JSON.parse(event.body);

    // Get the game document
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Game not found' }),
      };
    }

    const gameData = gameDoc.data();

    // Add the questions to the game
    gameData.questions.push(...questionIds);
    await gameRef.update(gameData);

    return {
      statusCode: 200,
      body: JSON.stringify(gameData),
    };
  } catch (error) {
    console.error('Error adding questions to game:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add questions to game' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
// Reference: Update a document
exports.removeQuestionsFromGame = async (event) => {
  try {
    const gameId = event.pathParameters.id;

    // Get the game document
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Game not found' }),
      };
    }

    // Update the game document to remove all questions
    await gameRef.update({ questions: [] });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Questions removed successfully' }),
    };
  } catch (error) {
    console.error('Error removing questions from game:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to remove questions from game' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/query-data/get-data
// Reference: Get data with Cloud Firestore
//get all games
exports.getGames = async () => {
  try {
    const gamesSnapshot = await db.collection('games').get();
    const games = [];

    gamesSnapshot.forEach((gameDoc) => {
      games.push({
        id: gameDoc.id,
        ...gameDoc.data(),
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(games),
    };
  } catch (error) {
    console.error('Error fetching games:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch games' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/query-data/get-data
// Reference: Get data with Cloud Firestore
exports.getGameById = async (event) => {
  try {
    const gameId = event.pathParameters.id;

    // Fetch the game details from the database using the game ID
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Game not found' }),
      };
    }

    const gameData = gameDoc.data();

    return {
      statusCode: 200,
      body: JSON.stringify(gameData),
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch game details' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/manage-data/delete-data
// Reference: Delete data from Cloud Firestore
exports.deleteGame = async (event) => {
  try {
    const gameId = event.pathParameters.id;

    // Delete the game document
    await db.collection('games').doc(gameId).delete();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Game deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting game:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete game' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
// Reference: Update a document
exports.updateGame = async (event) => {
  try {
    const gameId = event.pathParameters.id;
    const { name, difficulty, category, timeframe, starttime, endtime, description } = JSON.parse(event.body);

    // Update the game document
    const gameRef = db.collection('games').doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Game not found' }),
      };
    }

    const updatedGameData = {
      name,
      difficulty,
      category,
      timeframe,
      starttime,
      endtime,
      description,
    };

    await gameRef.update(updatedGameData);

    return {
      statusCode: 200,
      body: JSON.stringify(updatedGameData),
    };
  } catch (error) {
    console.error('Error updating game:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update game' }),
    };
  }
};
