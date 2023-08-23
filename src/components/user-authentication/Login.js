import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../App.css';
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
const { Title } = Typography;


export default function Login() {
    const navigate = useNavigate();

    // On finish will trigger when Login button is clicked
    const onFinish = async (values) => {
        const { email, password, answer1, answer2, answer3 } = values;
        console.log('Received values of form: ', JSON.stringify(values, null, 2));

        const params = {
            email: email,
            password: password,
            answer1: answer1,
            answer2: answer2,
            answer3: answer3
        }
        console.log("Params are: ", params)

        // Triggering Login POST API with payload- params
        try {
            console.log("Login Try hit")
            const response = await axios.post("https://app-2ktlibfmua-uc.a.run.app/login-user", params);

            console.log("Response from the API: ", response.data);
            console.log("Message : " + response.data.message);

            // handling responses from the api

            //login successful
            if (response.data.message === "User Login Successful") {
                alert("Login Successful");
                localStorage.setItem("email", response.data.email);
                navigate("/games");
            } else if (response.data.message === "Incorrect username or password.") {
                console.log("incorect hit")
                alert("Incorrect Email or Password.");
                navigate("/user/login");
            } else if (response.data.message === "Security answers don't match!!!") {
                alert("Security Answers Dont match. !!! Try Again");
                navigate("/user/login");
            } else {
                alert("Error Login. Try again");
            }

        } catch (error) {
            console.error("Error: ", error.response);
        }
    };

    return (
        // HTML Component of Login Form
        <div className='form'>
            <Title level={2}>Login</Title>

            <Form
                name="login"
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item
                    name="securityQuestion1"
                    initialValue="What is your favorite color?"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="answer1"
                    rules={[{ required: true, message: 'Please input your answer!' }]}
                >
                    <Input placeholder="Your Answer" />
                </Form.Item>

                <Form.Item
                    name="securityQuestion2"
                    initialValue="What is your pet's name?"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="answer2"
                    rules={[{ required: true, message: 'Please input your answer!' }]}
                >
                    <Input placeholder="Your Answer" />
                </Form.Item>

                <Form.Item
                    name="securityQuestion3"
                    initialValue="What city were you born in?"
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    name="answer3"
                    rules={[{ required: true, message: 'Please input your answer!' }]}
                >
                    <Input placeholder="Your Answer" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>

                {/* This is the Login with Google Component */}
                <LoginSocialGoogle
                    client_id={
                        "932539612097-pfs61ca1hhhd2d6hfnnueqgt5cslmio9.apps.googleusercontent.com"
                    }
                    scope="openid profile email"
                    discoveryDocs='claims_supported'
                    access_type='offline'
                    onResolve={async ({ provider, data }) => {
                        console.log(provider, data.email);
                        const params = {
                            email: data.email,
                            family_name: data.family_name,
                            given_name: data.given_name,
                            isTeamMember: false,
                            isTeamAdmin: false,
                        }
                        const email = data.email;
                        const params2 = {
                            email: email
                        }
                        try {
                            const response = await axios.post("https://us-central1-serverless-project-sdp36.cloudfunctions.net/add-user", params);
                            // const response2 = await axios.post("https://btx2z6qsqe3hsd7rtb7bwox4fi0ronkg.lambda-url.us-east-1.on.aws/", params2);
                            console.log("Response from the API: ", response.data);
                            if (response.data.success === true) {
                                localStorage.setItem("email", email)
                                console.log("Localstorage:" + localStorage.getItem("email"));
                                alert("Login Successfull")
                                navigate('/games')
                            }

                        } catch (error) {
                            console.error("Error: ", error.response);
                        }


                    }}
                    onReject={(err) => {
                        console.log(err);
                    }
                    }
                >

                    <GoogleLoginButton />

                </LoginSocialGoogle>

                <Link to="/user/forgot-password">Forgot Password?</Link>
                <p> or </p>
                <Link to="user/register">Don't have an account ? Register here</Link>
            </Form>
        </div>
    );
}
