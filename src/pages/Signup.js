import {  SignUp } from  "@clerk/clerk-react";
import React from 'react';
import '../index.css';

function Signup() {


    return (
        <div className="flex h-screen w-screen justify-center items-center bg-contain bg-no-repeat bg-center bg-[url('../public/images/paint-bg.svg')] bg-white">
            <div className="flex justify-center items-center">

                <SignUp afterSignUpUrl="/dashboard"/>

            </div>


        </div>
    );
}
export default Signup;
