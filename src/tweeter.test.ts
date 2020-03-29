
import Tweeter from './tweeter';
import {Pool} from 'pg'

jest.mock('pg')

require('dotenv').config();

describe('tweeter.getStatusFromDb()', () => {
    
    it('should return status as defined object on success', async ()=>{
        Pool.prototype.query = jest.fn(()=>createMockQuerySuccessFn())
        const templete = createSuccessResponseObjTemplete();
        const result = await Tweeter.testGetStatusFromDb();
        expect(result).toMatchObject(templete);
    })

    it('should return status as defined object on failure', async ()=>{
        Pool.prototype.query = jest.fn(()=>createMockQueryEmptyFn())
        const templete = createFailResponseObjTemplete();
        const result = await Tweeter.testGetStatusFromDb();
        expect(result).toMatchObject(templete);
    })

    it('should return status as defined object on null', async ()=>{
        Pool.prototype.query = jest.fn(()=>createMockQueryNullFn())
        const templete = createFailResponseObjTemplete();
        const result = await Tweeter.testGetStatusFromDb();
        expect(result).toMatchObject(templete);
    })
})

describe('tweeter.getQuoteIdFromFile()', ()=>{
    it('should return an Integer', async ()=>{
        const result = await Tweeter.testQuoteIdFromFile();
        console.log(result)
        expect(typeof result).toBe('number');
    })
})

describe('tweeter.incrementQuoteIdInFile()', ()=>{
    it('should increment one to given argument', async ()=>{
        const result = await Tweeter.testIncrementQuoteIdInFile(1)
        expect(result).toBe(2);
    })
})

function createMockQueryNullFn(){
    return new Promise(resolve => {
        resolve(null)
    })
}

function createMockQueryEmptyFn(){
    return new Promise(resolve => {
        resolve({
            rows: []
        })
    })
}

function createMockQuerySuccessFn(){
    return new Promise(resolve => {
        resolve({
            rows: [
                {
                    id: 1,
                    text: 'text',
                    author: 'author'
                }
            ]
        })
    })
}

function createFailResponseObjTemplete(){
    return {
        success: false,
        data: expect.anything()
    }
}

function createSuccessResponseObjTemplete(){
    return {
        success: true,
        data: {
            id: expect.any(Number),
            text: expect.any(String),
            author: expect.any(String),
        }
    }
}

