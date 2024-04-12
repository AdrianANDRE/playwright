import { test } from '@playwright/test';

test.beforeEach( () => {
    console.log('Before each test');
});

test.afterEach( () => {
    console.log('After each test');
})