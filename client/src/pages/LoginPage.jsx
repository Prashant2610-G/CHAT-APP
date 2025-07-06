import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (e) => {
    e.preventDefault();

    // First step: collect name, email, password
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }
    
    // // Final step: Submit bio + all data
    if (currState === "Sign up" && isDataSubmitted) {
      console.log("All Data Submitted:")
      console.log({ fullName, email, password, bio })
      alert("Account Created Successfully!")
      
    }
    
    login(currState === "Sign up" ? "signup" : "login", {fullName, email, password, bio}) 
    // Handle Login case here (optional)
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2x1'>

      {/* -------left side--- */}
      <img src={assets.logo_big} alt="" className='w-[min(30vw, 250px)]' />

      {/* -------right side--- */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-400 p-6 flex flex-col gap-4 rounded-lg shadow-lg backdrop-blur-md'>
  <h2 className='font-semibold text-2xl mb-2 flex justify-between items-center'>
    {currState}
    {currState === "Sign up" && isDataSubmitted && (
      <img
        onClick={() => setIsDataSubmitted(false)}
        src={assets.arrow_icon}
        alt="back"
        className='w-5 cursor-pointer'
      />
    )}
  </h2>

  {/* Sign up - Step 1 */}
  {currState === "Sign up" && !isDataSubmitted && (
    <>
      <input
        onChange={(e) => setFullName(e.target.value)}
        value={fullName}
        type="text"
        placeholder="Full Name"
        required
        className="p-2 rounded-md bg-transparent border border-gray-600 focus:outline-none placeholder-gray-400"
      />
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email Address"
        required
        className="p-2 rounded-md bg-transparent border border-gray-600 focus:outline-none placeholder-gray-400"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        required
        className="p-2 rounded-md bg-transparent border border-gray-600 focus:outline-none placeholder-gray-400"
      />
    </>
  )}

  {/* Sign up - Step 2: Bio after Create Account */}
  {currState === "Sign up" && isDataSubmitted && (
    <textarea
      onChange={(e) => setBio(e.target.value)}
      value={bio}
      rows={4}
      placeholder="Provide a short bio..."
      required
      className="p-2 rounded-md bg-transparent border border-gray-600 focus:outline-none placeholder-gray-400"
    />
  )}

  {/* Login Fields */}
  {currState === "Login" && (
    <>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email Address"
        required
        className="p-2 rounded-md bg-transparent border border-gray-600 focus:outline-none placeholder-gray-400"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        required
        className="p-2 rounded-md bg-transparent border border-gray-600 focus:outline-none placeholder-gray-400"
      />
    </>
  )}

  <button
    type="submit"
    className="bg-purple-500 hover:bg-purple-600 transition-all duration-200 text-white py-3 rounded-md"
  >
    {currState === "Sign up"
      ? isDataSubmitted
        ? "Submit Bio & Finish"
        : "Create Account"
      : "Login Now"}
  </button>

  <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to terms of use & privacy policy.</p>
        </div>

  <p className='text-sm text-gray-400'>
    {currState === "Sign up" ? (
      <>
        Already have an account?{" "}
        <span
          className='text-purple-400 cursor-pointer'
          onClick={() => {
            setCurrState("Login");
            setIsDataSubmitted(false);
          }}
        >
          Login here
        </span>
      </>
    ) : (
      <>
        Create an account{" "}
        <span
          className='text-purple-400 cursor-pointer'
          onClick={() => {
            setCurrState("Sign up");
            setIsDataSubmitted(false);
          }}
        >
          Click here
        </span>
      </>
    )}
  </p>
</form>
    </div>
  )
}

export default LoginPage
