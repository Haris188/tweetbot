import Twit from 'twit';
import {Pool} from 'pg'
import fs from 'fs';
const util = require('util');
import path from 'path'
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

require('dotenv').config();

const user = process.env.DB_USER;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;
const connectionString = `postgressql://${user}:${password}@${host}:${port}/${database}`
const pool = new Pool({
    connectionString: connectionString,
    max:20,
    idleTimeoutMillis:0,
    connectionTimeoutMillis:0
})

class Twitter{
    private T = new Twit({
        consumer_key:         'SiU4UL12MKLUQ5f0JsXPAXGqm',
        consumer_secret:      'X5Ha51beCYdWtJCB0Rw67bLC7IKShRs861Kwf0NcWfr9C9B2AB',
        access_token:         '1243353261232607244-XvzTJTgWTJlOd7DTLWXzRvfPzMnnwd',
        access_token_secret:  '9UIJ9yk95T2SlP9Y9ljua9I71c9PRm6KRF4GP7GkdaVds',
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL:            true,     // optional - requires SSL certificates to be valid.
      })
      
    public async tweet(){
        const status = await this.getStatusFromDb();
        console.log(status)
        if(status.success){
          const text = this.removeSlashes(status.data.text);
          this.T.post('statuses/update', { status: `"${text}" - ${status.data.author}` }, function(err, data, response) {
              if(data){
                console.log('updated')
              }
              else if(err){
                console.log('Tweeter failed to update status @ Tweeter.tweet()')
              }
          })   
        }
    }

    private removeSlashes(text){
      return text.replace(/\\/g, '');
    }

    private async getStatusFromDb(){
      const quoteId = await this.getQuoteIdFromFile();
      const query = this.createFetchQuery(quoteId);
      let result;
      const res = await pool.query(query);
      if(res){
        result = this.extractData(res);
      }
      else{
        result = {success: false, data: 'pg.query returns null'}
      }
      return result;
    }

    private extractData(res){
      if(res.rows.length > 0){
        return {
          success: true,
          data: res.rows[0]
        }
      }
      else{
        return {success: false, data:'Rows obj of pg.query is empty'}
      }
    }

    private async getQuoteIdFromFile(){
      const filepath = path.join(__dirname, 'quote_id.txt')
      const quoteId = await readFile(filepath, 'utf8');
      await this.incrementQuoteIdInFile(quoteId);
      return parseInt(quoteId);
    }

    private async incrementQuoteIdInFile(quoteId){
      const data = parseInt(quoteId) + 1;
      const filepath = path.join(__dirname, 'quote_id.txt');
      const result = await writeFile(filepath, `${data}`, {flag: 'w'});
      console.log(result)
      return data;
    }

    private createFetchQuery(quoteId){
      return `SELECT * FROM quotes WHERE id = ${quoteId}`
    }

    public async testGetStatusFromDb(){
      console.log(process.env.NODE_ENV )
      if(process.env.NODE_ENV === 'test'){
        return await this.getStatusFromDb();
      }
    }

    public async testQuoteIdFromFile(){
      console.log(process.env.NODE_ENV )
      if(process.env.NODE_ENV === 'test'){
        return await this.getQuoteIdFromFile();
      }
    }

    public async testIncrementQuoteIdInFile(quoteId){
      console.log(process.env.NODE_ENV )
      if(process.env.NODE_ENV === 'test'){
        return await this.incrementQuoteIdInFile(quoteId);
      }
    }
}

export default new Twitter();