import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
const { Title } = Typography;

export default function ForgotPassword() {
    const navigate = useNavigate();

    // On finish will trigger on button click
    const onFinish = async (values) => {
        const { email } = values;
        console.log('Entered email:', email);

        // Triggering Forgot Password POST API with payload- values
        try {
            const response = await axios.post("https://app-2ktlibfmua-uc.a.run.app/forgot-password", values);

            console.log("Response from the API: ", response.data);
            console.log("Message : " + response.data.message);

            // handling responses from the api
            if (response.data.message === "Please check your email for the password reset link.") {
                alert("Check Your email for reset code.")
                navigate("/user/reset-password");
            } else {
                alert("Failed to recover password.  Register with new email id.");
                navigate("user/register");
            }

        } catch (error) {
            console.error("Error: ", error.response);
        }
    };


    return (
        // HTML Component of Forgot Password
        <div className='form'>
            <Title level={2}>Forgot Password</Title>
            <p>Enter the registered email:</p>

            <Form
                name="forgotPassword"
                onFinish={onFinish}
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not a valid email!',
                        },
                        {
                            required: true,
                            message: 'Please enter your email!',
                        },
                    ]}
                >
                    <Input placeholder="Email" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
