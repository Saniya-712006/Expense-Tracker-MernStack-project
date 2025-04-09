import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ratestyle.css';

const RateUs = () => {
    const [rating, setRating] = useState(null);
    const [review, setReview] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [ratingValue, setRatingValue] = useState('');
	const [userName, setUserName] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	
	const navigate = useNavigate();

  // Check if the user is logged in
  useEffect(() => {
    const storedName = localStorage.getItem('userName'); // Replace 'authToken' with your token key
    if (!storedName) {
      alert('You need to log in first!');
      navigate('/auth-page'); // Redirect to login page
    }
	else{
		setIsLoggedIn(true);
		setUserName(storedName);
	}
  }, [navigate]);	
	


    // Handle rating change
    const handleRatingChange = (e) => {
        setRating(e.target.value);
        setRatingValue(`You rated us with: ${e.target.value} stars`);
    };

    // Handle review change
    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!rating || !review) {
            alert("Please provide both a rating and a review.");
            return;
        }

        // Update the response message (before submitting)
        setResponseMessage('Thank you for your review! Submitting your review...');

        try {
            // Sending the data to Web3Forms API
            const response = await axios.post('https://api.web3forms.com/submit', {
                access_key: 'c1c9fefd-9be7-4a04-8c4b-0def63c99ba1', // Replace with your actual API key
				userName,
                rating: rating,
                review: review,
            });

            // Check if submission was successful
            if (response.status === 200) {
                setResponseMessage('Thank you for your review!');
            } else {
                setResponseMessage('Failed to submit your review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setResponseMessage('An error occurred. Please try again later.');
        }
    };
	
	  const handleLogout = () => {
    localStorage.removeItem('userName'); // Clear userName from localStorage
    alert('You have been logged out.');
    navigate('/auth-page'); // Redirect to login page
  };


    return (
        <div>
            <div className="container">
                <div className="rating-wrap">
                    <h2>Star Rating</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="hidden"
                            name="access_key"
                            value="c1c9fefd-9be7-4a04-8c4b-0def63c99ba1"
                        />

                        <div className="centre">
                            <fieldset className="rating">
                                <input
                                    type="radio"
                                    id="star5"
                                    name="rating"
                                    value="5"
                                    onChange={handleRatingChange}
                                    checked={rating === '5'}
                                />
                                <label htmlFor="star5" className="full"></label>

                                <input
                                    type="radio"
                                    id="star4"
                                    name="rating"
                                    value="4"
                                    onChange={handleRatingChange}
                                    checked={rating === '4'}
                                />
                                <label htmlFor="star4" className="full"></label>

                                <input
                                    type="radio"
                                    id="star3"
                                    name="rating"
                                    value="3"
                                    onChange={handleRatingChange}
                                    checked={rating === '3'}
                                />
                                <label htmlFor="star3" className="full"></label>

                                <input
                                    type="radio"
                                    id="star2"
                                    name="rating"
                                    value="2"
                                    onChange={handleRatingChange}
                                    checked={rating === '2'}
                                />
                                <label htmlFor="star2" className="full"></label>

                                <input
                                    type="radio"
                                    id="star1"
                                    name="rating"
                                    value="1"
                                    onChange={handleRatingChange}
                                    checked={rating === '1'}
                                />
                                <label htmlFor="star1" className="full"></label><br/>
                            </fieldset>
                        </div>
                        <br/><br/>
                        <h4>{ratingValue}</h4>
                        <br />
                        <br />

                        <h3>Your Review:</h3>
                        <textarea
                            name="review"
                            id="review"
                            rows="4"
                            placeholder="Write your review about our website"
                            value={review}
                            onChange={handleReviewChange}
                        ></textarea>

                        <button type="submit">Submit Review</button>
                        <p id="responseMessage">{responseMessage}</p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RateUs;
