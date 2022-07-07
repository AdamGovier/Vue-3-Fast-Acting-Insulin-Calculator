const URL = "http://localhost:8080/";

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
    }
}