const express = require('express');
const router = express.Router();
//const { OpenAIApi, Configuration } = require("openai");
require('dotenv').config();
const axios = require('axios');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Expense = require('../models/Expense');
const ContactModel = require('../models/contactModel'); // Import the contact model
const SuggestionModel=require('../models/suggestionModel');


// Signup Route




router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success:false, message: "User already exists!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success:true,message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ success:false, message: "Error creating user", error });
  }
});

// Login Route
const jwt=require('jsonwebtoken');
router.post('/login', async (req, res) => {
	const { email, password } = req.body;
  try {
    

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
		console.log('user not found');
      return res.status(404).json({ success:false,message: "User not found!" });
    }

    // Check password
	const isMatch=await bcrypt.compare(password,user.password);
    //const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isMatch) {
		console.log('password mismatch');
      return res.status(400).json({ success:false,message: "Invalid credentials!" });
    }
	
	//generate JWT token
	/*const payload={ user:{id:user.id}};
	
	const secretKey=process.env.JWT_SECRET;
	
	jwt.sign(payload,secretKey,{expiresIn:'10h'},(err,token)=>{
		if(err) throw err;
		res.json({token});
	});
	
*/
    res.status(200).json({ success:true, message: "Login successful!", user });
  } catch (error) {
    res.status(500).json({ success:false, message: "Error logging in", error });
	console.error("Error logging in:", error.message);

  }
});



router.post('/reset-password',async (req,res)=>{
	const {email,password}=req.body;
	try{
		const user=await User.findOne({email});
		if(!user){
			return res.status(404).json({success:false,message:'User not found'});
			
		}
		const salt=await bcrypt.genSalt(10);
		const hashedPassword=await bcrypt.hash(password, salt);
		user.password=hashedPassword;
		await user.save();
		res.json({success:true,message:'Password reset successful'});
	}
	catch(err){
		res.status(500).json({success:false,message:'Error resetting password'});
	}
})




router.post('/expenses', async (req, res) => {
  try {
    const { userName, chartData } = req.body; // Expect chartData as an array of { category, value }

    if (!chartData || !Array.isArray(chartData)) {
      return res.status(400).json({ success: false, message: 'Invalid chart data format!' });
    }

    // Save expense data to MongoDB
    const expense = new Expense({ userName, chartData });
    await expense.save();

    res.status(201).json({ success: true, message: 'Expense data saved successfully!' });
  } catch (error) {
    console.error('Error saving expense data:', error);
    res.status(500).json({ success: false, message: 'Failed to save expense data' });
  }
});



//get for suggestions from expenses
router.get('/expenses/:userName', async (req, res) => {
  const { userName } = req.params;
  try {
    const expenses = await Expense.findOne({ userName });

    if (!expenses) {
      return res.status(404).json({ success: false, message: 'No expenses found for this user.' });
    }

    res.status(200).json({ success: true, data: expenses.chartData });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ success: false, message: 'Error fetching expenses' });
  }
});


