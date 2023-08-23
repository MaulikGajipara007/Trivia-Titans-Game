import axios from "axios";

export const getUserProfile = async (email) => {
  try {
    const response = await axios.post(
      `https://us-central1-serverless-project-sdp36.cloudfunctions.net/get-user`,
      { email: email }
    );
    return response;
  } catch (error) {
    console.error(error);
    return {};
  }
};
