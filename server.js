//REST API demo in Node.js
const express = require('express'); // require the express framework
const app = express();
const fs = require('fs'); // require file system object

// Enable JSON body parsing middleware
app.use(express.json());

// Endpoint to Get a list of users
app.get('/users', function (req, res) {
    fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
        if (err) {
            res.status(500).json({error: 'Error reading file'});
            return;
        }
        try {
            const users = JSON.parse(data);
            res.json(users);
        } catch (e) {
            res.status(500).json({error: 'Error parsing JSON data'});
        }
    });
});

// Endpoint to get a single user by id
app.get('/users/:id', function (req, res) {
    fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
        if (err) {
            res.status(500).json({error: 'Error reading file'});
            return;
        }
        
        try {
            const users = JSON.parse(data);
            const userKey = "user" + req.params.id;
            const user = users[userKey];
            
            if (!user) {
                res.status(404).json({error: 'User not found'});
                return;
            }
            
            res.json(user); // using res.json() will correctly set Content-Type header
        } catch (e) {
            res.status(500).json({error: 'Error parsing JSON data'});
        }
    });
});

// Endpoint to create a new user
app.post('/users', function (req, res) {
    // Read existing users
    fs.readFile(__dirname + "/users.json", 'utf8', function (err, data) {
        if (err) {
            res.status(500).json({error: 'Error reading file'});
            return;
        }

        try {
            const users = JSON.parse(data);
            const newUser = req.body;
            const newUserId = "user" + (Object.keys(users).length + 1);
            newUser.id = Object.keys(users).length + 1; // Set the user ID

            users[newUserId] = newUser;
            fs.writeFile(__dirname + "/users.json", JSON.stringify(users, null, 2), 'utf8', function (err) {
                if (err) {
                    res.status(500).json({error: 'Error writing to file'});
                    return;
                }
                res.status(201).json(newUser); // Return the new user data with a 201 Created status code
            });
        } catch (e) {
            res.status(500).json({error: 'Error parsing JSON data'});
        }
    });
});

// Create a server to listen at port 8080
const server = app.listen(8080, function () {
    const host = server.address().address === "::" ? "localhost" : server.address().address;
    const port = server.address().port;
    console.log("REST API demo app listening at http://%s:%s", host, port);
});
