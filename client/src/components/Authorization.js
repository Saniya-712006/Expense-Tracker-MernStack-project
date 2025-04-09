import React ,{useState} from "react";
import SignUpPage from './signUp_page';
import LoginPage from './login';
import './Auth_styles.css'
const AuthPage=()=>{
const [isSignUp,setIsSignUp]=useState(true);
const toggleAuthPage=()=>{
	setIsSignUp(!isSignUp);
};

return(
<div className="AuthMainContent">
{isSignUp?(
<>
<SignUpPage/>
<p>Already have an account?{" "}
<button onClick={toggleAuthPage} >Log in here </button>
</p>
</>
):(
<>
<LoginPage />
<p> Dont have an account? {""}
<button onClick={toggleAuthPage}>SignUp here</button>
</p>
</>
)
}
</div>
);
};

export default AuthPage;