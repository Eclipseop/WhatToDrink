import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';

const LoginBar: React.FC = () => {
    const [session] = useSession();

    return (
        <div className="h-8 bg-white w-full flex flex-row-reverse items-center pr-1">
            {session ? (
                <button onClick={() => signOut()}>Sign Out</button>
            ) : (
                <>
                    <button onClick={() => signIn()}>Sign In</button>
                    <p className="pr-2 text-xs text-gray-400 font-light">Sign in to save added ingredients!</p>
                </>
            )}
        </div>
    );
};

export default LoginBar;