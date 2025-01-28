import React, { useContext, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";

const CartTotal = ({ showCouponButtons = true }) => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    couponApplied,
    applyCoupon,
    removeCoupon,
  } = useContext(ShopContext);

  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const subtotal = getCartAmount();
  const discount = couponApplied ? 50 : 0;
  const total = subtotal === 0.0 ? 0.0 : subtotal + delivery_fee - discount;

  const handleApplyCoupon = () => {
    if (couponCode === "DISCOUNT50") {
      applyCoupon();
      setShowCouponPopup(false); // Close the popup after applying coupon
    } else {
      alert("Invalid Coupon Code");
    }
  };

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {subtotal}.00
          </p>
        </div>
        <hr />

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}.00
          </p>
        </div>
        <hr />

        {couponApplied && (
          <div className="flex justify-between">
            <p>Discount</p>
            <p>
              - {currency} {discount}.00
            </p>
          </div>
        )}
        <hr />

        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency} {total}.00
          </b>
        </div>

        {showCouponButtons && !couponApplied && (
          <button
            className="relative sm:top-[4.8rem] top-7 sm:left-6 sm:w-[11.4rem] w-[6rem] w-[14rem] left-[9.5rem] sm:mb-0 mb-4 bg-black hover:bg-gray-800 text-white py-3 px-4"
            onClick={() => setShowCouponPopup(true)}
          >
            Apply Coupon
          </button>
        )}

        {showCouponButtons && couponApplied && (
          <button
            className="relative sm:top-[4.8rem] top-0 sm:left-6 sm:w-[10rem] w-[6rem] sm:mb-0 mb-4 bg-red-500 hover:bg-gray-800 text-white py-3 px-4"
            onClick={removeCoupon}
          >
            Remove Coupon
          </button>
        )}
      </div>

      {/* Coupon Code Popup */}
      {showCouponPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-xl mb-4">Enter Coupon Code</h3>
            <input
              type="text"
              className="border p-2 w-full mb-4"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter code here"
            />
            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleApplyCoupon}
              >
                Apply
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCouponPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartTotal;
