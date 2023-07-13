let dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/user', async (req, res) => {
    const { password, email } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    console.log(hashPassword, 'hashpassword');
    res.status(201).send({ email });
});

app.listen(3000, function() {
    console.log('working');
});
