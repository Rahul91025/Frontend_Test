import React from "react";

const AddressList = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="text-2xl font-semibold mb-4">Your Addresses</div>

      {/* Add New Address Section */}
      <div className="border-dashed border-2 p-6 mb-6 flex justify-center items-center cursor-pointer text-lg text-gray-600 hover:bg-gray-100">
        <span className="text-xl font-bold">+</span>
        <p className="ml-2">Add address</p>
      </div>

      {/* Address Box 1 */}
      <div className="mb-6 p-6 border-2 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold">MANISH KUMAR SAMAL</div>
          <div className="flex space-x-4">
            <button className="text-blue-500 hover:underline">Edit</button>
            <div className="border-l-2 h-6 mx-2"></div> {/* Vertical line */}
            <button className="text-red-500 hover:underline">Remove</button>
          </div>
        </div>
        <div className="text-sm mb-2">HARIGOCHHIA FULBANI</div>
        <div className="text-sm mb-2">
          HARIGOCHHIA, BALESHWAR, ODISHA 756036
        </div>
        <div className="text-sm mb-2">India</div>
        <div className="text-sm mb-2">Phone number: 7327954280</div>
        <div className="text-sm text-blue-500 cursor-pointer hover:underline">
          Add delivery instructions
        </div>
      </div>

      {/* Address Box 2 */}
      <div className="mb-6 p-6 border-2 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-semibold">Manish kumar Samal</div>
          <div className="flex space-x-4">
            <button className="text-blue-500 hover:underline">Edit</button>
            <div className="border-l-2 h-6 mx-2"></div> {/* Vertical line */}
            <button className="text-red-500 hover:underline">Remove</button>
            <div className="border-l-2 h-6 mx-2"></div> {/* Vertical line */}
            <button className="text-gray-500 hover:underline">
              Set as Default
            </button>
          </div>
        </div>
        <div className="text-sm mb-2">Gita Autonomous college</div>
        <div className="text-sm mb-2">
          Gita Autonomous college, BHUBANESWAR, ODISHA 752054
        </div>
        <div className="text-sm mb-2">India</div>
        <div className="text-sm mb-2">Phone number: 7327954280</div>
        <div className="text-sm text-blue-500 cursor-pointer hover:underline">
          Add delivery instructions
        </div>
      </div>
    </div>
  );
};

export default AddressList;
