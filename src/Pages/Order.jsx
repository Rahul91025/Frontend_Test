import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../Components/Title";
import axios from "axios";
import { AiOutlineDelete, AiOutlineClose } from "react-icons/ai"; // Import Close icon
import jsPDF from "jspdf";

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [review, setReview] = useState({});

  // Load orders
  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const allOrdersItem = response.data.orders.flatMap((order) =>
          order.items.map((item) => ({
            ...item,
            status: order.status,
            payment: order.payment,
            paymentMethod: order.paymentMethod,
            data: order.data,
            orderId: order._id, // Storing orderId for cancellation
          }))
        );

        setOrderData(allOrdersItem.reverse());
        localStorage.setItem(
          "orderData",
          JSON.stringify(allOrdersItem.reverse())
        ); // Store data in localStorage
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!orderId) {
      console.error("Invalid orderId:", orderId);
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/order/cancel/${orderId}`,
        { headers: { token } }
      );
      console.log("Order canceled successfully:", response.data);
      setOrderData((prevOrderData) =>
        prevOrderData.filter((item) => item.orderId !== orderId)
      );
      const updatedOrderData = orderData.filter(
        (item) => item.orderId !== orderId
      );
      localStorage.setItem("orderData", JSON.stringify(updatedOrderData)); // Update localStorage after cancellation
    } catch (error) {
      console.error("Error canceling order:", error);
      alert(
        "Error canceling order: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  // Remove item
  const handleRemoveItem = (orderId) => {
    setOrderData((prevOrderData) => {
      const updatedOrderData = prevOrderData.filter(
        (item) => item.orderId !== orderId
      );
      localStorage.setItem("orderData", JSON.stringify(updatedOrderData)); // Update localStorage
      return updatedOrderData;
    });
  };

  // Refund request
  const handleRefundRequest = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/refund/${orderId}`,
        {},
        { headers: { token } }
      );
      console.log("Refund requested:", response.data);
    } catch (error) {
      console.error("Error requesting refund:", error);
      alert("Error requesting refund: " + error.message);
    }
  };

  // Return request
  const handleReturnRequest = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/return/${orderId}`,
        {},
        { headers: { token } }
      );
      console.log("Return requested:", response.data);
    } catch (error) {
      console.error("Error requesting return:", error);
      alert("Error requesting return: " + error.message);
    }
  };

  // Review and feedback submission
  const handleReviewSubmit = async (orderId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/review/${orderId}`,
        { review, feedback },
        { headers: { token } }
      );
      console.log("Review submitted:", response.data);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Error submitting review: " + error.message);
    }
  };

  // Generate invoice PDF
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Invoice", 14, 20);

    let yPosition = 30; // Starting yPosition for the first item

    orderData.forEach((item, index) => {
      doc.setFontSize(12);

      // Print item details and increment yPosition after each line of text
      doc.text(`${item.name} - ${item.size}`, 14, yPosition);
      yPosition += 6; // Adjust vertical spacing between lines

      doc.text(`Quantity: ${item.quantity}`, 14, yPosition);
      yPosition += 6;

      doc.text(`Price: ${currency}${item.price}`, 14, yPosition);
      yPosition += 6;

      doc.text(`Status: ${item.status}`, 14, yPosition);
      yPosition += 6;

      doc.text(`Date: ${new Date(item.date).toDateString()}`, 14, yPosition);
      yPosition += 6;

      doc.text(`Payment Method: ${item.paymentMethod}`, 14, yPosition);
      yPosition += 10; // Extra spacing between items

      // Check if we have reached the bottom of the page, then add a new page
      if (yPosition > 270) {
        doc.addPage(); // Add new page if yPosition exceeds page limit
        yPosition = 20; // Reset yPosition for the new page
      }
    });

    doc.save("invoice.pdf");
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div>
        {orderData.length > 0 ? (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                {item.image && item.image.length > 0 ? (
                  <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                ) : (
                  <p>No Image Available</p>
                )}
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <div className="md:w-1/2 flex flex-wrap justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>
                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm"
                >
                  Track Order
                </button>

                <button
                  onClick={() => handleCancelOrder(item.orderId)}
                  className="border px-4 py-2 text-sm font-medium rounded-sm flex items-center gap-2 text-red-500"
                >
                  <AiOutlineDelete size={20} /> Cancel
                </button>

                <button
                  onClick={() => handleRefundRequest(item.orderId)}
                  className="border px-4 py-2 text-sm font-medium rounded-sm text-blue-500"
                >
                  Request Refund
                </button>

                <button
                  onClick={() => handleReturnRequest(item.orderId)}
                  className="border px-4 py-2 text-sm font-medium rounded-sm text-orange-500"
                >
                  Request Return
                </button>

                <button
                  onClick={() => handleDownloadInvoice()}
                  className="border px-4 py-2 text-sm font-medium rounded-sm text-gray-700"
                >
                  Download Invoice
                </button>
              </div>
              <div
                onClick={() => handleRemoveItem(item.orderId)}
                className="cursor-pointer"
              >
                <AiOutlineClose />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Order;
