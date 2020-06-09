const mongoose = require('mongoose')
const config = require('../config/database')
mongoose.connect(config.url, config.options)
