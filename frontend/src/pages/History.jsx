import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22C55E', '#06B6D4', '#FACC15', '#EF4444'];

const History = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/health/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(); // e.g. "10/22/2025, 5:30 PM"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-white p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 bg-white border border-teal-100 shadow-md rounded-lg p-5">
        <h1 className="text-3xl font-bold text-teal-700 mb-3 md:mb-0">
          🩺 Patient Health Records
        </h1>
        <p className="text-gray-500 text-sm">Review your historical health assessments</p>
      </header>

      {/* History Section */}
      {history.length === 0 ? (
        <p className="text-center mt-20 text-gray-600 text-lg">No health history found.</p>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((entry) => (
            <div
              key={entry._id}
              className="bg-white border border-teal-100 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-teal-700">
                    {entry.result}
                  </h3>
                  <span className="text-sm text-gray-500">{formatDate(entry.createdAt)}</span>
                </div>

                <p className="text-gray-700 mb-3">
                  {entry.recommendation || 'No specific recommendations provided.'}
                </p>

                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Sleep', value: entry.sleep },
                          { name: 'Appetite', value: entry.appetite },
                          { name: 'Stress', value: entry.stress },
                          { name: 'Activity', value: entry.activity },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {COLORS.map((color, idx) => (
                          <Cell key={idx} fill={color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="border-t pt-3 mt-4 text-sm text-gray-600 flex justify-between">
                <span>Sleep: {entry.sleep}</span>
                <span>Appetite: {entry.appetite}</span>
                <span>Stress: {entry.stress}</span>
                <span>Activity: {entry.activity}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
