import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [bLocation, setBLocation] = useState([]);
  const [flocation, setFLocation] = useState([]);
  const [couponApplied, setCouponApplied] = useState(false);
  const [notifications, setNotifications] = useState([
    // Example notifications, you can change this as per your data
    { id: 1, message: "New product added!" },
    { id: 2, message: "Order shipped!" },
  ]);
  const getNotificationCount = () => {
    return notifications.length;
  };

  const navigate = useNavigate();


const applyCoupon = () => {
  setCouponApplied(true);
};

const removeCoupon = () => {
  setCouponApplied(false);
};


  // Function to fetch user's current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(`Error getting location: ${error.message}`);
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  const fetchUserLocation = async () => {
    try {
      const userLocation = await getCurrentLocation();
      console.log(userLocation);
      setFLocation(userLocation);
    } catch (err) {
      console.error(err);

    }
  };

  // Function to fetch locations from the backend
  const getLocation = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);

      if (response.data.success) {
        const locations = response.data.products.map((product) => ({
          latitude: product.storeAddress.latitude,
          longitude: product.storeAddress.longitude,
        }));

        setBLocation(locations);
        console.log("Extracted Locations:", locations);
      }
    } catch (error) {
      console.error("Failed to get location", error);
      toast.error("Failed to get location. Please try again later.");
    }
  };

  // Save cartItems to local storage
  const saveCartToLocalStorage = (cartData) => {
    localStorage.setItem("cartItems", JSON.stringify(cartData));
  };

  // Retrieve cartItems from local storage
  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : {};
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product size");
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
    saveCartToLocalStorage(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: {token} }
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to add item to cart. Please try again later.");
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };

   useEffect(() => {
     // console.log(cartItems);
   }, [cartItems]);



  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
    saveCartToLocalStorage(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: {token} }
        );
      } catch (error) {
        console.log(error);
        toast.error("Failed to update cart. Please try again later.");
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);

      for (const size in cartItems[items]) {
        try {
          if (cartItems[items][size] > 0) {
            totalAmount += itemInfo.price * cartItems[items][size];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    }
  };

  const getUserCart = async (token) => {
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: {token} }
      );

      if (response.data.success) {
        setCartItems(response.data.cartData);
        saveCartToLocalStorage(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
     
    }
  };

  useEffect(() => {
    const savedCart = loadCartFromLocalStorage();
    setCartItems(savedCart);
    getProductsData();
    getLocation();
    fetchUserLocation();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, []);

  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems]);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    setCartItems,
    bLocation,
    flocation,
    applyCoupon,
    removeCoupon,
    couponApplied,
    notifications,
    setNotifications,
    getNotificationCount,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
