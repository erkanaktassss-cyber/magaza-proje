const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/constants');
require('./db/seed');
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.listen(PORT, () => console.log(`FLOWIX API listening on ${PORT}`));
