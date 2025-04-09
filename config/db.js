const mongoose=require('mongoose');
const connectDB=async()=>{
	try{
		const conn=await mongoose.connect('mongodb://localhost:27017/CashCurb');
		console.log(`MongoDB cashcurb connected successfully :${conn.connection.host}`);
	}
	catch(err)
	{
		console.log(`Error: ${err.message}`);
		process.exit(1);
	}
};

module.exports=connectDB;