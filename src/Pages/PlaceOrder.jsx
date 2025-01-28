import React, { useContext, useState, useEffect } from "react";
import Title from "../Components/Title";
import CartTotal from "../Components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  // Load saved details from local storage on component mount
  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (savedDetails) {
      setFormData(savedDetails);
    }
  }, []);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const saveUserDetailsToLocalStorage = () => {
    localStorage.setItem("userDetails", JSON.stringify(formData));
    toast.success("Details saved successfully!");
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );

            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error("Failed to place order");
          }
          break;
        }
        case "stripe": {
          const responseStripe = await axios.post(
            backendUrl + "/api/order/stripe",
            orderData,
            { headers: { token } }
          );
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data;
            window.location.replace(session_url);
          } else {
            toast.error("Failed to place order");
          }
          break;
        }
        case "razorpay": {
          const responseRazorpay = await axios.post(
            backendUrl + "/api/order/razorpay",
            orderData,
            { headers: { token } }
          );
          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching product data.");
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZARPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order payment",
      description: "Order payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/orders");
            setCartItems({});
          }
        } catch (e) {
          console.error(e);
          toast.error("Failed to process payment");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last name"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email address"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
        <input
          onChange={onChangeHandler}
          value={formData.street}
          name="street"
          type="text"
          placeholder="Street"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <div className="flex gap-3">
          <input
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="Zipcode"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
          <input
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          required
        />
        {/* Save Details Button */}
        <button
          type="button"
          onClick={saveUserDetailsToLocalStorage}
          className="bg-black text-white py-2 px-4 rounded mt-4"
        >
          Save Details
        </button>
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal showCouponButtons={false} />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment Method Selection */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => setMethod("stripe")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                method === "stripe" ? "border-green-400 bg-gray-100" : ""
              }`}
            >
              <p
                className={`w-4 h-4 border rounded-full ${
                  method === "stripe" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.stripe_logo}
                alt="Stripe Logo"
              />
            </div>
            <div
              onClick={() => setMethod("razorpay")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                method === "razorpay" ? "border-green-400 bg-gray-100" : ""
              }`}
            >
              <p
                className={`w-4 h-4 border rounded-full ${
                  method === "razorpay" ? "bg-green-400" : ""
                }`}
              ></p>
              <img
                className="h-5"
                src={assets.razorpay_logo}
                alt="Razorpay Logo"
              />
            </div>
            {/* Debit Card Option */}
            <div
              onClick={() => setMethod("debit")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                method === "debit" ? "border-green-400 bg-gray-100" : ""
              }`}
            >
              <p
                className={`w-4 h-4 border rounded-full ${
                  method === "debit" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-800 text-sm">Debit Card</p>
            </div>
            {/* Credit Card Option */}
            <div
              onClick={() => setMethod("credit")}
              className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                method === "credit" ? "border-green-400 bg-gray-100" : ""
              }`}
            >
              <p
                className={`w-4 h-4 border rounded-full ${
                  method === "credit" ? "bg-green-400" : ""
                }`}
              ></p>
              <p className="text-gray-800 text-sm">Credit Card</p>
            </div>
          </div>
          {/* Cash On Delivery Option */}
          <div
            onClick={() => setMethod("cod")}
            className={`flex items-center mt-[1rem] w-[11rem]  gap-3 border p-2 px-3 cursor-pointer ${
              method === "cod" ? "border-green-400 bg-gray-100" : ""
            }`}
          >
            <p
              className={`w-4 h-4 border rounded-full ${
                method === "cod" ? "bg-green-400" : ""
              }`}
            ></p>
            <p className="text-gray-800 text-sm">Cash On Delivery</p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-3 rounded"
          >
            Place Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
