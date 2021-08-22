import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/client';
import Link from 'next/link';

const Header: React.FC = () => {
    const [session] = useSession();

    return (
        <div className="flex items-center px-1 h-8 bg-white">
            <div className="flex">
                <Link href="/">
                    <a>Home</a>
                </Link>
            </div>
            <div className="flex flex-row-reverse w-full items-center">
                {session ? (
                    <button onClick={() => signOut()}>Sign Out</button>
                ) : (
                    <>
                        <button onClick={() => signIn()}>Sign In</button>
                        <p className="pr-2 text-xs text-gray-400 font-light">Sign in to save added ingredients!</p>
                    </>
                )}
            </div>
        </div>
        
    );
};

export default Header;