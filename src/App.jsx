import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import Select from './components/ui/Select';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const App = () => {
  const [region, setRegion] = useState('UK');
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:4000/alerts/${region}`);
      setAlerts(response.data.alerts);
    } catch (err) {
      setError('Error fetching alerts');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, [region]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Weather Alerts</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <Button onClick={fetchAlerts} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" /> Refresh
          </Button>
        </div>
        {loading ? (
          <p className="text-center text-gray-600">Loading alerts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Alerts ({alerts.length})</h2>
            <ul className="space-y-4">
              {alerts.map((alert, index) => (
                <motion.li 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg shadow"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <AlertCircle className="text-red-500" /> {alert.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{alert.description}</p>
                  <a href={alert.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    More info
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default App;
