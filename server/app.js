const express = require('express');
const app = express();

const shopRoutes = require('./src/routes/shop.routes');
const adminRoutes = require('./src/routes/admin.routes');

// This will parse incoming JSON
app.use(express.json());

// Routers
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);

module.exports = app;
