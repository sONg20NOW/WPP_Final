'use server';

import { getNotes } from "@/actions";
import Main from "./ui/Main";
import Sidebar from "./ui/Sidebar";
import { redirect } from "next/navigation";

export default async function Home( {searchParams} ) {
  const sParams = await searchParams;
  const userId = parseInt(sParams.userId, 10) || 0;
  const Notes = await getNotes(userId);

  if (!userId) {
    redirect('/login');
  } else {
    return (    
      <div className='flex flex-row flex-nowrap h-screen'>
        <Sidebar Notes={Notes} UserId={userId}/>
        <Main Notes={Notes}/>
      </div>
    );
  }
}
