import { SignIn } from  "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/clerk-react";
import React from 'react';
import '../index.css';
const clerkSettings = {
    apiKey: 'pk_test_cG9wdWxhci1qYXliaXJkLTU3LmNsZXJrLmFjY291bnRzLmRldiQ',
    frontendApi: 'https://paint-delta.vercel.app/',
    signInRedirectUrl: 'https://yourapp.clerk.app/sign-in',
    signUpRedirectUrl: 'https://yourapp.clerk.app/sign-up',
};

function LoginPage() {

    return (
        <div className="flex h-screen w-screen justify-center items-center bg-white">
            <div className="flex justify-center items-center">
            <SignIn signUpUrl="/signup" afterSignInUrl="/dashboard" />
            </div>
        </div>
    );
}
export default LoginPage;

// function HomePage() {
//     const { user, signOut } = useClerk();
//
//     const handleSignOutClick = () => {
//         signOut();
//     };
//
//     return (
//         <div>
//             <h1>Welcome, {user.fullName}!</h1>
//             <button onClick={handleSignOutClick}>Sign Out</button>
//         </div>
//     );
// }