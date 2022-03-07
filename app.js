const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created',
                authData
            });
        }
    })
});


app.post('/api/login', (req, res) => {
    // mock user
    const user = {
        id: 1,
        username: 'john',
        email: 'ram@gmail.com'
    }
    jwt.sign({
        user
    }, 'secretkey', {
        expiresIn: '30s'
    }, (err, token) => {
        res.json({
            token

        });
    })
})

// verify token
function verifyToken(req, res, next) {
    // get auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split at the space
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        // set the token
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        // forbidden
        res.sendStatus(403);
    }
}


app.listen(5000, () => console.log('Server started on port 5000'));