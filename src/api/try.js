import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const imagePath = '0017.gif';
const options = {
  method: 'GET',
  url: 'https://exercisedb.p.rapidapi.com/image',
  params: {
    resolution: '360',
    exerciseId: '0017'
  },
  responseType: 'stream', // This is crucial for downloading binary file data
  headers: {
    'x-rapidapi-key': '9469433aa7msh93bd7b1d39c015dp1453c5jsn0164ea22aa10',
    'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
  }
};

async function fetchData() {
    if (fs.existsSync(imagePath)) {
        return { status: 'skipped' };
    }
	try {
        console.log("hello");
        const writer = fs.createWriteStream(imagePath);
		const response = await axios.request(options);
        
        // response.data is now a readable stream that can be piped to a file
        response.data.pipe(writer);

        // Return a promise that resolves when the download is complete
        return new Promise((resolve, reject) => {
            writer.on('finish', () => { console.log('Download complete for 0017.gif!'); resolve(); });
            writer.on('error', reject);
        });
	} catch (error) {
		console.error(error);
	}
}
console.log("hey");
fetchData();