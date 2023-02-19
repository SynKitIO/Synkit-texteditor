import {  SignUp } from  "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/clerk-react";
import React from 'react';
import '../index.css';
const clerkSettings = {
    apiKey: 'pk_test_cG9wdWxhci1qYXliaXJkLTU3LmNsZXJrLmFjY291bnRzLmRldiQ',
    frontendApi: 'https://paint-delta.vercel.app/',
    signInRedirectUrl: 'https://yourapp.clerk.app/sign-in',
    signUpRedirectUrl: 'https://yourapp.clerk.app/sign-up',
};
function Signup() {


    return (
        <div className="h-screen w-screen bg-black">
            <div className="flex justify-center items-center absolute top-20 left-20">
                <ClerkProvider publishableKey='pk_test_cG9wdWxhci1qYXliaXJkLTU3LmNsZXJrLmFjY291bnRzLmRldiQ' settings={clerkSettings}>
                <SignUp/>
                </ClerkProvider>
            </div>


        </div>
    );
}
export default Signup;
