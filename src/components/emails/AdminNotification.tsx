import { Mail, AlertCircle } from 'lucide-react';
import React from 'react';

interface Item {
  title: string;
  price: number;
}

interface AdminNotificationProps {
  orderID: string;
  amount: string;
  customerName: string;
  customerPhone: string;
  vinNumber: string;
  items: Item[];
}

const AdminNotification: React.FC<AdminNotificationProps> = ({ 
  orderID, 
  amount, 
  customerName,
  customerPhone,
  vinNumber,
  items
}) => {
  return (
    <div className="max-w-md mx-auto bg-white">
      <div className="bg-black p-4 text-center">
        <h1 className="text-white text-xl font-bold">VehicleInfo - New Order</h1>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">New Order Received</span>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Order Details</h2>
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-medium text-black">{orderID}</span>
            </p>
            <p className="text-sm text-gray-600">
              Amount: <span className="font-medium text-black">${amount}</span>
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-600">Name:</span>{" "}
                <span className="font-medium">{customerName}</span>
              </p>
              <p>
                <span className="text-gray-600">Phone:</span>{" "}
                <span className="font-medium">{customerPhone}</span>
              </p>
              <p>
                <span className="text-gray-600">VIN Number:</span>{" "}
                <span className="font-medium">{vinNumber}</span>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-3">Ordered Items</h3>
            {items.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <span className="text-sm">{item.title}</span>
                <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <h2 className="font-semibold mb-2 text-red-700">Action Required</h2>
          <p className="text-sm text-red-600">
            Please process this order and prepare the vehicle reports for delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
