module.exports = {
  PORT: process.env.PORT || 4010,
  DB_PATH: process.env.DB_PATH || require('path').join(__dirname, '../../../data/flowix.db')
};