/*router.post('/suggestions:userName', async (req, res) => {
    try {
        const { userName } = req.params;
        const expenses = await Expense.findOne({ userName : userName });

        if (!expenses) {
            return res.status(404).json({ message: 'User expenses not found.' });
        }

        const expenseSummary = expenses.chartData
            .map(data => `${data.category}: $${data.value}`)
            .join(', ');

        // OpenAI API configuration with organization_id and project_id
        const apiKey = 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
        const organizationId = org-yHtUn4t2HeJ0vJ7pEtC6VrfC
        const projectId = proj_92h6WF6Lo6nxa1AoAYL2lweP
        
        const openAIResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions', 
            {
                model: "gpt-3.5-turbo", // Or another model you want to use
                messages: [
                    {
                        role: "user",
                        content: `My monthly expenses are: ${expenseSummary}. Suggest ways to save money.`
                    }
                ],
                max_tokens: 150
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`, // Use the API key from your environment
                    'Content-Type': 'application/json',
                    'OpenAI-Organization-ID': organizationId, // Add the organization ID here
                    'Project-ID': projectId // Add the project ID here
                }
            }
        );

        const suggestionText = openAIResponse.data.choices[0].message.content;

        // Save suggestion to the database
        const suggestion = new SuggestionModel({
            userName: userName,
            chartData: expenses.chartData,
            suggestion: suggestionText,
        });
        await suggestion.save();

        res.json({ suggestion: suggestionText });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ success: false, message: 'Error generating suggestions' });
    }
});


*/
router.post('/suggestions/:userName', async (req, res) => {
    try {
        const { userName } = req.params;

        // Find user expenses from the database
        const expenses = await Expense.findOne({ userName });
        if (!expenses) {
            return res.status(404).json({ message: 'User expenses not found.' });
        }

        // Rule-based suggestion generation
        const suggestions = [];
        const totalExpense = expenses.chartData.reduce((sum, data) => sum + data.value, 0);
		const educationLimitHigh = totalExpense * 0.10;  // High limit: 10% of total expenses
		const educationLimitLow = totalExpense * 0.05;   // Low limit: 5% of total expenses
		const debtRepaymentHighLimit = totalExpense * 0.20; // High limit: 20% of total expenses
const debtRepaymentLowLimit = totalExpense * 0.05;  // Low limit: 5% of total expenses
const debtRepaymentOptimalLimit = totalExpense * 0.10; 
const miscellaneousHighLimit = totalExpense * 0.15; // Too high: 15% of total expenses
const miscellaneousOptimalLimit = totalExpense * 0.07; // Optimal: 7% of total expenses
const miscellaneousNeedsAttentionLimit = totalExpense * 0.10; // Needs attention: 10% of total expenses


        // Example rules
        for (const data of expenses.chartData) {
            if (data.category.toLowerCase() === 'entertainment' && data.value > totalExpense * 0.2) {
                suggestions.push(`Consider reducing your entertainment expenses, which account for ${data.value} (more than 20% of your total expenses).`);
            }
            if (data.category.toLowerCase() === 'food' && data.value > totalExpense * 0.3) {
                suggestions.push(`Your food expenses are ${data.value}, which is higher than the recommended 30% of total expenses.`);
            }
            if (data.category.toLowerCase() === 'savings' && data.value < totalExpense * 0.1) {
                suggestions.push(`Your savings are below 10% of your total expenses. Consider saving more.`);
            }
			if (data.category.toLowerCase() === 'housing' && data.value > totalExpense * 0.4) {
    suggestions.push(`Your housing expenses are ${data.value}, which is more than 40% of your total expenses. Consider looking for ways to reduce rent, utilities, or other housing costs.`);
}
			if (data.category.toLowerCase() === 'transportation' && data.value > totalExpense * 0.05) {
    suggestions.push(`Your transportation expenses amount to ${data.value}, which is more than 15% of your total expenses. Consider using public transportation, carpooling, or other cost-effective options.`);
}
			if (data.category.toLowerCase() === 'healthcare' && data.value > totalExpense * 0.10) {
    suggestions.push(`Your healthcare expenses amount to ${data.value}, which is more than 10% of your total expenses. You may want to review your healthcare plan and explore ways to reduce medical costs.`);
}

if (data.category.toLowerCase() === 'insurance' && data.value > totalExpense * 0.07) {
    suggestions.push(`Your insurance expenses amount to ${data.value}, which is over 7% of your total expenses. This suggests you're adequately covered, but be sure to review whether you're getting the best value for your premiums.`);
} else if (data.category.toLowerCase() === 'insurance' && data.value < totalExpense * 0.05) {
    suggestions.push(`Your insurance expenses amount to ${data.value}, which is below 5% of your total expenses. You may want to consider reviewing your coverage to ensure you're adequately protected.`);
}
if (data.category.toLowerCase() === 'utilities' && data.value > totalExpense * 0.08) {
    suggestions.push(`Your utilities expenses are ${data.value}, which exceeds 8% of your total expenses. Consider reviewing your usage or seeking more cost-efficient options.`);
} else if (data.category.toLowerCase() === 'utilities' && data.value < totalExpense * 0.05) {
    suggestions.push(`Your utilities expenses are ${data.value}, which is below 5% of your total expenses. This seems like a good balance in terms of utility costs.`);
}
if (data.category.toLowerCase() === 'groceries' && data.value > totalExpense * 0.15) {
    suggestions.push(`Your grocery expenses are ${data.value}, which exceeds 15% of your total expenses. Consider reviewing your shopping habits or exploring cost-saving strategies.`);
} else if (data.category.toLowerCase() === 'groceries' && data.value >= totalExpense * 0.10 && data.value <= totalExpense * 0.15) {
    suggestions.push(`Your grocery expenses are ${data.value}, which is within the 10-15% range of your total expenses. This seems like a healthy balance for food spending.`);
}


if (data.category.toLowerCase() === 'education' && data.value > educationLimitHigh) {
    suggestions.push(`Your education expenses are ${data.value}, which exceeds 10% of your total expenses. This is a positive sign, as investing in education is a valuable long-term strategy.`);
} else if (data.category.toLowerCase() === 'education' && data.value < educationLimitLow) {
    suggestions.push(`Your education expenses are ${data.value}, which is less than 5% of your total expenses. Consider allocating more towards education, as it's a crucial investment for the future.`);
}

if (data.category.toLowerCase() === 'debt repayment' && data.value > debtRepaymentHighLimit) {
    suggestions.push(`Your debt repayment of ${data.value} exceeds 20% of your total expenses. While it's important to prioritize debt, this could be too high a portion of your budget, possibly affecting your other needs.`);
} else if (data.category.toLowerCase() === 'debt repayment' && data.value < debtRepaymentLowLimit) {
    suggestions.push(`Your debt repayment of ${data.value} is below 5% of your total expenses. You may want to consider increasing your debt repayment to reduce interest over time and pay off your debt faster.`);
} else if (data.category.toLowerCase() === 'debt repayment' && data.value >= debtRepaymentLowLimit && data.value <= debtRepaymentOptimalLimit) {
    suggestions.push(`Your debt repayment of ${data.value} is within the optimal range of 5-15% of your total expenses. This is a healthy approach, balancing debt reduction with other financial goals.`);
}
if (data.category.toLowerCase() === 'miscellaneous' && data.value > miscellaneousHighLimit) {
    suggestions.push(`Your miscellaneous expenses of ${data.value} exceed 15% of your total expenses. This suggests you may be overspending on non-essential items. Consider reviewing this category to make adjustments.`);
} else if (data.category.toLowerCase() === 'miscellaneous' && data.value > miscellaneousNeedsAttentionLimit) {
    suggestions.push(`Your miscellaneous expenses of ${data.value} are above 10% of your total expenses. It might be a good idea to review your spending and reduce unnecessary costs.`);
} else if (data.category.toLowerCase() === 'miscellaneous' && data.value <= miscellaneousOptimalLimit) {
    suggestions.push(`Your miscellaneous expenses of ${data.value} are within the optimal range of up to 7% of your total expenses. You're managing this category well.`);
}
if (data.category.toLowerCase() === 'debt repayment') {
    if (data.value > debtRepaymentHighLimit) {
        suggestions.push(`Your debt repayment expenses are ${data.value}, which is over 20% of your total expenses. Consider restructuring your debt or finding ways to reduce interest rates to manage it better.`);
    } else if (data.value > debtRepaymentOptimalLimit && data.value <= debtRepaymentHighLimit) {
        suggestions.push(`Your debt repayment expenses are ${data.value}, which is between 10-20% of your total expenses. This is manageable, but try to stay closer to the 10% range for better financial health.`);
    } else if (data.value < debtRepaymentLowLimit) {
        suggestions.push(`Your debt repayment expenses are ${data.value}, which is less than 5% of your total expenses. While this seems low, ensure that you're not accruing high-interest debt.`);
    }
}


			
        }

        // If no specific suggestions, add a general one
        if (suggestions.length === 0) {
            suggestions.push('Your expenses seem well-balanced. Keep up the good work!');
        }

        // Join suggestions into a single string for storage and response
        const suggestionText = suggestions.join(' ');

        // Save suggestion to the database
        const suggestion = new SuggestionModel({
            userName,
            chartData: expenses.chartData,
            suggestion: suggestionText,
        });
        await suggestion.save();

        // Respond with the suggestions
        res.status(200).json({ success: true, suggestion: suggestionText });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ success: false, message: 'Error generating suggestions' });
    }
});









// Route to handle form submission
router.post('/submit-contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Save contact form data to the database
    const newContact = new ContactModel({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: 'Your query has been submitted successfully!' });
  } catch (error) {
    console.error('Error saving contact data:', error);

    // Check for duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This email is already registered with another query.' });
    }

    res.status(500).json({ success: false, message: 'An error occurred while submitting your query. Please try again later.' });
  }
});

// Optional: Route to fetch all contact queries (for admin or debugging purposes)
router.get('/get-contacts', async (req, res) => {
  try {
    const contacts = await ContactModel.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contact queries.' });
  }
});



module.exports=router;
