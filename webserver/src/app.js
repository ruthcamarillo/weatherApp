const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('../utils/geocode');
const forecast = require('./utils/forecast')

const app = express();

// Define paths for express configuration
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
//setting up path for partials
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine so that we can use it and views location so our app knows where to grab the infomation aka dynamic pages
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// Setup static directory to server (listening on 3000)
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Rooot Camarillo'
    })
})
//render allows us to render our views, use this instead of send!
//we can render our template with handlebar here (file that contains a mix of plain text and dynamic data, and using that template to generate a final output )

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Rooot Camarillo'

    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helptxt: 'This is some helpful text.',
        title: 'Help',
        name: 'Rooot'

    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }


    console.log(req.query.search)
    res.send({
        products: []
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Rooot Camarillo',
        errorMessage: 'Help article not found'
    })
})



//what * is, is match anything that hasent been matched so far, this has to go at the end
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Rooot Camarillo',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => console.log('Server Listeing on 3000')
)