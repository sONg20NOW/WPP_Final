'use client'

import { getUserIdByUserName, Login } from "@/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

// login page
export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    return (
        <div>
        <form action={async (formData) => {
            const response = await Login(formData);
            if (response) {
                const userName = formData.get('userName');
                const newSearchParams = new URLSearchParams(searchParams);
                const userId = await getUserIdByUserName(userName);
                newSearchParams.set('userId', userId);
                const newPath = `/?${newSearchParams.toString()}`;
                console.log(newPath);
                router.push(newPath);
                toast.success(`Welcome, ${userName}!`);
            }
            else {
                toast.error("login failed!")
            }
            router.refresh();
        }}className="flex flex-col gap-2 justify-center items-center h-screen w-screen">
            <div className="font-bold text-4xl mb-16">Note App</div>
            <label className="input input-bordered flex items-center gap-2 w-max">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" name="userName" className="grow" placeholder="User Id" />
            </label>
            <label className="input input-bordered flex items-center gap-2 w-max mb-4">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70">
                    <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd" />
                </svg>
                <input type="password" name="password" className="grow" placeholder="Password" />
            </label>
            <button type="submit" className="btn btn-neutral w-1/12">Login</button>

        </form>
        <button onClick={
            () => {
                router.push('/login/register');
            }
        }className="btn btn-default fixed right-8 top-8">Register</button>
        </div>
    );
}