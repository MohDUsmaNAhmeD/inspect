import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
  LogOut,
  Package,
  DollarSign,
  Users,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  vinNumber: string;
  amount: number;
  items: Array<{
    title: string;
    price: number;
  }>;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface Settings {
  prices: {
    basicReport: number;
    fullReport: number;
    premiumReport: number;
    motorcycleReport: number;
    truckReport: number;
  };
  email: {
    adminEmail: string;
    emailSignature: string;
    notificationEnabled: boolean;
  };
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Settings>({
    prices: {
      basicReport: 29.99,
      fullReport: 49.99,
      premiumReport: 79.99,
      motorcycleReport: 34.99,
      truckReport: 44.99
    },
    email: {
      adminEmail: 'gvehiclesinfo@gmail.com',
      emailSignature: 'Best regards,\nThe VehicleInfo Team',
      notificationEnabled: true
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchSettings = async () => {
      try {
        const [pricesRes, emailRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/settings/prices', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('http://localhost:5000/api/admin/settings/email', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!pricesRes.ok || !emailRes.ok) {
          throw new Error('Failed to fetch settings');
        }

        const [pricesData, emailData] = await Promise.all([
          pricesRes.json(),
          emailRes.json()
        ]);

        if (pricesData.success && emailData.success) {
          setSettings({
            prices: pricesData.prices,
            email: emailData.settings
          });
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchOrders();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  const stats = [
    {
      title: 'Total Orders',
      value: orders.length,
      icon: Package,
      color: 'text-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `$${orders.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Active Customers',
      value: new Set(orders.map(order => order.customerPhone)).size,
      icon: Users,
      color: 'text-purple-500',
    },
    {
      title: 'Pending Orders',
      value: orders.filter(order => order.status === 'pending').length,
      icon: AlertCircle,
      color: 'text-yellow-500',
    },
  ];

  const handlePriceChange = (field: keyof Settings['prices'], value: string) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      prices: {
        ...prevSettings.prices,
        [field]: parseFloat(value)
      }
    }));
  };

  const handleSavePrices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/settings/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(settings.prices)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Prices updated successfully');
      } else {
        toast.error(data.message || 'Failed to update prices');
      }
    } catch (error) {
      toast.error('Failed to update prices');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 p-4">
        <div className="flex justify-around">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center ${
              activeTab === 'overview' ? 'text-red-500' : 'text-zinc-400'
            }`}
          >
            <LayoutDashboard size={24} />
            <span className="text-xs mt-1">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex flex-col items-center ${
              activeTab === 'orders' ? 'text-red-500' : 'text-zinc-400'
            }`}
          >
            <ShoppingCart size={24} />
            <span className="text-xs mt-1">Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center ${
              activeTab === 'settings' ? 'text-red-500' : 'text-zinc-400'
            }`}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {[
                { name: 'Overview', icon: LayoutDashboard, id: 'overview' },
                { name: 'Orders', icon: ShoppingCart, id: 'orders' },
                { name: 'Settings', icon: Settings, id: 'settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                    ${activeTab === item.id 
                      ? 'bg-red-900/20 text-red-500' 
                      : 'text-zinc-400 hover:bg-zinc-700/50 hover:text-white'}`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-zinc-700 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center text-zinc-400 hover:text-white"
            >
              <LogOut className="mr-2" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-zinc-400">{stat.title}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          </div>
                          <stat.icon className={`h-8 w-8 ${stat.color}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        orders.slice(0, 5).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{order.customerName}</p>
                              <p className="text-sm text-zinc-400">Order #{order.id}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${order.amount}</p>
                              <p className={`text-sm ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Orders</h2>
                  <div className="grid gap-6 mb-32 md:mb-0">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              Order #{order.id}
                            </h3>
                            <p className="text-zinc-400 text-sm">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                            <div className="mt-2">
                              <p className="text-zinc-300">
                                <span className="font-semibold">Customer: </span>
                                {order.customerName}
                              </p>
                              <p className="text-zinc-300">
                                <span className="font-semibold">Phone: </span>
                                {order.customerPhone}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-zinc-400">
                                Status:
                              </span>
                              <span className={`text-sm ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-right">
                              Total: ${order.amount}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-zinc-400 mb-2">
                            Order Items:
                          </h4>
                          <ul className="space-y-1 text-sm">
                            {order.items.map((item, index) => (
                              <li
                                key={index}
                                className="flex justify-between text-zinc-300"
                              >
                                <span>{item.title}</span>
                                <span>${item.price}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Settings</h2>
                  
                  <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Price Settings</h3>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Basic Car Report Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.prices.basicReport}
                          onChange={(e) => handlePriceChange('basicReport', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Standard Car Report Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.prices.fullReport}
                          onChange={(e) => handlePriceChange('fullReport', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Premium Car Report Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.prices.premiumReport}
                          onChange={(e) => handlePriceChange('premiumReport', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Motorcycle Report Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.prices.motorcycleReport}
                          onChange={(e) => handlePriceChange('motorcycleReport', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">
                          Truck Report Price
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={settings.prices.truckReport}
                          onChange={(e) => handlePriceChange('truckReport', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleSavePrices}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
                      >
                        Save Price Settings
                      </button>
                    </div>
                  </div>

                  <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Email Settings</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const formData = new FormData(form);
                      
                      try {
                        const response = await fetch('http://localhost:5000/api/admin/settings/email', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                          },
                          body: JSON.stringify({
                            adminEmail: formData.get('adminEmail'),
                            emailSignature: formData.get('emailSignature'),
                            notificationEnabled: formData.get('notificationEnabled') === 'true'
                          })
                        });

                        const data = await response.json();
                        if (data.success) {
                          toast.success('Email settings updated successfully');
                        } else {
                          toast.error(data.message || 'Failed to update email settings');
                        }
                      } catch (error) {
                        toast.error('Failed to update email settings');
                      }
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                          Admin Email
                        </label>
                        <input
                          type="email"
                          name="adminEmail"
                          defaultValue={settings.email.adminEmail}
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">
                          Email Signature
                        </label>
                        <textarea
                          name="emailSignature"
                          defaultValue={settings.email.emailSignature}
                          rows={3}
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="notificationEnabled"
                          defaultChecked={settings.email.notificationEnabled}
                          className="w-4 h-4 bg-zinc-900/50 border border-zinc-700 rounded"
                        />
                        <label className="text-sm font-medium text-zinc-300">
                          Enable Email Notifications
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 
                          text-white px-6 py-2 rounded-lg transition-all duration-300"
                      >
                        Update Email Settings
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
