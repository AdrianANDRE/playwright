const{test, expect} = require('@playwright/test');
const toolbox = require('../tools/toolbox.js');
const fs = require('fs');
const hooks = require('./hooks.spec.js');


test('success', () => {
    const result = toolbox.csvToArr('extracted.csv')
    console.log('New map : ', result)
})
test('second success', () => {
    const result = toolbox.csvToArr('extracted.csv')
    console.log('New map : ', result)
})

test('FAILED : The state of California need to have at least 40% of Bachelors Degree', async () => {
    await toolbox.runPythonScriptAndGetOutput(' --stats --state-filter California')
    const result = toolbox.csvToArr('extracted.csv')
    expect(parseFloat(result[0]['Percent Bachelor'])).toBeGreaterThanOrEqual(40);
})
