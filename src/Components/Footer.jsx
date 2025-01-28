import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>

            <div>
            <h1 className="text-2xl mb-4 font-extrabold tracking-widest text-gray-800 uppercase relative">
  <span className="bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 bg-clip-text text-transparent">
   My Local Bazar
  </span>
  <span className="inline-block text-pink-400 ml-2 animate-pulse">.</span>
  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-20 bg-pink-300 rounded-full"></div>
</h1>
                <p className='w-full md:w-2/3 text-gray-600  '>
              
               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, tortor ac scelerisque fermentum, nunc justo mollis justo, at elementum diam arcu in massa. Integer in nunc pulvinar, pellentesque neque id, hendrerit neque. Aliquam erat volutpat. 
                </p>
                
            </div>

            <div>
                <p className='text-xl font-medium mb-5 '>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>


                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+1 212-456-7890</li>
                    <li>contact@localBazzar.com</li>

                </ul>
            </div>
           

        </div>
        <div>
                <hr/>
                <p className='py-5 text-sm text-center'> Copyright 2024@ LocalBazar.com - All Right Reserved. </p>
            </div>
      
    </div>
  )
}

export default Footer
