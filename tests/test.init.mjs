const URL = "http://localhost:8080";

export default {
    config: {
        URL
    },
    helpers: {
        async simulateFirstLaunch(page) { // It should already be empty in the test but for legability purposes.
            await page.goto(URL);

            await page.evaluate(() => {
                window.localStorage.clear();
            });
        },
        async acceptToS(page) {
            await page.evaluate(() => {
                window.localStorage.setItem("app_tos_date", "Wed Jul 06 2022 13:10:06 GMT+0100 (British Summer Time)");
                window.localStorage.setItem("app_tos_version", "9999999"); // ToS version just has to be higher than current. This massive number will future proof this test!
                window.localStorage.setItem("app_tos_accepted", true);
            });
        },
        async skipSetup(page) {
            await page.goto(URL);

            await page.evaluate(() => {
                window.localStorage.setItem("app_tos_date", "Wed Jul 06 2022 13:10:06 GMT+0100 (British Summer Time)");
                window.localStorage.setItem("app_tos_version", "9999999"); // ToS version just has to be higher than current. This massive number will future proof this test!
                window.localStorage.setItem("app_tos_accepted", true);
                window.localStorage.setItem("app_correction_factor", 2.3);
                window.localStorage.setItem("app_blood_sugar_unit", "mmol/L");
                window.localStorage.setItem("app_minimum_blood_sugar", 4);
                window.localStorage.setItem("app_target_blood_sugar", 5.4);
                window.localStorage.setItem("app_maximum_blood_sugar", 7);
                window.localStorage.setItem("app_carb_ratio", 8);
                window.localStorage.setItem("app_has_finished_setup", true);
            });

            await page.goto(URL);
        } 
    }
}