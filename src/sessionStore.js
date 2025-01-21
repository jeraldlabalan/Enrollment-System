// sessionStore.js
require('dotenv').config(); // Load environment variables from .env file
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { Sequelize } = require('sequelize');
const path = require("path");
const fs = require("fs");

const caPath = path.resolve(__dirname, '../certs/isgrootx1.pem');
console.log("Resolved CA Path:", caPath);
// Initialize Sequelize
console.log({
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
});
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: console.log, // Enable Sequelize logging for debugging
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync(caPath) // Path to the SSL certificate
      }
    }
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Initialize session store
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions', // Optional, defaults to 'Sessions'
  checkExpirationInterval: 15 * 60 * 1000, // Clear expired sessions every 15 minutes
  expiration: 7 * 24 * 60 * 60 * 1000, // Session expiration time (7 days)
});

// Sync the session store to create the table
sessionStore.sync().then(() => {
  console.log('Session table synced successfully.');
}).catch((error) => {
  console.error('Error syncing session table:', error);
});

module.exports = sessionStore;
