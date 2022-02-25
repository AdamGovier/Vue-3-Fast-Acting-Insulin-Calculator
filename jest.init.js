// https://stackoverflow.com/questions/51214631/how-to-mock-global-vue-js-variable-in-jest-test

import mitt from 'mitt'; // https://stackoverflow.com/questions/63471824/vue-js-3-event-bus
const emitter = mitt();

import { config } from "@vue/test-utils"; //2.0.0-beta.5
config.global.mocks = {
    emitter
};