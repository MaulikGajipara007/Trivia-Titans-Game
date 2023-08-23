import { Modal } from 'antd';
import axios from 'axios';

// Title: Axios API
// Author: Axios
// Date: 17 July, 2023
// Availability: https://axios-http.com/docs/intro

// update the user score for each game in the database
const updateScore = async (myScore, teamScore, quizID, difficulty, createdDate, category, questionlength) => {
    try {
        const correctCount = teamScore/10;
        let result = false;
        if(correctCount >= Math.floor(questionlength * 0.70)){
            result = true;
        }

        let data = JSON.stringify({
            "userID": localStorage.getItem("email"),
            "quizID": quizID,
            "userScore": myScore,
            "teamScore": teamScore,
            "difficulty" : difficulty,
            "createdDate" : createdDate,
            "category": category,
            "didWin" : result
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-serverlessproject-391916.cloudfunctions.net/updateUserScore',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        let response = await axios.request(config);
        if (response.status !== 200) {
            Modal.error({
                title: "Error updating score"
            });
            return;
        }
    } catch (error) {
        console.log(error);
        Modal.error({
            title: 'Error updating score.'
        });
    }
};

// update the team data for each game in the database
const updateQuizPlayedData = async (quizID, teamScore, startTime, difficulty, createdDate, category, questionlength) => {
    try {
        const correctCount = teamScore/10;
        let result = false;

        if(correctCount >= Math.floor(questionlength * 0.70)){
            result = true;
        }

        let data = JSON.stringify({
            "teamID": localStorage.getItem("team_id"), 
            "quizID": quizID,
            "correctCount": correctCount,
            "startTime": startTime,
            "endTime": new Date(),
            "difficulty" : difficulty,
            "createdDate" : createdDate,
            "category": category,
            "didWin" : result
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-serverlessproject-391916.cloudfunctions.net/updateQuizPlayedData',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        let response = await axios.request(config);
        if (response.status !== 200) {
            Modal.error({
                title: "Error updating quiz played details"
            });
            return;
        }
    } catch (error) {
        console.log(error);
        Modal.error({
            title: 'Error updating score.'
        });
    }
};

// fetch questions from the database based on game id
const fetchDataFromServer = async (value) => {
    try {
        let data = JSON.stringify({
            "quizID": value,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-serverlessproject-391916.cloudfunctions.net/fetchQuestions',
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        };

        const response = await axios.request(config);
        const gameData = response.data;

        const questionList = gameData.questions.map((question) => {
            const shuffledOptions = [question.option1, question.option2, question.option3, question.answer]
                .sort(() => Math.random() - 0.5);

            return {
                question: question.description,
                options: shuffledOptions,
                answer: question.answer,
                explanation: question.explanation,
                hint: question.hint,
                time: gameData.timeframe,
            };
        });

        console.log("gameData:: ", gameData);
        const finalData = {
            questionList: questionList,
            name: gameData.name,
            category: gameData.category,
            difficulty: gameData.difficulty,
            createdDate: gameData.createdDate
        };
        console.log("finalData:: ", finalData);

        return { "statusCode": 200, "data": finalData };
    } catch (error) {
        console.log(error);
        return { "statusCode": 500, "Message": "Error Occurred while trying to fetch Quiz." };
    }
};

export { updateScore, fetchDataFromServer, updateQuizPlayedData };