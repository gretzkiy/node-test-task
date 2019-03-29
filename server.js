const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('./config.js');
const port = config.development.port;

const UserService = require('./modules/UserService');
const userService = new UserService();

const usersListView = require('./views/usersListView.js');
const userEditView = require('./views/userEditView.js');

app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/users', (req, res) => {
    const usersData = userService.getUsers();
    res.send(usersListView.render(usersData));
});

app.get('/users/:id', (req, res) => {
    const userData = userService.getUser(req.params.id);
    if (Object.keys(userData).length === 0) {
        res.status(404).send('<h1>User not found</h1>');
    } else {
        res.send(userEditView.render(userData));
    }
});

// API methods
// Array of users
app.get('/api/v1/users', (req, res) => {
    const usersData = userService.getUsers();
    res.send(usersData);
});

// {id, name, age} | {error}
app.post('/api/v1/users', (req, res) => {
    const newUserData = userService.newUser(req.body);
    if (Object.keys(newUserData).length === 0) {
        res.status(500).send({ error: 'Unable to create new user.' });
    } else {
        res.status(201).send(newUserData);
    }
});

// {id, name, age} | {error}
app.get('/api/v1/users/:id', (req, res) => {
    const userData = userService.getUser(req.params.id);
    if (Object.keys(userData).length === 0) {
        res.status(404).send({ error: 'User not found.' });
    } else {
        res.status(200).send(userService.getUser(req.params.id));
    }
});

// {id, name, age} | {error}
app.put('/api/v1/users/:id', (req, res) => {
    const editedUserData = userService.editUser(req.body);
    if (Object.keys(editedUserData).length === 0)  {
        res.status(500).send({ error: 'Unable to edit user.' });
    } else {
        res.status(200).send(editedUserData);
    }
});

// no content | {error}
app.delete('/api/v1/users/:id', (req, res) => {
    const deletedUserId = userService.deleteUser(req.params.id);
    if (!deletedUserId) {
        res.status(500).send({ error: 'Unable to delete user.' });
    } else {
        res.status(204).send();
    }
});

app.use((req, res) => {
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(port, () => {
    console.log(`Listening http://localhost:${port}`)
});