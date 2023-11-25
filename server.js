const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { getProducts, addProduct, deleteProduct } = require('./productManager');
const exphbs  = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index', { products: getProducts() });
});

app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: getProducts() });
});

io.on('connection', (socket) => {
    socket.on('new-product', (product) => {
        addProduct(product);
        io.emit('products', getProducts());
    });

    socket.on('delete-product', (id) => {
        deleteProduct(id);
        io.emit('products', getProducts());
    });
});

http.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
