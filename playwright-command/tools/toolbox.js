const { exec } = require('node:child_process');
const fs = require('fs');

/**
 * Just the parameters, the --data is hard code in the function
 * Do not change the path /home/adrian/playwright_training/resources/customer.csv
 * @param {string} args 
 * @returns {string}
 */
export async function runPythonScriptAndGetOutput(args) {
    return new Promise((resolve, reject) => {
        exec('python resources/extractor.py --data resources/customer.csv ' + args, { maxBuffer: 20480 * 20480 } , (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                reject(error);
            }
            if (stderr) {
                console.error(`Python script encountered an error: ${stderr}`);
                reject(stderr);
            }
            resolve(stdout);
        });
    });
}

export function csvToArr(csv) {
    const fileContent = fs.readFileSync(csv, 'utf8');
    const [keys, ...rest] = fileContent.split('\n').map((item) => item.split(','));
    const formedArr = rest.map((item) => {
        const object = {};
        keys.forEach((key, index) => { 
            if (item[index] !== '' && item[index] !== undefined) {
                object[key] = item[index];
            }
        });
        return object;
    });
    return formedArr;
}

export async function readCsvExtractData(path) {
    return fs.readFileSync(path).toString().split('\n').map(e => e.split(','))
}