const mongoose = require("mongoose");
const config = require("../config.json");

module.exports = mongoose.connect(config.database.uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
        throw err;
    }

    console.log(`Database connected.`);
});