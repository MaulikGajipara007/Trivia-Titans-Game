// exports.helloWorld = onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

// update the user score the database
exports.updateUserScore = functions.https.onRequest(async (req, res) => {
  await new Promise((resolve, reject) => {
    cors(req, res, async () => {
      try {
        const dataToAdd = {
          userID: req.body.userID,
          quizID: req.body.quizID,
          userScore: req.body.userScore,
          teamScore: req.body.teamScore,
          playedTime: new Date(),
          quizDifficultyLevel: req.body.difficulty,
          quizCreatedDate: req.body.createdDate,
          quizCategory: req.body.category,
          quizPassed: req.body.didWin,
        };

        const firestore = admin.firestore();
        const docRef = firestore.collection("userScore").doc();

        await docRef.set(dataToAdd);
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.status(200).send("Data added to Firestore.");
      } catch (error) {
        console.error("Error adding data to Firestore: ", error);
        res.status(500).send("Failed to add data to Firestore.");
      }
    });
  });
});

exports.updateQuizPlayedData = functions.https.onRequest(async (req, res) => {
  await new Promise((resolve, reject) => {
    cors(req, res, async () => {
      try {
        const dataToAdd = {
          quizID: req.body.quizID,
          correctCount: req.body.correctCount,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          quizDifficultyLevel: req.body.difficulty,
          quizCreatedDate: req.body.createdDate,
          quizCategory: req.body.category,
          quizPassed: req.body.didWin,
        };

        const db = admin.firestore();

        const teamDocRef = db.collection("quizPlayed").doc(req.body.teamID);
        const teamDoc = await teamDocRef.get();

        if (!teamDoc.exists) {
          await teamDocRef.set({});
        }

        // Add data to the subcollection using an auto-generated document ID
        const subcollectionRef = teamDocRef.collection("teamQuiz");
        await subcollectionRef.add(dataToAdd);

        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.status(200).send("Data added to Firestore.");
      } catch (error) {
        console.error("Error adding data to Firestore: ", error);
        res.status(500).send("Failed to add data to Firestore.");
      }
    });
  });
});

// fetching the question lists
exports.fetchQuestions = functions.https.onRequest(async (req, res) => {
  await new Promise((resolve, reject) => {
    cors(req, res, async () => {
      try {
        const db = admin.firestore();
        const quizID = req.body.quizID;
        const gameRef = db.collection("games").doc(quizID);
        const gamesSnapshot = await gameRef.get();
        if (gamesSnapshot.empty) {
          res.status(404).send("Quiz not found.");
        }
        const questions = [];
        const quizData = gamesSnapshot.data();

        const questionRefs = quizData.questions.map((questionId) =>
          db.collection("questions").doc(questionId),
        );

        const questionSnapshots = await Promise.all(
            questionRefs.map((questionRef) => questionRef.get()),
        );

        questionSnapshots.forEach((docSnapshot) => {
          if (docSnapshot.exists) {
            questions.push(docSnapshot.data());
          } else {
            console.log(`Question with ID "${docSnapshot.id}" not found.`);
          }
        });
        quizData.questions = questions;

        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "GET, POST");
        res.set("Access-Control-Allow-Headers", "Content-Type");
        res.status(200).json(quizData);
      } catch (error) {
        console.error("Error fetching Questions: ", error);
        res.status(500).send("Failed to fetch questions.");
      }
    });
  });
});
