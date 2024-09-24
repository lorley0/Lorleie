import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword, verifyOtp } from '../../actions/authActions'; // Ensure to include verifyOtp action
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [inputValue, setInputValue] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(''); // Reset error when typing
    };

    const validateInput = () => {
        if (!inputValue) {
            setError('This field is required.');
            return false;
        }
        const isEmail = /\S+@\S+\.\S+/.test(inputValue);
        const isPhone = /^\d{10}$/.test(inputValue);
        if (!isEmail && !isPhone) {
            setError('Please enter a valid email address or phone number.');
            return false;
        }
        return true;
    };

    const forgotPasswordHandler = async () => {
        if (!validateInput()) return;

        setError(''); // Clear any previous error
        const response = await dispatch(forgotPassword(inputValue));

        if (response.success) {
            toast.success('An OTP has been sent to your provided contact!'); // Show success notification
            setIsOtpSent(true);
        } else {
            toast.error(response.message || 'Failed to send OTP. Please try again.'); // Show error notification
        }
    };

    const verifyOtpHandler = async () => {
        if (!otp) {
            setError('OTP is required.');
            return;
        }
        const response = await dispatch(verifyOtp(inputValue, otp));
        if (response.success) {
            toast.success('OTP verified! You can now reset your password.');
            navigate('/reset-password', { state: { emailOrPhone: inputValue } });
        } else {
            toast.error(response.message || 'Failed to verify OTP. Please try again.'); // Show error notification
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-4">
            <ToastContainer />
            <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Forgot Password</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {!isOtpSent ? (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email or Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter your email or phone number"
                                value={inputValue}
                                onChange={handleInputChange(setInputValue)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <button
                            onClick={forgotPasswordHandler}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Send OTP
                        </button>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={handleInputChange(setOtp)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <button
                            onClick={verifyOtpHandler}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        >
                            Verify OTP
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
