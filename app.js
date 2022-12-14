const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const secrets = require('./secrets.json')

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


const url = secrets.URL;

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
	const firstName = req.body.fname;
	const lastName = req.body.lname;
	const email = req.body.email;

	const data = {
		members: [
			{
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
				email_address: email,
				status: 'subscribed',
			},
		],
	};

	const jsonData = JSON.stringify(data);

	const options = {
		method: 'POST',
		auth: `hopeaz1:${secrets.API_KEY}`,
	};

	const request = https.request(url, options, (response) => {

		if(response.statusCode === 200){
			res.sendFile(__dirname + "/success.html")
		} else {
			res.sendFile(__dirname + "/failure.html")
		}

		res.on('data', (data) => {
			console.error(JSON.parse(data));
		});
	});
	request.write(jsonData);

	request.on('error', (e) => {
		console.error(e);
	});
	request.end();
});


app.post("/failure", (req, res) => {
	res.redirect("/")
})

app.listen(3000, () => {
	console.log('App listening on port 3000....');
});
