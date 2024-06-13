// components/AuthButtons.js
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Nav from "./Nav";

const Layout = ({ children }) => {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <div className="bg-blue-900 min-h-screen flex">
          <Nav />
          <div className="bg-white flex-grow mt-2 mr-2 p-2  rounded-lg">
            {children}
          </div>
        </div>
      ) : (
        <div className="bg-blue-900 w-screen h-screen flex items-center">
          <div className="text-center w-full">
            <button
              onClick={() => signIn("google")}
              className="bg-white p-2 px-4 rounded-lg"
            >
              Login with google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
