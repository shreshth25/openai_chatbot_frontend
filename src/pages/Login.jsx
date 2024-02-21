import React, { useState } from 'react'
import "../App.css";
import viteLogo from "/vite.svg";
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e)=>{
    e.preventDefault()
    alert(username+" "+ password)
    
  }

  return (
    <div className='login'>
      <div className='login-box'>
        <img src={viteLogo} className='login-box-logo'></img>
        <form className='form' onSubmit={handleLogin}>
          <div>
          <input className='username' placeholder='username' type='text' value={username} onChange={(e)=>setUsername(e.target.value)}></input>
          </div>
          <div>
          <input className='password' placeholder='password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}></input>
          </div>
          <div>
          <button className='btn' type='submit'>Login</button>
          </div>
          
        </form>
      </div>
    </div>
  )
}

export default Login
