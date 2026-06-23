const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve all static files (index.html, css/, js/)
app.use(express.static(path.join(__dirname)));

// Serve translation files
app.use('/locales', express.static(path.join(__dirname, 'locales')));

// Future backend routes go here
// app.use('/api', require('./routes/api'));

// Fallback → index.html
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Delta Schools Mix running at http://localhost:${PORT}`);
});