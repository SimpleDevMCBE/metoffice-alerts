import React, { useState, useEffect } from 'react';

const AlertNotifier = ({ region = 'UK' }) => {
  const [alertData, setAlertData] = useState(null);

  const fetchAlerts = async () => {
    try {
      // Update the URL if your server address or port is different
      const response = await fetch(`http://localhost:4000/alerts/${region}`);
      const data = await response.json();
      setAlertData(data);

      // Check if there are alerts available
      if (data.count > 0) {
        // Create and play the audio
        const audio = new Audio('/alert.mp3'); // Ensure alert.mp3 exists in your public folder
        audio.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  useEffect(() => {
    // Fetch alerts immediately when the component mounts
    fetchAlerts();

    // Set up an interval to fetch alerts every 60 seconds
    const intervalId = setInterval(fetchAlerts, 60000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [region]); // Re-run effect if the region prop changes

  return (
    <div>
      <h1>Alerts for {region}</h1>
      {alertData ? (
        <div>
          <p>Status: {alertData.status}</p>
          <p>Alert Count: {alertData.count}</p>
          {alertData.alerts.map((alert, index) => (
            <div key={index} style={{ marginBottom: '1em' }}>
              <h3>{alert.title}</h3>
              <p>{alert.description}</p>
              <a href={alert.link} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
              <p><em>Published: {alert.published}</em></p>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading alerts...</p>
      )}
    </div>
  );
};

export default AlertNotifier;
