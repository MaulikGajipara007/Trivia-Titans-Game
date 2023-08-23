const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = require('./serverlessproject-391916-ffba238aaacf.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create Firestore instance
const db = admin.firestore();

// https://firebase.google.com/docs/firestore/manage-data/add-data
// Reference: Add data to Cloud Firestore
// Add a new  question
exports.addQuestion = async (event) => {
  try {
    const { description, option1, option2, option3, answer, category, difficulty, explanation, hint, questiontag } = JSON.parse(
      event.body
    );

    // Create a new document in the 'questions' collection
    const docRef = await db.collection('questions').add({
      description,
      option1,
      option2,
      option3,
      answer,
      category,
      difficulty,
      explanation,
      hint,
      questiontag,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({ id: docRef.id }),
    };
  } catch (error) {
    console.error('Error adding question:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add question' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/manage-data/add-data#update-data
// Reference: Update a document
// Edit an existing  question
exports.editQuestion = async (event) => {
  try {
    const questionId = event.pathParameters.id;
    const { description, option1, option2, option3, answer, category, difficulty, explanation, hint } = JSON.parse(
      event.body
    );

    // Update the document with the given questionId in the 'questions' collection
    await db.collection('questions').doc(questionId).update({
      description,
      option1,
      option2,
      option3,
      answer,
      category,
      difficulty,
      explanation,
      hint,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Question updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating question:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update question' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/manage-data/delete-data
// Reference: Delete data from Cloud Firestore
// Delete a  question
exports.deleteQuestion = async (event) => {
  try {
    const questionId = event.pathParameters.id;

    // Delete the document with the given questionId from the 'questions' collection
    await db.collection('questions').doc(questionId).delete();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Question deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting question:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to delete question' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/query-data/get-data
// Reference: Get data with Cloud Firestore
// Fetch all  questions
exports.getQuestions = async () => {
  try {
    const snapshot = await db.collection('questions').get();
    const questions = [];
    snapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ questions }),
    };
  } catch (error) {
    console.error('Error fetching questions:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch questions' }),
    };
  }
};

// https://firebase.google.com/docs/firestore/query-data/get-data
// Reference: Get data with Cloud Firestore
// Fetch a single question by ID
exports.getQuestionById = async (event) => {
  try {
    const questionId = event.pathParameters.id;

    // Fetch the question from Firestore
    const questionRef = db.collection('questions').doc(questionId);
    const questionDoc = await questionRef.get();

    if (!questionDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Question not found' }),
      };
    }

    const question = questionDoc.data();
    return {
      statusCode: 200,
      body: JSON.stringify(question),
    };
  } catch (error) {
    console.error('Error retrieving question:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve question' }),
    };
  }
};
