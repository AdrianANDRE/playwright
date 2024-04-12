const{test, expect} = require('@playwright/test');
const toolbox = require('../tools/toolbox.js');
const fs = require('fs');
const papa = require('papaparse');
const hooks = require('../tests/hooks.spec.js');


test('Owl test', () => {
    const result = toolbox.csvToArr('extracted.csv')
    console.log('New map : ', result)
})

test('SUCCESS: Read Csv test', () => {
    var file = fs.readFileSync('resources/customer.csv').toString().split('\n').map(e => e.split(','))
    for (const row of file){
        console.log(row[2])
    }
})

test('FAILED: Run script and break', async () => {
    await toolbox.runPythonScriptAndGetOutput('--stats --state-filter Califoria')
    console.log("Output from Python script: ", toolbox.readCsvExtractData('extracted.csv'));
})

test('SUCCESS: Run python script and parse result', async () => {
    await toolbox.runPythonScriptAndGetOutput('--stats --state-filter California')
    console.log("Output from Python script: ", toolbox.readCsvExtractData('extracted.csv'));
    await console.log('papa parse : ',papa.parse('extracted.csv'))
})


 test('FAILED : The state of California need to have at least 40% of Bachelors Degree', async () => {
    await toolbox.runPythonScriptAndGetOutput(' --stats --state-filter California')
    const result = toolbox.csvToArr('extracted.csv')
    expect(parseFloat(result[0]['Percent Bachelor'])).toBeGreaterThanOrEqual(40);
})

test('SUCCESS : The state of California need to have at least 40% of Bachelors Degree', async () => {
    await toolbox.runPythonScriptAndGetOutput(' --stats --state-filter California')
    const result = toolbox.csvToArr('extracted.csv')
    expect(parseFloat(result[0]['Percent Bachelor'])).toBeGreaterThanOrEqual(30);
})

//STATE_CHOICE=California  npx playwright test tests/testing.spec.js -g "SUCCESS : Use Env var"
test('SUCCESS : Use Env var', async () => {
    await toolbox.runPythonScriptAndGetOutput(' --stats --state-filter '+ process.env.STATE_CHOICE)
    const result = toolbox.csvToArr('extracted.csv')
    expect(parseFloat(result[0]['Percent Bachelor'])).toBeGreaterThanOrEqual(30);
})