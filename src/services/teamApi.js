import axios from "axios";
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import ToastMessage from "../components/ToastMessage";
const { v4: uuidv4 } = require("uuid");

// Done
export const getTeamDetailsById = async (id) => {
    try {
        const response = await axios.get(
            `https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team?team_id=${id}`
        );
        const teamDetails = {
            ...response.data?.data,
            teamOwner: response.data?.data.teamMember.filter(
                (teamMember) => teamMember.isTeamOwner
            )[0],
        };
        localStorage.setItem("teamOwnerEmail", teamDetails.teamOwner.email);
        return teamDetails;
    } catch (error) {
        console.error(error);
        return {};
    }
};

// Done
export const getUserDetails = async (email) => {
    try {
        const response = await axios.post(
            `https://us-central1-serverless-project-sdp36.cloudfunctions.net/get-user`,
            { email: email }
        );
        localStorage.setItem("team_id", response.data.user.team_id);
        return response.data.user;
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const updateUserDetails = async (user) => {
    try {
        const payload = {
            ...user,
            isTeamMember: true,
            isTeamOwner: true,
        };
        const response = await axios.post(
            `https://us-central1-serverless-project-sdp36.cloudfunctions.net/update-user`,
            payload
        );

        // return payload;
    } catch (error) {
        console.error(error);
        return {};
    }
};

// TODO: Remaining
export const getTeamStastics = async (teamId) => {
    try {
        const payload = {
            teamId: teamId,
        };
        const response = await axios.post(
            "https://us-central1-csci-5410-serverless-38984.cloudfunctions.net/get_team_statistic",
            payload
        );
        const data = response.data?.data;
        const converted_data = {
            totalGames: data.games_count,
            playedGames: data.quizPlayed,
            winGames: data.winGames,
            totalPoints: data.totalPoint,
        };
        return {
            ...converted_data,
            winLossRatio: converted_data.winGames / converted_data.playedGames,
        };
    } catch (error) {
        console.error(error);
        return {};
    }
};

// Done
export const getAllUserList = async () => {
    try {
        let response = await axios.get(
            `https://us-central1-serverless-project-sdp36.cloudfunctions.net/getAll-users`
        );
        return response;
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Done
export const createTeam = async (user) => {
    try {
        let createTeamPayload = {
            team_id: uuidv4(),
            // name: teamName,
            teamMember: [
                {
                    ...user,
                    isTeamOwner: true,
                    isTeamMember: true,
                },
            ],
        };
        const response = await axios.post(
            "https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team",
            createTeamPayload
        );
        const teamDetails = {
            ...response.data?.data,
            teamOwner: response.data?.data.teamMember.filter(
                (teamMember) => teamMember.isTeamOwner
            )[0],
        };

        const updatedUserPayload = {
            ...user,
            isTeamOwner: true,
            isTeamMember: true,
            team_id: teamDetails.team_id,
        };

        const updatedUser = await axios.post(
            `https://us-central1-serverless-project-sdp36.cloudfunctions.net/update-user`,
            updatedUserPayload
        );
        localStorage.setItem("teamOwnerEmail", user.email);
        localStorage.setItem("team_id", teamDetails.team_id);
        return { teamDetails: teamDetails, user: updatedUserPayload };
    } catch (error) {
        console.error(error);
    }
};

// Done
export const leaveTeam = async (email, teamId) => {
    try {
        const response = await axios.get(
            `https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team/leave?email=${email}&team_id=${teamId}`
        );
        // return "response.data";
        return response.data?.data;
    } catch (error) {
        console.error(error);
    }
};

// Done
export const makeAdmin = async (email, teamId) => {
    try {
        const response = await axios.get(
            `https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team/make-admin?email=${email}&team_id=${teamId}`
        );
        return response.data?.data;
    } catch (error) {
        console.error(error);
    }
};

// TODO: Remaining
export const sendInvitationEmail = async (teamId, userData) => {
    try {
        // const url =
        //     "https://ugxajnad2yxw32e5oykkgwmooe0ysvrp.lambda-url.us-east-1.on.aws/";
        const email = userData.email;
        // const payload = JSON.stringify({
        //     link: `https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team?team_id=${teamId}&email=${email}`,
        //     email: email,
        // });
        // const response = await axios.post(url, payload);

        // Send Notification Request

        fetch(
            "https://ugxajnad2yxw32e5oykkgwmooe0ysvrp.lambda-url.us-east-1.on.aws/",
            {
                method: "PUT",
                body: JSON.stringify({
                    link: `https://bluw11ljg3.execute-api.us-east-1.amazonaws.com/dev/team?team_id=${teamId}&email=${email}`,
                    email: email,
                }),
            }
        )
            .then((res) => res.json())
            .then((res) => {
                ToastMessage("Email sent sucessfully");
            })
            .catch((err) => {
                ToastMessage("Error in sending email", "fail");
            });
        // const response = {
        //     data: "fdfjajdsfks",
        // };
        return "Email sent successfully";
    } catch (error) {
        console.error(error);
    }
};
