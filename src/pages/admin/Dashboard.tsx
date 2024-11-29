import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, ShoppingCart, Settings, LogOut, Clock, CheckCircle, DollarSign } from 'lucide-react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { ENDPOINTS, getAuthHeaders, handleAPIResponse, OrdersResponse, SettingsResponse } from '../../config/api';

// Types
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
  paypal: {
    enabled: boolean;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Settings>({
    prices: {
      basicReport: 0,
      fullReport: 0,
      premiumReport: 0,
      motorcycleReport: 0,
      truckReport: 0
    },
    email: {
      adminEmail: '',
      emailSignature: '',
      notificationEnabled: false
    },
    paypal: {
      enabled: false
    }
  });

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const ordersList = orders?.data?.orders || [];
  const recentOrders = ordersList.slice(0, 5);

  const stats = [
    {
      title: 'Total Orders',
      value: ordersList.length,
      icon: ShoppingCart,
      color: 'text-red-500',
    },
    {
      title: 'Pending Orders',
      value: ordersList.filter((order) => order.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Completed Orders',
      value: ordersList.filter((order) => order.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Total Revenue',
      value: `$${ordersList.reduce((acc, order) => acc + (order?.amount || 0), 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-blue-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500';
      case 'completed':
        return 'text-green-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-zinc-500';
    }
  };

  // Get token from localStorage
  const token = localStorage.getItem('adminToken');

  const fetchOrders = useCallback(async () => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    try {
      setOrdersLoading(true);
      setError(null);
      
      const response = await fetch(
        `${ENDPOINTS.ORDERS}?page=${currentPage}&status=${statusFilter}&search=${searchTerm}`,
        { headers: getAuthHeaders(token) }
      );

      const data = await handleAPIResponse<OrdersResponse>(response);
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setOrdersLoading(false);
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm, token, navigate]);

  const fetchSettings = useCallback(async () => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      setSettingsLoading(true);
      setError(null);
      
      const [pricesRes, emailRes, paypalRes] = await Promise.all([
        fetch(ENDPOINTS.PRICES, { headers: getAuthHeaders(token) }),
        fetch(ENDPOINTS.EMAIL, { headers: getAuthHeaders(token) }),
        fetch(ENDPOINTS.PAYPAL, { headers: getAuthHeaders(token) })
      ]);

      const [pricesData, emailData, paypalData] = await Promise.all([
        handleAPIResponse<SettingsResponse>(pricesRes),
        handleAPIResponse<SettingsResponse>(emailRes),
        handleAPIResponse<SettingsResponse>(paypalRes)
      ]);

      setSettings({
        prices: pricesData.prices,
        email: emailData.email,
        paypal: paypalData.paypal ?? { enabled: false } // Provide a default if undefined
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch settings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSettingsLoading(false);
      setLoading(false);
    }
  }, [token, navigate]);

  const updateOrderStatus = useCallback(async (orderId: string, newStatus: string) => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.UPDATE_ORDER(orderId), {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status: newStatus })
      });

      await handleAPIResponse(response);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order status';
      toast.error(errorMessage);
    }
  }, [token, navigate, fetchOrders]);

  const handlePriceUpdate = async (newPrices: any) => {
    try {
      const response = await fetch('/api/admin/settings/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prices: newPrices })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update prices');
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Prices updated successfully');
        // Update local settings state
        setSettings(prev => ({
          ...prev,
          prices: data.prices
        }));
      } else {
        toast.error(data.message || 'Failed to update prices');
      }
    } catch (error) {
      console.error('Error updating prices:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update prices');
    }
  };

  const handlePriceChange = (reportType: string, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) return;

    const updatedPrices = {
      ...settings.prices,
      [reportType]: numericValue
    };

    // Update local state immediately for better UX
    setSettings(prev => ({
      ...prev,
      prices: updatedPrices
    }));

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      handlePriceUpdate(updatedPrices);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const updateEmailSettings = useCallback(async (formData: FormData) => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.EMAIL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          adminEmail: formData.get('adminEmail'),
          emailSignature: formData.get('emailSignature'),
          notificationEnabled: formData.get('notificationEnabled') === 'true'
        })
      });

      await handleAPIResponse(response);
      toast.success('Email settings updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update email settings';
      toast.error(errorMessage);
    }
  }, [token, navigate]);

  const updatePaypalSettings = useCallback(async (enabled: boolean) => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.PAYPAL, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ enabled })
      });

      await handleAPIResponse(response);
      toast.success('PayPal settings updated successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update PayPal settings';
      toast.error(errorMessage);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchOrders();
    fetchSettings();
  }, [token, navigate, fetchOrders, fetchSettings]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
        </div>
      ) : (
        <div>
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
                            recentOrders.map((order) => (
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
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h2 className="text-2xl font-bold">Orders</h2>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                          <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-500 w-full md:w-64"
                          />
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-red-500"
                          >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid gap-6 mb-32 md:mb-0">
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <div className="h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : ordersList.length === 0 ? (
                          <div className="text-center py-8 text-zinc-400">
                            No orders found
                          </div>
                        ) : (
                          ordersList.map((order) => (
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
                                    <p className="text-zinc-300">
                                      <span className="font-semibold">VIN: </span>
                                      {order.vinNumber}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-zinc-400">
                                      Status:
                                    </span>
                                    <select
                                      value={order.status}
                                      onChange={(e) =>
                                        updateOrderStatus(order.id, e.target.value)
                                      }
                                      className={`text-sm px-2 py-1 rounded bg-zinc-900 border border-zinc-700 ${getStatusColor(
                                        order.status
                                      )}`}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="completed">Completed</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
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
                          ))
                        )}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <span className="px-4 py-2">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      )}
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
                      </div>

                      <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6">
                        <h3 className="text-xl font-bold mb-4">Email Settings</h3>
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const formData = new FormData(form);

                            updateEmailSettings(formData);
                          }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">
                              Admin Email
                            </label>
                            <input
                              type="email"
                              name="adminEmail"
                              defaultValue={settings?.email?.adminEmail || ''}
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
                              defaultValue={settings?.email?.emailSignature || ''}
                              rows={3}
                              className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white"
                              required
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="notificationEnabled"
                              defaultChecked={settings?.email?.notificationEnabled ?? true}
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

                      <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700/50 rounded-xl p-6 mt-6">
                        <h3 className="text-xl font-bold mb-4">Payment Settings</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-zinc-300">PayPal Integration</h4>
                            <p className="text-sm text-zinc-400">Enable or disable PayPal payments for testing</p>
                          </div>
                          <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={settings?.paypal?.enabled ?? true}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    paypal: {
                                      ...prev.paypal,
                                      enabled: e.target.checked,
                                    },
                                  }));
                                  updatePaypalSettings(e.target.checked);
                                }}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="p-4 bg-zinc-900/50 rounded-lg">
                            <p className="text-sm text-zinc-400">
                              {settings?.paypal?.enabled 
                                ? "PayPal payments are enabled. Customers will be required to pay via PayPal."
                                : "PayPal payments are disabled. Orders can be placed without payment (testing mode)."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
