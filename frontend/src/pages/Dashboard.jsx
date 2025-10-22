import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22C55E', '#06B6D4', '#FACC15', '#EF4444'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ sleep: '', appetite: '', stress: '', activity: '' });
  const [message, setMessage] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [avgData, setAvgData] = useState(null);
  const [user, setUser] = useState({ firstName: '' });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
    fetchHistory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = Number(value);
    val = name === 'sleep' ? Math.min(Math.max(val, 0), 24) : Math.min(Math.max(val, 0), 5);
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/health', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Health data submitted successfully!');
      setLastResult(res.data.data);
      setFormData({ sleep: '', appetite: '', stress: '', activity: '' });
      fetchHistory();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/health/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const hist = res.data.data;
      setHistory(hist);
      if (hist.length > 0) setLastResult(hist[0]);

      const total = hist.reduce(
        (acc, entry) => ({
          sleep: acc.sleep + entry.sleep,
          appetite: acc.appetite + entry.appetite,
          stress: acc.stress + entry.stress,
          activity: acc.activity + entry.activity,
        }),
        { sleep: 0, appetite: 0, stress: 0, activity: 0 }
      );

      const count = hist.length;
      setAvgData({
        sleep: (total.sleep / count).toFixed(2),
        appetite: (total.appetite / count).toFixed(2),
        stress: (total.stress / count).toFixed(2),
        activity: (total.activity / count).toFixed(2),
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white p-6 flex flex-col items-center text-gray-800">
      
      {/* Header */}
      <header className="w-full max-w-6xl bg-white border border-teal-100 shadow-md rounded-lg p-5 mb-8 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-700 mb-3 md:mb-0">
          🏥 {user.firstName ? `Hello, ${user.firstName}` : 'Welcome to Dr.ViKi Health Platform'}
        </h1>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/history')}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md shadow"
          >
            View History
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        
        {/* Health Data Form */}
        <div className="bg-white border border-teal-100 shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-teal-600 border-b pb-2">Health Check Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['sleep', 'appetite', 'stress', 'activity'].map((field) => (
              <div key={field}>
                <label className="block font-medium text-gray-600 mb-1 capitalize">{field}</label>
                <input
                  type="number"
                  name={field}
                  placeholder={field === 'sleep' ? '0-24 hours' : '0-5 scale'}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 mt-3 rounded-md shadow-md transition-colors duration-200"
            >
              Submit Data
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 p-3 rounded-md text-center font-medium ${
                message.toLowerCase().includes('success')
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* Latest Health Report */}
        {lastResult && (
          <div className="bg-white border border-teal-100 shadow-lg rounded-lg p-6 flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-teal-600 mb-2">Latest Report</h3>
            <p className="text-gray-700 mb-1 font-medium">{lastResult.result}</p>
            <p className="text-gray-500 mb-2">{lastResult.recommendation}</p>
            <p className="text-gray-500 text-sm mb-3">
              Date: {new Date(lastResult.createdAt).toLocaleString()}
            </p>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Sleep', value: lastResult.sleep },
                      { name: 'Appetite', value: lastResult.appetite },
                      { name: 'Stress', value: lastResult.stress },
                      { name: 'Activity', value: lastResult.activity },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={index} fill={color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Average Stats */}
      {avgData && (
        <div className="w-full max-w-6xl mt-8 bg-white border border-teal-100 shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-teal-600 mb-2">Average Health Stats</h3>
          <ul className="text-gray-700 space-y-1 mb-4">
            <li>Sleep: {avgData.sleep} hrs</li>
            <li>Appetite: {avgData.appetite}</li>
            <li>Stress: {avgData.stress}</li>
            <li>Activity: {avgData.activity}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
