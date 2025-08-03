import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const rapidApiKey = '9469433aa7msh93bd7b1d39c015dp1453c5jsn0164ea22aa10';
const baseUrl = 'https://exercisedb.p.rapidapi.com';



const apiCall = async (url, params) => {
    const options = {
    method: 'GET',
    url,
    params,
    headers: {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    }
  };
	try {
		const response = await axios.request(options);
    return response.data;
		
	} catch (error) {
		console.error('API call error: ', error.message);
        return null; // Return null on error to be handled by the caller
	}
}
export const fetchExercisesPerBodyPart = async (bodyPart, limit = 1000) => {
  // Set a high limit to fetch all exercises for a given body part, bypassing the default of 10.
  let data = await apiCall(baseUrl+`/exercises/bodyPart/${bodyPart}`, { limit });
  return data;
}
export const fetchBodyPartList = async () => {
  let data = await apiCall(baseUrl+`/exercises/bodyPartList`);
  //console.log(data);
  return data;
}

/**
 * Fetches all exercises for every body part available from the API.
 * It performs these requests in parallel for maximum efficiency.
 * @returns {Promise<Object>} A promise that resolves to an object where keys are body parts
 * and values are arrays of exercises for that body part.
 */
export const fetchAllExercisesByBodyPart = async () => {
    // 1. Get the list of all body parts
    const bodyParts = await fetchBodyPartList();

    if (!bodyParts || bodyParts.length === 0) {
        console.error("Could not fetch body part list or it is empty. Aborting.");
        return {};
    }

    console.log(`Preparing to fetch exercises for ${bodyParts.length} body parts...`);

    // 2. Create an array of promises. This will start all API calls in parallel.
    const promises = bodyParts.map(async (bodyPart) => {
        console.log(`  -> Fetching for ${bodyPart}`);
        const exercises = await fetchExercisesPerBodyPart(bodyPart); // This will use the default high limit
        return { bodyPart, exercises: exercises || [] }; // Ensure exercises is an array
    });

    // 3. Wait for all the parallel API calls to complete
    const results = await Promise.all(promises);

    // 4. Combine the results into a single object, keyed by body part
    return results.reduce((acc, { bodyPart, exercises }) => {
        acc[bodyPart] = exercises;
        return acc;
    }, {});
}
const downloadExerciseData = async () => {
        console.log('Starting script to fetch all exercises and save to separate files...');
        const allExercises = await fetchAllExercisesByBodyPart();

        const outputDir = 'src/api/data/exercises';
        if (!fs.existsSync(outputDir)){
            fs.mkdirSync(outputDir, { recursive: true });
        }

        let count = 0;
        for (const [bodyPart, exercises] of Object.entries(allExercises)) {
            if (exercises.length > 0) {
                const filePath = `${outputDir}/${bodyPart}.json`;
                fs.writeFileSync(filePath, JSON.stringify(exercises, null, 2));
                console.log(`  -> Saved ${exercises.length} exercises to ${filePath}`);
                count++;
            }
        }

        console.log(`\n✅ All exercises for ${count} body parts have been fetched and saved to individual files in the ${outputDir} directory.`);
}

const generateLocalDataMaps = () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    console.log('Generating local data and image maps...');
    const exercisesDir = path.join(__dirname, 'data', 'exercises');
    const imagesDir = path.join(exercisesDir, 'images');
    const outputFile = path.join(__dirname, 'data', 'localData.js');

    // 1. Get all JSON and image files
    const jsonFiles = fs.readdirSync(exercisesDir).filter(file => file.endsWith('.json'));
    const imageFiles = fs.readdirSync(imagesDir).filter(file => file.endsWith('.gif'));

    let dataImports = '';
    let dataMap = 'export const exerciseData = {\n';
    jsonFiles.forEach(file => {
        const bodyPart = path.basename(file, '.json');
        // Use a valid variable name for the import
        const importName = bodyPart.replace(/[^a-zA-Z0-9]/g, '_');
        dataImports += `import ${importName} from './exercises/${file}';\n`;
        dataMap += `  '${bodyPart}': ${importName},\n`;
    });
    dataMap += '};';

    let imageMap = 'export const exerciseImages = {\n';
    imageFiles.forEach(file => {
        const exerciseId = path.basename(file, '.gif');
        // The path for require must be relative to the file it's in (localData.js)
        imageMap += `  '${exerciseId}': require('./exercises/images/${file}'),\n`;
    });
    imageMap += '};';

    const fileContent = `// This file is auto-generated. Do not edit manually.\n// Run "node src/api/exerciseDB.js generate-maps" to regenerate.\n\n${dataImports}\n${dataMap}\n\n${imageMap}\n`;

    fs.writeFileSync(outputFile, fileContent);
    console.log(`\n✅ Local data maps have been generated and saved to ${outputFile}`);
};

