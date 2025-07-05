import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="bg-neutral-800 min-h-screen text-amber-100 h-full py-30 font-mono relative">
      <div className="mx-auto w-200">
        <h1 className="text-5xl font-pixel text-center text-green-400 mb-10">Login</h1>
        <form className="space-y-5">
          <label>Username or Email</label>
          <input
            type="text"
            placeholder="myemail@bigmail.com"
            className="w-full px-4 py-2 border border-amber-100
focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <label>Password</label>
          <input
            type="text"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-amber-100
focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </form>
        <div className="flex font-pixel text-2xl gap-6 justify-center mt-6">
          <button
            className="border-amber-100 border-1 p-5 w-60 transition delay-100 duration-200 hover:bg-emerald-600 hover:animate-pulse">
            <div className="h-full w-full transition delay-100 duration-200 ease-in hover:scale-110">
              <p className="text-center">Login</p>
            </div>
          </button>
          <button
            className="border-amber-100 border-1 p-5 w-60 transition delay-100 duration-200 hover:bg-blue-600 hover:animate-pulse">
            <div className="h-full w-full transition delay-100 duration-200 ease-in hover:scale-110">
              <p className="text-center">Sign Up</p>
            </div>
          </button>
          <button
            className="border-amber-100 border-1 p-5 w-60 transition delay-100 duration-200 hover:bg-rose-600 hover:animate-pulse">
            <div className="h-full w-full transition delay-100 duration-200 ease-in hover:scale-110">
              <p className="text-center">Forget?</p>
            </div>
          </button>
        </div>
      </div>
      <Link
        to="/"
        className="font-pixel text-xl absolute border-amber-100 border-1 p-3 transition delay-100 duration-200 hover:bg-amber-600 hover:animate-pulse left-1 top-1">
        <div className="h-full w-full transition delay-100 duration-200 ease-in hover:scale-110">
          <p className="text-center">Home</p>
        </div>
      </Link>
    </div>
  )
}

export default Login
