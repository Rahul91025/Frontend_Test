import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, distance, duration }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      className="block bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
      to={`/product/${id}`}
    >
      <div className="relative">
        <img
          className="w-full h-56 object-cover object-center rounded-t-lg transition-transform duration-300 transform hover:scale-105"
          src={image[0]}
          alt={name}
        />
      </div>

      <div className="p-4">
        <p className="text-lg font-semibold text-gray-800 truncate">{name}</p>
        <p className="text-base font-medium text-gray-600 mt-1">
          {currency}
          {price}
        </p>

        {/* Distance and Duration */}
        <div className="mt-3 text-sm text-red-500">
          {distance && distance !== "Not Available" ? `${distance} away` : ""}
          <br />
          {duration}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
