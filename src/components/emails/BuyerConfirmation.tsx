import { Mail } from 'lucide-react';
import React from 'react';

interface Item {
  title: string;
  price: number;
  description?: string;
}

interface BuyerConfirmationProps {
  orderID: string;
  amount: string;
  customerName: string;
  items: Item[];
}

const BuyerConfirmation: React.FC<BuyerConfirmationProps> = ({ 
  orderID, 
  amount, 
  customerName,
  items
}) => {
  return (
    <div className="max-w-md mx-auto bg-white">
      <div className="bg-black p-4 text-center">
        <h1 className="text-white text-xl font-bold">VehicleInfo</h1>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="text-gray-800">
          <p className="mb-4">Hello {customerName},</p>
          <p className="mb-4">
            Thank you for your purchase! Your vehicle reports will be processed and delivered to you shortly.
            You will receive a separate email with your report download links.
          </p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <span className="font-semibold">Order confirmed!</span>
            <Mail className="h-5 w-5 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Order number: <span className="font-medium text-black">{orderID}</span>
            </p>
            <p className="text-sm text-gray-600">
              Total Amount: <span className="font-medium text-black">${amount}</span>
            </p>
          </div>

          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-3">Order Details</h3>
            {items.map((item, index) => (
              <div key={index} className="mb-3">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                {item.description && (
                  <p className="text-sm text-gray-500">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h2 className="font-semibold mb-3">Need Help?</h2>
          <p className="text-sm text-gray-600">
            If you need any assistance or have questions about your order, please contact us at{" "}
            <a href="mailto:support@vehicleinfo.com" className="text-red-600 hover:text-red-700">
              support@vehicleinfo.com
            </a>
          </p>
        </div>

        <div className="text-sm text-gray-600">
          <p>Best regards,</p>
          <p className="font-medium">The VehicleInfo Team</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerConfirmation;
