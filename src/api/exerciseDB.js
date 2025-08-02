const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://exercisedb.p.rapidapi.com/exercises',
  headers: {
    'x-rapidapi-key': '9469433aa7msh93bd7b1d39c015dp1453c5jsn0164ea22aa10',
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		console.log(response.data);
	} catch (error) {
		console.error(error);
	}
}

fetchData();