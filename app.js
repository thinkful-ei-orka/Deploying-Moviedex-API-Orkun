require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const validateBearerToken = require('./validateBearerToken')
const { NODE_ENV } = require('./config');

const app = express();
const movieData = require('./movieData');

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common' 


app.use(cors());
app.use(helmet());
app.use(morgan(morganOption));
app.use(validateBearerToken)

app.get('/movie', (req, res) => {
    const { genre, country, avg_vote } = req.query;
    let responseArray = movieData;
    if (genre) {
        responseArray = responseArray.filter(movie => {
            return movie.genre.toLowerCase().includes(genre.toLowerCase())
        });
    }
    if (country) {
        responseArray = responseArray.filter(movie => {
            return movie.country.toLowerCase().includes(country.toLowerCase())
        });
    }
    if (avg_vote) {
        responseArray = responseArray.filter(movie => {
            return parseFloat(movie.avg_vote) >= parseFloat(avg_vote)
        });
    }
    res.json(responseArray);
});

function errorHandler(error, req, res, next) {
    if (NODE_ENV === 'production') {
        response = { message: 'Internal server error occured.' }
    } else {
        console.log(error);
        response = { error, message: error.message }
    }

    res.status(500).json(response);
}

app.use(errorHandler);

module.exports = app; 



