import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Order removed successfully');
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        toast.error(data.message || 'Failed to remove order');
      }
    } catch (error) {
      console.error('Error removing order:', error);
      toast.error('Failed to remove order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 backdrop-blur"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold">{order.customerName}</h3>
                <p className="text-gray-400">{order.customerEmail}</p>
                <p className="text-gray-400">{order.customerPhone}</p>
              </div>
              <button
                onClick={() => handleRemoveOrder(order._id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Remove Order"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              <p><strong>VIN:</strong> {order.vinNumber}</p>
              <p><strong>Country:</strong> {order.country}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Amount:</strong> ${order.amount}</p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{item.title}</span>
                      <span>${item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-gray-400">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
