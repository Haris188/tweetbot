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
const tweeter_1 = __importDefault(require("./tweeter"));
const pg_1 = require("pg");
jest.mock('pg');
require('dotenv').config();
describe('tweeter.getStatusFromDb()', () => {
    it('should return status as defined object on success', () => __awaiter(void 0, void 0, void 0, function* () {
        pg_1.Pool.prototype.query = jest.fn(() => createMockQuerySuccessFn());
        const templete = createSuccessResponseObjTemplete();
        const result = yield tweeter_1.default.testGetStatusFromDb();
        expect(result).toMatchObject(templete);
    }));
    it('should return status as defined object on failure', () => __awaiter(void 0, void 0, void 0, function* () {
        pg_1.Pool.prototype.query = jest.fn(() => createMockQueryEmptyFn());
        const templete = createFailResponseObjTemplete();
        const result = yield tweeter_1.default.testGetStatusFromDb();
        expect(result).toMatchObject(templete);
    }));
    it('should return status as defined object on null', () => __awaiter(void 0, void 0, void 0, function* () {
        pg_1.Pool.prototype.query = jest.fn(() => createMockQueryNullFn());
        const templete = createFailResponseObjTemplete();
        const result = yield tweeter_1.default.testGetStatusFromDb();
        expect(result).toMatchObject(templete);
    }));
});
describe('tweeter.getQuoteIdFromFile()', () => {
    it('should return an Integer', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tweeter_1.default.testQuoteIdFromFile();
        console.log(result);
        expect(typeof result).toBe('number');
    }));
});
describe('tweeter.incrementQuoteIdInFile()', () => {
    it('should increment one to given argument', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield tweeter_1.default.testIncrementQuoteIdInFile(1);
        expect(result).toBe(2);
    }));
});
function createMockQueryNullFn() {
    return new Promise(resolve => {
        resolve(null);
    });
}
function createMockQueryEmptyFn() {
    return new Promise(resolve => {
        resolve({
            rows: []
        });
    });
}
function createMockQuerySuccessFn() {
    return new Promise(resolve => {
        resolve({
            rows: [
                {
                    id: 1,
                    text: 'text',
                    author: 'author'
                }
            ]
        });
    });
}
function createFailResponseObjTemplete() {
    return {
        success: false,
        data: expect.anything()
    };
}
function createSuccessResponseObjTemplete() {
    return {
        success: true,
        data: {
            id: expect.any(Number),
            text: expect.any(String),
            author: expect.any(String),
        }
    };
}
//# sourceMappingURL=tweeter.test.js.map