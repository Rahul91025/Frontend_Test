import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../Components/Title";
import ProductItem from "../Components/ProductItem";

const Collection = () => {
  const { products, search, showSearch, flocation, bLocation } =
    useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [productsByMarket, setProductsByMarket] = useState({});

  const groupByMarket = (products) => {
    const grouped = {};
    products.forEach((product) => {
      if (!grouped[product.marketName]) {
        grouped[product.marketName] = [];
      }
      grouped[product.marketName].push(product);
    });
    return grouped;
  };

  const fetchDistance = async () => {
    if (flocation.latitude && bLocation.length > 0) {
      // Ensure both locations are available
      const source = `${flocation.latitude},${flocation.longitude}`;
      const destination = bLocation.map(
        (location) => `${location.latitude},${location.longitude}`
      );

      const apiKey = "AlzaSydEI2v1y6zqA8awWGx1VPI4Ap_DJl2ioVu"; // Replace with your actual API key
      const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${source}&destinations=${destination.join(
        "|"
      )}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
          return data.rows[0].elements.map((element) => ({
            distance: element.distance?.text || "Not Available",
            duration: element.duration?.text || "Not Available",
          }));
        } else {
          console.error("API Error:", data.status);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }
    return [];
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    const groupedProducts = groupByMarket(productsCopy);
    setFilterProducts(productsCopy);
    setProductsByMarket(groupedProducts);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        // Sort by price in ascending order
        fpCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        // Sort by price in descending order
        fpCopy.sort((a, b) => b.price - a.price);
        break;
      case "distance":
        // Sort by distance in ascending order
        fpCopy.sort((a, b) => {
          const distanceA = parseFloat(a.distance) || Infinity; // Handle missing or invalid distances
          const distanceB = parseFloat(b.distance) || Infinity; // Handle missing or invalid distances
          return distanceA - distanceB;
        });
        break;
      default:
        applyFilter(); // Apply filters without sorting
        break;
    }
    const groupedProducts = groupByMarket(fpCopy);
    setFilterProducts(fpCopy);
    setProductsByMarket(groupedProducts);
  };


  
 

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };


   useEffect(() => {
     
     const updateProductWithDistance = async () => {
       const distanceData = await fetchDistance();
       if (distanceData.length > 0) {
         const updatedProducts = filterProducts.map((product, index) => ({
           ...product,
           distance: distanceData[index]?.distance || "",
           duration: distanceData[index]?.duration || "",
         }));
         setFilterProducts(updatedProducts);
       }
     };

     if (filterProducts.length > 0) {
       updateProductWithDistance();
     }
   }, [flocation, bLocation, filterProducts]);
  
  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        <div
          className={`border border-gray-300 pl-5 py-5 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORY</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Men"}
                onChange={toggleCategory}
              />
              Men
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Women"}
                onChange={toggleCategory}
              />
              Women
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Kids"}
                onChange={toggleCategory}
              />
              Kids
            </p>
          </div>
        </div>

        <div
          className={`border border-gray-300 pl-5 py-5 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"TopWear"}
                onChange={toggleSubCategory}
              />
              TopWear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
                onChange={toggleSubCategory}
              />
              Bottomwear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={"Winterwear"}
                onChange={toggleSubCategory}
              />
              Winterwear
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="distance">Sort by: Distance</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Product List */}
        {filterProducts.length === 0 ? (
          <p>Loading products...</p>
        ) : (
          <div className="flex-1">
            {Object.keys(productsByMarket).map((marketName) => (
              <div key={marketName} className="mb-8">
                <h2 className="flex items-center text-xl font-bold mb-4 text-gray-500">
                  <hr className="flex-1 border-t border-gray-300" />
                  <span className="mx-4">{marketName}</span>
                  <hr className="flex-1 border-t border-gray-300" />
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                  {productsByMarket[marketName].map((item, index) => (
                    <ProductItem
                      key={index}
                      id={item._id}
                      image={item.image}
                      name={item.name}
                      price={item.price}
                      distance={item.distance} // Ensure the distance is passed
                      duration={item.duration} // Ensure the duration is passed
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
