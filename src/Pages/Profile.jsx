import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast, { Toaster } from "react-hot-toast";

function AccountPage() {
  const { token } = useContext(ShopContext);
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({
    fullName: "",
    mobileNumber: "91+",
    email: "",
    gender: "MALE",
    dob: "",
    pincode: "",
    city: "",
    state: "",
    alternateMobile: "91+",
  });
  const [isEditing, setIsEditing] = useState(false);

  const statesWithCities = {
    Delhi: ["New Delhi", "Dwarka", "Karol Bagh"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara"],
    UttarPradesh: ["Lucknow", "Kanpur", "Varanasi"],
  };

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const storedImage = localStorage.getItem(`profileImage-${token}`);
    if (storedData) {
      setUserData(storedData);
    }
    if (storedImage) {
      setProfileImage(storedImage);
    }
  }, [token]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result;
        setProfileImage(base64Image);
        localStorage.setItem(`profileImage-${token}`, base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      const requiredFields = [
        "fullName",
        "mobileNumber",
        "email",
        "gender",
        "dob",
        "pincode",
        "city",
        "state",
      ];
      let isValid = true;

      if (!validateEmail(userData.email)) {
        isValid = false;
        toast.error("Invalid email format!");
      }

      const mobileRegex = /^91\+\d{10}$/;
      if (!mobileRegex.test(userData.mobileNumber)) {
        isValid = false;
        toast.error("Mobile number must start with 91+ and be 10 digits!");
      }

      for (let field of requiredFields) {
        if (!userData[field]) {
          isValid = false;
          toast.error(`${field} is required!`);
          break;
        }
      }

      if (isValid) {
        localStorage.setItem("userData", JSON.stringify(userData));
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (field, value) => {
    setUserData((prevData) => {
      if (field === "mobileNumber" || field === "alternateMobile") {
        if (!value.startsWith("91+")) {
          value = "91+" + value.replace(/^91\+/, "");
        }
      }
      return { ...prevData, [field]: value };
    });
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <Toaster />
        <div className="flex flex-col items-center mb-6">
          <label
            htmlFor="profileImageInput"
            className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                No Image
              </div>
            )}
          </label>
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <h3 className="text-lg font-bold mb-4 text-center">Profile Details</h3>
        <hr className="border-gray-300 my-2" />
        <div className="border-t pt-4">
          {Object.keys(userData).map((key) => (
            <div key={key} className="mb-4 flex justify-between items-center">
              <label className="font-bold capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              {isEditing ? (
                key === "dob" ? (
                  <DatePicker
                    selected={userData.dob ? new Date(userData.dob) : null}
                    onChange={(date) =>
                      handleChange(
                        "dob",
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                    className="border border-gray-300 rounded px-2"
                  />
                ) : key === "state" ? (
                  <select
                    value={userData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="border border-gray-300 rounded px-2"
                  >
                    <option value="">Select State</option>
                    {Object.keys(statesWithCities).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                ) : key === "city" ? (
                  <select
                    value={userData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="border border-gray-300 rounded px-2"
                    disabled={!userData.state}
                  >
                    <option value="">Select City</option>
                    {statesWithCities[userData.state]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                ) : key === "gender" ? (
                  <select
                    value={userData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="border border-gray-300 rounded px-2"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHERS">Others</option>
                  </select>
                ) : key === "mobileNumber" || key === "alternateMobile" ? (
                  <div className="flex items-center border border-gray-300 rounded px-2">
                    <span className="mr-2 flex items-center">
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="Indian Flag"
                        className="w-5 h-5 mr-1"
                      />
                      +91
                    </span>
                    <input
                      type="text"
                      value={userData[key].replace(/^91\+/, "")}
                      onChange={(e) =>
                        handleChange(key, `91+${e.target.value}`)
                      }
                      className="outline-none flex-grow ml-5"
                      placeholder={
                        key === "mobileNumber" ? "" : "Optional"
                      }
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={userData[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="border border-gray-300 rounded px-2"
                  />
                )
              ) : (
                <span>
                  {key === "mobileNumber" || key === "alternateMobile" ? (
                    <>
                      <img
                        src="https://flagcdn.com/in.svg"
                        alt="Indian Flag"
                        className="w-5 h-5 inline mr-1"
                      />
                      {userData[key]}
                    </>
                  ) : (
                    userData[key] || "Not Provided"
                  )}
                </span>
              )}
            </div>
          ))}

          <div className="mt-4 text-center">
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;
