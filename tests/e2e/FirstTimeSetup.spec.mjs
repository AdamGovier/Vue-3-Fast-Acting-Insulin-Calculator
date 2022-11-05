import { test, expect } from '@playwright/test';
import env from './test.init.mjs';

/* 
    Aim of this series of tests is to test the aspects of components
    which are expected to act differently to usual during first launch. 
*/

test.describe("First Setup", () => {
    // Welcome Screen

    test("The ActionBar must not navigate anywhere from the welcome screen.", async ({page}) => {
        await env.helpers.simulateFirstLaunch(page); // Emulate first launch.

        // Get current location.
        const initialURL = page.url();

        // Simulate navigation click.
        await page.locator('*[data-testid="ActionBar"]').click();

        // Expect the URL of the browser to not of changed.
        expect(page.url()).toBe(initialURL);
    });

    test("Pressing continue from welcome should bring you to the ToS screen.", async ({page}) => {
        await env.helpers.simulateFirstLaunch(page); // Emulate first launch.

        // Simulate clicking next.
        await page.locator('*[data-testid="WelcomeContinue"]').click();

        // Expect the URL to be support/Legal.
        expect(page.url()).toBe(`${env.config.URL}/support/Legal`);
    });

    test("Pressing continue from welcome should bring you to the dose settings screen if ToS is already accepted.", async ({page}) => {
        await env.helpers.simulateFirstLaunch(page); // Emulate first launch.

        await env.helpers.acceptToS(page);

        // Simulate clicking next.
        await page.locator('*[data-testid="WelcomeContinue"]').click();

        // Expect the URL to be settings/DoseSettings.
        expect(page.url()).toBe(`${env.config.URL}/settings/DoseSettings`);
    });

    // ToS Screen

    test("Pressing accept on the ToS screen should bring you to the dose settings screen.", async ({page}) => {
        await env.helpers.simulateFirstLaunch(page); // Emulate first launch.

        // Simulate clicking next.
        await page.locator('*[data-testid="WelcomeContinue"]').click();

        // Simulate clicking accept ToS.
        await page.locator('*[data-testid="acceptToSBtn"]').click();

        // Expect the URL to be settings/DoseSettings.
        expect(page.url()).toBe(`${env.config.URL}/settings/DoseSettings`);
    });

    // Dose Settings Screen

    test("Pressing Save Default on the dose settings screen should bring you to the correction settings screen.", async ({page}) => {
        await env.helpers.simulateFirstLaunch(page); // Emulate first launch.

        await env.helpers.acceptToS(page);

        // Simulate clicking next.
        await page.locator('*[data-testid="WelcomeContinue"]').click();

        // Fill input
        await page.type('*[data-testid="unschedCarbRatioInput"]', "8");
        
        // Simulate clicking next.
        await page.locator('*[data-testid="SaveDoseSettingsBtn"]').click();

        // Expect the URL to be settings/CorrectionSettings.
        expect(page.url()).toBe(`${env.config.URL}/settings/CorrectionSettings`);
    });

    // Correction Settings Screen

    test("Pressing Save on the correction settings screen should finish the setup and bring you to the calculator.", async ({page}) => {
        await env.helpers.simulateFirstLaunch(page); // Emulate first launch.

        await env.helpers.acceptToS(page);

        // Simulate clicking next.
        await page.locator('*[data-testid="WelcomeContinue"]').click();

        // Fill input
        await page.type('*[data-testid="unschedCarbRatioInput"]', "8");
        
        // Simulate clicking next.
        await page.locator('*[data-testid="SaveDoseSettingsBtn"]').click();

        // Fill inputs
        await page.type('*[data-testid="CorrectionFactorInput"]', "2.3");
        await page.type('*[data-testid="MinimumBloodSugarInput"]', "4.7");
        await page.type('*[data-testid="MaximumBloodSugarInput"]', "7");
        await page.type('*[data-testid="TargetBloodSugarInput"]', "5.6");

        // Save correction settings
        await page.locator('*[data-testid="SaveCorrectionSettingsBtn"]').click();

        // Expect url to be main url.
        expect(page.url()).toBe(env.config.URL + "/");
    });
})

