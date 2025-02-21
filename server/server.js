// server/server.js
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Enable CORS to bypass restrictions
app.use(cors());

// RSS URLs for different regions
const rssUrls = {
    UK: "https://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/UK",
    Ireland: "https://www.metoffice.gov.uk/public/data/PWSCache/WarningsRSS/Region/Ireland",
    LA: "https://lafd.org/alerts-rss.xml"
};

const fetchRSS = async (url) => {
    try {
        const response = await axios.get(url);
        const xml = response.data;
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);
        return result.rss.channel.item ? (Array.isArray(result.rss.channel.item) ? result.rss.channel.item : [result.rss.channel.item]) : [];
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return [];
    }
};

app.get('/alerts/:region', async (req, res) => {
    const region = req.params.region.toUpperCase();
    const rssUrl = rssUrls[region];
    if (!rssUrl) {
        return res.status(400).json({ error: 'Invalid region' });
    }
    console.log(`Fetching alerts for ${region}`);
    const alerts = await fetchRSS(rssUrl);
    res.json({
        status: alerts.length > 0 ? "success" : "no alerts",
        count: alerts.length,
        alerts: alerts.map(alert => ({
            title: alert.title,
            description: alert.description,
            link: alert.link,
            published: alert.pubDate
        }))
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