export const downloadAllExerciseImages = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const exercisesDir = path.join(__dirname, 'data', 'exercises');
    const imagesDir = path.join(exercisesDir, 'images');
    // 1. Ensure images directory exists
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        console.log(`Created directory: ${imagesDir}`);
    }

    // 2. Read all exercise JSON files
    const jsonFiles = fs.readdirSync(exercisesDir).filter(file => file.endsWith('.json'));
    if (jsonFiles.length === 0) {
        console.log('No exercise JSON files found. Please run the data download first.');
        return;
    }

    let allExercises = [];
    for (const file of jsonFiles) {
        const filePath = path.join(exercisesDir, file);
        const data = fs.readFileSync(filePath, 'utf-8');
        allExercises = allExercises.concat(JSON.parse(data));
    }

    // Remove duplicates just in case
    const uniqueExercises = Array.from(new Map(allExercises.map(ex => [ex.id, ex])).values());
    console.log(`Found ${uniqueExercises.length} unique exercises to download images for.`);

    // 3. Download function for a single image
    const downloadImage = async (exercise) => {
        const { id, gifUrl } = exercise;
        const imagePath = path.join(imagesDir, `${id}.gif`);
        const options = {
          method: 'GET',
          url: 'https://exercisedb.p.rapidapi.com/image',
          params: {
            resolution: '360',
            exerciseId: id
          },
          responseType: 'stream', // Crucial for handling binary image data
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
          }
        }
        if (fs.existsSync(imagePath)) {
            return { id, status: 'skipped' };
        }



        try {
            const response = await axios.request(options); // response.data will be a stream
            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve({ id, status: 'downloaded' }));
                writer.on('error', (err) => {
                    fs.unlink(imagePath, () => {}); // Clean up failed download
                    reject(err);
                });
            });
        } catch (error) {
            // console.error(`Failed to download ${secureGifUrl}: ${error.message}`); // Uncomment for detailed debugging
            return { id, status: 'failed', error: error.message };
        }
    };

    // 4. Download all images with a concurrency limit
    const concurrencyLimit = 10;
    let downloadedCount = 0, skippedCount = 0, failedCount = 0;
    console.log(`Starting image download with a concurrency of ${concurrencyLimit}...`);

    for (let i = 0; i < uniqueExercises.length; i += concurrencyLimit) {
        const chunk = uniqueExercises.slice(i, i + concurrencyLimit);
        const results = await Promise.all(chunk.map(ex => downloadImage(ex).catch(err => ({ id: ex.id, status: 'failed', error: err.message }))));
        
        results.forEach(result => {
            if (result.status === 'downloaded') downloadedCount++;
            else if (result.status === 'skipped') skippedCount++;
            else if (result.status === 'failed') failedCount++;
        });
        
        const processedCount = Math.min(i + concurrencyLimit, uniqueExercises.length);
        const percentage = ((processedCount / uniqueExercises.length) * 100).toFixed(1);
        process.stdout.write(`Progress: ${processedCount}/${uniqueExercises.length} (${percentage}%) | Downloaded: ${downloadedCount}, Skipped: ${skippedCount}, Failed: ${failedCount}\r`);
    }

    console.log(`\n\n✅ Image download complete.`);
    console.log(`  - Downloaded: ${downloadedCount} new images.`);
    console.log(`  - Skipped: ${skippedCount} (already exist).`);
    console.log(`  - Failed: ${failedCount}.`);
};

// This script will only run when you execute this file directly (e.g., `node src/api/exerciseDB.js`)
// It will not run when this file is imported into your React Native app.
const __filename = fileURLToPath(import.meta.url);

// ESM equivalent of `require.main === module`
// This checks if the script is the main program being run.
if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    (async () => {
        const command = process.argv[2]; // Get command from command line arguments

        if (command === 'data') {
            await downloadExerciseData();
        } else if (command === 'images') {
            await downloadAllExerciseImages();
        } else if (command === 'generate-maps') {
            generateLocalDataMaps();
        } else {
            console.log('\nPlease specify a command to run:');
            console.log('  node src/api/exerciseDB.js data          - To download exercise JSON data from the API.');
            console.log('  node src/api/exerciseDB.js images        - To download all exercise images based on local JSON files.');
            console.log('  node src/api/exerciseDB.js generate-maps - To generate local data and image map files for the app.');
        }
    })();
}