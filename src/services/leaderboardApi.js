import axios from "axios";

export const getUserStatistics = async () => {
    try {
        const response = await axios.get(
            `https://us-central1-csci-5410-serverless-38984.cloudfunctions.net/get_user_statistic`
        );
        const res = response.data?.data;
        return res;
    } catch (error) {
        console.error(error);
        return {};
    }
};

export const getTeamStatistics = async () => {
    try {
        const response = await axios.get(
            `https://us-central1-csci-5410-serverless-38984.cloudfunctions.net/get_team_statistic-leaderboard`
        );
        const res = response.data?.data;
        return res;
    } catch (error) {
        console.error(error);
        return {};
    }
};
