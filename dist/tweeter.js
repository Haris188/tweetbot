"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twit_1 = __importDefault(require("twit"));
const pg_1 = require("pg");
const fs_1 = __importDefault(require("fs"));
const util = require('util');
const path_1 = __importDefault(require("path"));
const readFile = util.promisify(fs_1.default.readFile);
const writeFile = util.promisify(fs_1.default.writeFile);
require('dotenv').config();
const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const connectionString = `postgressql://${user}:${password}@${host}:${port}/${database}`;
const pool = new pg_1.Pool({
    connectionString: connectionString,
    max: 20,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0
});
class Twitter {
    constructor() {
        this.T = new twit_1.default({
            consumer_key: 'SiU4UL12MKLUQ5f0JsXPAXGqm',
            consumer_secret: 'X5Ha51beCYdWtJCB0Rw67bLC7IKShRs861Kwf0NcWfr9C9B2AB',
            access_token: '1243353261232607244-XvzTJTgWTJlOd7DTLWXzRvfPzMnnwd',
            access_token_secret: '9UIJ9yk95T2SlP9Y9ljua9I71c9PRm6KRF4GP7GkdaVds',
            timeout_ms: 60 * 1000,
            strictSSL: true,
        });
    }
    tweet() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.getStatusFromDb();
            console.log(status);
            if (status.success) {
                const text = this.removeSlashes(status.data.text);
                this.T.post('statuses/update', { status: `"${text}" - ${status.data.author}` }, function (err, data, response) {
                    if (data) {
                        console.log('updated');
                    }
                    else if (err) {
                        console.log('Tweeter failed to update status @ Tweeter.tweet()');
                    }
                });
            }
        });
    }
    removeSlashes(text) {
        return text.replace(/\\/g, '');
    }
    getStatusFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const quoteId = yield this.getQuoteIdFromFile();
            const query = this.createFetchQuery(quoteId);
            let result;
            const res = yield pool.query(query);
            if (res) {
                result = this.extractData(res);
            }
            else {
                result = { success: false, data: 'pg.query returns null' };
            }
            return result;
        });
    }
    extractData(res) {
        if (res.rows.length > 0) {
            return {
                success: true,
                data: res.rows[0]
            };
        }
        else {
            return { success: false, data: 'Rows obj of pg.query is empty' };
        }
    }
    getQuoteIdFromFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const filepath = path_1.default.join(__dirname, 'quote_id.txt');
            const quoteId = yield readFile(filepath, 'utf8');
            yield this.incrementQuoteIdInFile(quoteId);
            return parseInt(quoteId);
        });
    }
    incrementQuoteIdInFile(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = parseInt(quoteId) + 1;
            const filepath = path_1.default.join(__dirname, 'quote_id.txt');
            const result = yield writeFile(filepath, `${data}`, { flag: 'w' });
            console.log(result);
            return data;
        });
    }
    createFetchQuery(quoteId) {
        return `SELECT * FROM quotes WHERE id = ${quoteId}`;
    }
    testGetStatusFromDb() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(process.env.NODE_ENV);
            if (process.env.NODE_ENV === 'test') {
                return yield this.getStatusFromDb();
            }
        });
    }
    testQuoteIdFromFile() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(process.env.NODE_ENV);
            if (process.env.NODE_ENV === 'test') {
                return yield this.getQuoteIdFromFile();
            }
        });
    }
    testIncrementQuoteIdInFile(quoteId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(process.env.NODE_ENV);
            if (process.env.NODE_ENV === 'test') {
                return yield this.incrementQuoteIdInFile(quoteId);
            }
        });
    }
}
exports.default = new Twitter();
//# sourceMappingURL=tweeter.js.map