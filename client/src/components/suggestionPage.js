import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './suggestionPage_styles.css';

const SuggestionPage = () => {
    const { userName } = useParams();
    const [suggestions, setSuggestions] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect to login if userName is not present
    useEffect(() => {
        if (!userName) {
            navigate('/auth-page'); // Redirect to login
        }
    }, [navigate, userName]);

    // Fetch suggestions from the API
    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/auth/suggestions/${userName}`);
            if (response.data?.suggestion) {
                setSuggestions(response.data.suggestion);
            } else {
                setSuggestions('No suggestions available at the moment!');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions('Unable to fetch suggestions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Handle logout
    const handleLogout = () => {
        navigate('/auth-page'); // Redirect to login
    };

    if (!userName) return null; // Avoid rendering if userName is not present

    return (
        <div className="suggestion-container">
            <h1>Welcome, {userName || 'User'}!</h1>
            <p>Here are some suggestions to manage your expenses better:</p>

            <button onClick={fetchSuggestions} className="fetch-button" disabled={loading}>
                {loading ? 'Fetching...' : 'Get Suggestions'}
            </button>

            <div className="suggestions-box">
                <p>{suggestions || 'Click the button to fetch suggestions.'}</p>
            </div>

            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
};

export default SuggestionPage;
