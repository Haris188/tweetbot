"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tweeter_1 = __importDefault(require("./tweeter"));
require('dotenv').config();
const app = express_1.default();
const PORT = process.env.PORT || 3000;
app.get('/tweet/tweet', (req, res) => {
    tweeter_1.default.tweet();
    res.send('done');
});
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
//# sourceMappingURL=app.js.map