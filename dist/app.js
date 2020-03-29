"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweeter_1 = __importDefault(require("./tweeter"));
require('dotenv').config();
const app = express_1.default();
const port = process.env.PORT;
app.get('/', (req, res) => {
    tweeter_1.default.tweet();
    res.send('done');
});
app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=app.js.map