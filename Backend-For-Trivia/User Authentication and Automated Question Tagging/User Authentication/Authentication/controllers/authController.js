const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;
const {db} = require("../utils/firebaseConfig");
const client = new CognitoIdentityServiceProvider({apiVersion: "2016-04-19", region: "us-east-1"});

// user registration
const registerUser = (req, res) => {
  const {given_name, family_name, email, password, gender, birthdate, securityQuestion1, answer1, securityQuestion2, answer2, securityQuestion3, answer3} = req.body;


  console.log("User Details: ");
  console.log("Username: " + given_name + family_name);
  console.log("Email: " + email);
  console.log("password: " + password);
  console.log("gender: " + gender);
  console.log("birthdate: " + birthdate);

  if (!given_name || !family_name || !email || !gender || !birthdate || !password || !securityQuestion1 || !answer1 || !securityQuestion2 || !answer2 || !securityQuestion3 || !answer3) {
    console.log(req.body);
    return res.status(400).json({message: "Missing required fields....."});
  }

  const params = {
    ClientId: "6hnmm7060flol8mpn51atjc25i",
    Password: password,
    Username: email,
    UserAttributes: [
      {
        Name: "given_name",
        Value: given_name,
      },
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "birthdate",
        Value: birthdate,
      },
      {
        Name: "gender",
        Value: gender,
      },
      {
        Name: "family_name",
        Value: family_name,
      },
    ],
  };
  client.signUp(params, async (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "User Registration Failed.",
        error: err,
      });
    } else {
      // user entry in database
      await db.collection("users").add({
        given_name: given_name,
        family_name: family_name,
        email: email,
        birthdate: birthdate,
        gender: gender,
        securityQuestion1: securityQuestion1,
        answer1: answer1,
        securityQuestion2: securityQuestion2,
        answer2: answer2,
        securityQuestion3: securityQuestion3,
        answer3: answer3,
        isTeamMember: false,
        isTeamOwner: false,
      })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            return res.status(200).json({
              message: "User Registration Successful",
              userId: data.UserSub,
            });
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });


      // return message
      return res.status(200).json({
        message: "User Authentication Successful",
        userId: data.UserSub,
      });
    }
  });
};


// user verification
const confirmUser = (req, res) => {
  const {email, confirmationCode} = req.body;

  const params = {
    ClientId: "6hnmm7060flol8mpn51atjc25i",
    ConfirmationCode: confirmationCode,
    Username: email,
  };

  client.confirmSignUp(params, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "User Confirmation Failed.",
        error: err,
      });
    } else {
      return res.status(200).json({
        message: "User Confirmation Successful",
      });
    }
  });
};


// user Login
const loginUser = async (req, res) => {
  const {email, password, answer1, answer2, answer3} = req.body;

  console.log("Email: " + email);
  console.log("Password: " + password);
  console.log("Answer1: " + answer1);
  console.log("Answer2: " + answer2);
  console.log("Answer3: " + answer3);

  if (!email || !password || !answer1 || !answer2 || !answer3) {
    console.log(req.body);
    return res.status(400).json({message: "Missing required fields....."});
  }

  try {
    // Fetch the user document from Firestore
    const usersSnapshot = await db.collection("users").where("email", "==", email).get();


    // Check if the userSnapshot is empty
    if (usersSnapshot.empty) {
      return res.status(404).send({
        message: "User not found. Register the user first and then try login",
      });
    }

    const userDoc = usersSnapshot.docs[0];
    const user = userDoc.data();

    // Perform user authentication with Cognito
    const params = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "6hnmm7060flol8mpn51atjc25i",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    client.initiateAuth(params, (err, data) => {
      if (err) {
        if (err.message === "Incorrect username or password.") {
          return res.status(200).json({
            message: "Incorrect username or password.",
          });
        }
      } else {
        const accessToken = data.AuthenticationResult.AccessToken;
        const decodedJWT = jwt.decode(accessToken);
        const userId = decodedJWT.sub;

        // Check if security answers match
        if (
          answer1 === user.answer1 &&
          answer2 === user.answer2 &&
          answer3 === user.answer3
        ) {
          return res.status(200).json({
            message: "User Login Successful",
            userId: userId,
            email: email,
            authResult: data.AuthenticationResult,
          });
        } else {
          return res.status(200).json({
            message: "Security answers don't match!!!",
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// forgot password
const forgotPassword = (req, res) => {
  const {email} = req.body;

  if (!email) {
    res.status(400).json({
      message: "Email is required",
    });
  }

  const params = {
    ClientId: "6hnmm7060flol8mpn51atjc25i",
    Username: email,
  };

  client.forgotPassword(params, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to recover password.",
        error: err,
      });
    } else {
      return res.status(200).json({
        message: "Please check your email for the password reset link.",
        data: data,
      });
    }
  });
};

// reset password
const resetPassword = (req, res) => {
  const {email, confirmationCode, newPassword} = req.body;
  if (!email || !confirmationCode || !newPassword) {
    return res.status(400).json({
      message: "Missing requirement fields...",
    });
  }

  const params = {
    ClientId: "6hnmm7060flol8mpn51atjc25i",
    Username: email,
    ConfirmationCode: confirmationCode,
    Password: newPassword,
  };

  client.confirmForgotPassword(params, (err, data) => {
    if (err) {
      if (err.message === "Invalid verification code provided, please try again.") {
        return res.status(200).json({
          message: "Invalid verification code provided, please try again.",
          error: err,
        });
      }
    } else {
      return res.status(200).json({
        message: "Password reset Successful",
      });
    }
  });
};

module.exports = {
  registerUser,
  confirmUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
