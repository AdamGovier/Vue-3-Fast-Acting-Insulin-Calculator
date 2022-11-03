import { test, expect } from '@playwright/test';
import env from './test.init.mjs';


/* 
    Aim of this series of tests is to test the navigation between different pages/panels.
*/

test.describe("Navigation", () => {
    test.beforeEach(async ({ page }) => {
        await env.helpers.skipSetup(page);
    });

    test("Pressing the action button from the calculator page should navigate to the menu page.", async ({page}) => {
        // Simulate navigation click.
        await page.locator('*[data-testid="ActionBar"]').click();
    
        // Expect the URL to be /Menu.
        expect(page.url()).toBe(`${env.config.URL}/Menu`);
    });

    
});
