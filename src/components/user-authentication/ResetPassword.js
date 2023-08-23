import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
const { Title } = Typography;

export default function ResetPassword() {
    const navigate = useNavigate();

    // On finish will trigger when Reset button is clicked
    const onFinish = async (values) => {
        const { email, confirmationCode, newPassword, confirmNewPassword } = values;

        if (newPassword === confirmNewPassword) {
            const resetData = {
                email: email,
                confirmationCode: confirmationCode,
                newPassword: newPassword,
            };
            console.log('Reset Data:', resetData);

            // Triggering Reset Password POST API with payload- resetData
            try {
                const response = await axios.post("https://app-2ktlibfmua-uc.a.run.app/reset-password", resetData);

                console.log("Response from the API: ", response.data);
                console.log("Message : " + response.data.message);

                // handling response from the api
                if (response.data.message === "Password reset Successful") {
                    alert("Password Successfully reset.");
                    navigate("/user/login");
                } else if (response.data.message === "Invalid verification code provided, please try again.") {
                    alert("Invalid verification code provided, please try again.");
                    navigate("/user/forgot-password");
                } else {
                    alert("Something went wrong. Try Registering with new email.");
                    navigate("/user/register")
                }

            } catch (error) {
                console.error("Error: ", error.response);
            }
        } else {
            message.error('New passwords do not match!');
        }
    };

    return (
        // HTML Component of Reset Password form
        <div className='form'>
            <Title level={2}>Reset Password</Title>
            <p>Enter the required details:</p>

            <Form
                name="resetPassword"
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

                <Form.Item
                    name="confirmationCode"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the confirmation code!',
                        },
                    ]}
                >
                    <Input placeholder="Confirmation Code" />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the new password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="New Password" />
                </Form.Item>

                <Form.Item
                    name="confirmNewPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm the new password!',
                        },
                    ]}
                >
                    <Input.Password placeholder="Confirm New Password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
