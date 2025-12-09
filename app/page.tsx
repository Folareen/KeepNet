import Link from "next/link";

export default async function Home() {

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <h1 className="text-4xl font-bold">Welcome to KeepNet</h1>
        <div className="flex space-x-2 mx-auto mt-4 justify-center">
          <Link href="/login" className="bg-blue-700 rounded-md px-3 py-1.5 ">Login</Link>
          <Link href="/signup" className="bg-green-700 rounded-md px-3 py-1.5 ">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}