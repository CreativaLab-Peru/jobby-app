"use client";

import {redirect} from "next/navigation";

export default function LoginPage() {
  return redirect('/login');
  // return (
  //   <div className="relative flex items-center justify-center min-h-screen">
  //     <div className="relative z-10">
  //       <RegisterForm />
  //     </div>
  //   </div>
  // );
}
