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
        <div className="h-screen w-screen bg-black"  >
            <div className="flex justify-center items-center absolute top-20 left-20">
                {/* <ClerkProvider publishableKey='pk_test_cG9wdWxhci1qYXliaXJkLTU3LmNsZXJrLmFjY291bnRzLmRldiQ'> */}
            <SignIn signUpUrl="/signup" afterSignInUrl="/dashboard" />
                {/* </ClerkProvider> */}
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