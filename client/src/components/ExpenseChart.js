// client/src/components/ExpenseChart.js

import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './expenseChart_styles.css'
// Import the Pie chart component from react-chartjs-2
import { Pie } from 'react-chartjs-2';
import  axios from 'axios';
// Import the specific parts of Chart.js needed for Pie chart
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register the necessary components with Chart.js
ChartJS.register(
  ArcElement, // For pie chart
  Title,
  Tooltip,
  Legend
);

const ExpenseChart = () => {
	
	
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isSignUp,setIsSignUp]=useState(false);
	const [userName, setUserName] = useState('');
	const [selectedCategory, setSelectedCategory] = useState(0);
  /*const navigate = useNavigate();
  
  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      // User is not logged in
      alert('You must log in to access this page.');
      navigate('/auth-page'); // Redirect to login page
    } else {
      // User is logged in
      setIsLoggedIn(true);
    }
  }, [navigate]);

  if (!isLoggedIn) {
    // Prevent rendering until login status is verified
    return null;
  }

*/
  // Define categories as per your requirement
  const categories = [
    'Housing',
    'Utilities',
    'Groceries',
    'Transportation',
    'Healthcare',
    'Insurance',
    'Entertainment/Leisure',
    'Savings',
    'Education',
    'Debt Repayment',
    'Miscellaneous'
  ];

  // State to hold selected category index
  //const [selectedCategory, setSelectedCategory] = useState(0);

  // State to hold chart data
  const [chartData, setChartData] = useState({
    labels: categories,
    datasets: [
      {
        label: 'Expenses',
        data: new Array(categories.length).fill(0), // Default to 0% for all categories
        backgroundColor: [
          '#008080', // Dark Slate Green - Housing
          '#DA70D6', // Light Slate Gray - Utilities
          '#6C7C7C', // Gray - Groceries
          '#00A9E0', // Sky Blue - Transportation
          '#47B8A4', // Medium Sea Green - Healthcare
          '#F1C232', // Golden Yellow - Insurance
          '#F06C44', // Orange Red - Entertainment/Leisure
          '#50C878', // Pale Turquoise - Savings
          '#D9C7A1', // Light Khaki - Education
          '#9E2A2B', // Red - Debt Repayment
          '#4E9F3D', // Green - Miscellaneous
        ],
      },
    ],
  });
  
  //const [userName, setUserName] = useState('');
  const navigate=useNavigate();
   useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
		alert('You need to login/signUp first!');
      navigate('/auth-page');
    }
	else
	{
		setIsLoggedIn(true);
		setIsSignUp(true);
		setUserName(storedName);
	}
  }, [navigate]);

  // Handler to update chart data
  const updateChartData = (value) => {
    const updatedData = [...chartData.datasets[0].data];
    updatedData[selectedCategory] = value;

    setChartData({
      ...chartData,
      datasets: [{ ...chartData.datasets[0], data: updatedData }],
    });
  };

const saveExpensesToDB = async () => {
  try {
    // Prepare chartData as array of { category, value }
    const formattedChartData = chartData.labels.map((category, index) => ({
      category,
      value: chartData.datasets[0].data[index],
    }));

    const response = await axios.post('http://localhost:5000/api/auth/expenses', {
      userName, // Replace with the logged-in user's name
      chartData: formattedChartData,
    });

    if (response.data.success) {
      alert('Expenses saved successfully!');
    } else {
      alert('Failed to save expenses!');
    }
  } catch (error) {
    console.error('Error saving expenses:', error);
    alert('An error occurred while saving expenses.');
  }
};

if(!isLoggedIn){
	return <p>Loading....</p>;
}






  return (
    <div className="outerdiv">
      <h2>Expense Distribution</h2>
		<p> Welcome, {userName}</p>
      <div className="innerdiv" >
        {/* Dropdown to select category */}
		Select the Expense category:
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(parseInt(e.target.value, 10))}
        >
          {categories.map((category, index) => (
            <option key={index} value={index}>
              {category}
            </option>
          ))}
        </select>

        {/* Input box for percentage */}
		Enter the monthy expenses for chosen category:
        <input
          type="number" 
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            updateChartData(isNaN(value) ? 0 : value);
          }}
          
        />
        {/* Update Button */}
        <button 
          onClick={saveExpensesToDB}
          
        >
          Save Data
        </button>
      </div>

      {/* Pie chart component */}
      <Pie data={chartData}   />
    </div>
  );
};

export default ExpenseChart;
