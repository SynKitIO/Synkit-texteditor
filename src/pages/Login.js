import { SignIn,useAuth } from  "@clerk/clerk-react";
import React, {useEffect} from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const { getToken} = useAuth();
const navigate=useNavigate();
    useEffect(() => {
        async function checkUser() {
            const token = await getToken();
            if(token)
            {

                navigate('/dashboard');
            }
            else
            {

                navigate('/');
            }

        }
checkUser();
    }, []);




    return (
        <div className="flex h-screen w-screen justify-center items-center bg-contain bg-no-repeat bg-center bg-[url('../public/images/paint-bg.svg')] bg-white">
            <div className="flex justify-center items-center">
            <SignIn signUpUrl="/signup" afterSignInUrl="/dashboard" />
            </div>
        </div>
    );
}
export default LoginPage;

