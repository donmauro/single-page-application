require('dotenv').config(); // read .env files 

const express = require('express'); 
const app = express(); 
const port = process.env.PORT || 3000;

const { getRates, getSymbols, } = require('./lib/fixer-service');
const { convertCurrency } = require('./lib/free-currency-service');

// Set public folder as root
app.use(express.static('public'));

// Allow front-end access to node_modules folder 
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

// Express Error handler 
const errorHandler = (err, req, res) => { 
    if (err.response) { 
        // The request was made and the server responded with a status code 
        // that falls out of the range of 2xx 
        res.status(403).send({ 
            title: 'Server responded with an error', 
            message: err.message 
        });
    } else if (err.request) { 
        // The request was made but no response was received 
        res.status(503).send({ 
            title: 'Unable to communicate with server', 
            message: err.message }); 
    } else { 
        // Something happened in setting up the request that triggered an Error 
        res.status(500).send({ 
            title: 'An unexpected error occurred', 
            message: err.message 
        }); 
    } 
};

// Fetch Latest Currency Rates 
app.get('/api/rates', async (req, res) => { 
    try { 
        const data = await getRates(); 
        res.type('json'); 
        res.send(data); 
    } 
    catch (error) { 
        errorHandler(error, req, res); 
    } 
});

// Fecth symbols
app.get('/api/symbols', async (req, res) => {
    try { 
        const data = await getSymbols();
        res.type('json');
        res.send(data);
    } catch (error) {
        errorHandler(error,req, res);
    }
});

// Convert Currency 
app.post('/api/convert', async (req, res) => { 
    try { 
        const { from, to } = req.body; 
        const data = await convertCurrency(from, to); 
        res.typer('json'); 
        res.send(data); 
    } 
    catch (error) { 
        errorHandler(error, req, res); 
    } 
});

// Redirect all traffic to index.html 
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// Listen for HTTP requests on port 3000 
app.listen(port, () => { console.log('listening on %d', port); });

// Test Symbols Endpoint 
// const test = async() => {
//     console.log('TEST')
//     const data = await getSymbols(); 
//     console.log(data); }
// test();