"use strict";

const getTestRule = require("jest-preset-stylelint/getTestRule");

global.testRule = getTestRule({ plugins: ["./index.js"] });
