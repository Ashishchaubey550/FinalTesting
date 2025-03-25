import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Import the Modal component (created earlier)

const Signup = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const collectData = async (e) => {
        e.preventDefault();

        // Basic client-side validation
        if (!name || !email || !password) {
            setModalMessage("Please fill in all fields.");
            setIsModalOpen(true);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setModalMessage("Please enter a valid email address.");
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true); // Start loading

        try {
            let result = await fetch("http://localhost:9000/register", {
                method: 'POST',
                body: JSON.stringify({ name, password, email }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            result = await result.json();

            if (result && result.message === "User registered successfully") {
                localStorage.setItem("user", JSON.stringify(result));
                setModalMessage("Please Wait....");
                setIsModalOpen(true);
                setTimeout(() => {
                    navigate("/login"); // Redirect to login page
                }, 3000); // Redirect after 3 seconds
            } else {
                setModalMessage(result.error || "Email already registered.");
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setModalMessage("Failed to register. Please try again.");
            setIsModalOpen(true);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Register</h1>
                <form onSubmit={collectData} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </div>

            {/* Modal for displaying messages */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
};

export default Signup;