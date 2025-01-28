import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../Components/CartTotal";
import { FaShareAlt } from "react-icons/fa"; // Import share icon from react-icons

const Cart = () => {
  const {
    products = [],
    currency,
    cartItems,
    updateQuantity,
    navigate,
    totalAmount,
    setTotalAmount,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      const tempData = [];
      let calculatedTotal = 0;

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const product = products.find((prod) => prod._id === items);
            if (product) {
              const quantity = cartItems[items][item];
              calculatedTotal += product.price * quantity; // Calculate total price
              tempData.push({
                _id: items,
                size: item,
                quantity,
              });
            }
          }
        }
      }

      setCartData(tempData);
      if (typeof setTotalAmount === "function") {
        setTotalAmount(calculatedTotal); // Update the total amount
      }
    }
  }, [cartItems, products, setTotalAmount]);

  // Function to handle sharing via WhatsApp
  const shareOnWhatsApp = (productName, productPrice) => {
    const message = `Check out this product: ${productName} for ${currency}${productPrice}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Function to handle sharing via Instagram (for now, Instagram doesn't support direct URL sharing, but you can share via posts)
  const shareOnInstagram = (productName, productPrice) => {
    const message = `Check out this product: ${productName} for ${currency}${productPrice}`;
    const instagramUrl = `https://www.instagram.com/?url=${encodeURIComponent(
      message
    )}`;
    window.open(instagramUrl, "_blank");
  };

  return (
    <div className="border-t pt-14">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div className="">
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          // Check if productData exists before rendering
          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  src={productData.image[0]}
                  alt={productData.name}
                  className="w-16 sm:w-20"
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium ">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p>
                      {currency}
                      {productData.price}
                    </p>
                    <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                      {item.size}
                    </p>
                  </div>
                </div>
              </div>

              <input
                onChange={(e) =>
                  e.target.value === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="Delete"
              />

              {/* Share Icon */}
              <div className="ml-4 cursor-pointer" title="Share this item">
                <FaShareAlt
                  onClick={() =>
                    shareOnWhatsApp(productData.name, productData.price)
                  }
                  className="text-xl text-gray-700"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end flex justify-end gap-4">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white text-sm my-8 px-8 py-3"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
