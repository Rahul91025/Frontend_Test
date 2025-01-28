import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token,setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    try {

      if(currentState === 'Sign Up') {
         const response =  await axios.post(backendUrl + '/api/user/register',{name,email,password});
         if(response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
         }
         else{
          toast.error(response.data.message);
         }
      }
      else{
        const response = await axios.post(backendUrl + '/api/user/login',{email,password});
        if(response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } 
        else{
          toast.error(response.data.message);
        }
      }

    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
      
    }
  };

useEffect(()=>{
  if(token){
    navigate('/');
    
    
  }

},[token]);



  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Name input (only for Sign Up) */}
      {currentState === 'Sign Up' && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}

      {/* Email input */}
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />

      {/* Password input */}
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />

      {/* Links for Forgot Password and Toggle State */}
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer text-gray-600 hover:underline">
          Forgot your password?
        </p>
        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentState('Sign Up')}
            className="cursor-pointer text-gray-600 hover:underline"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('Login')}
            className="cursor-pointer text-gray-600 hover:underline"
          >
            Login Here
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button className="bg-black text-white font-light px-8 py-2 mt-4 hover:bg-gray-800 transition">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;
