import Twit from 'twit';
import {Pool} from 'pg'
import fs from 'fs';
const util = require('util');
import path from 'path'
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString,
    max:20,
    idleTimeoutMillis:0,
    connectionTimeoutMillis:0
})

class Twitter{
    private T = new Twit({
        consumer_key:         process.env.TWITTER_API_KEY,
        consumer_secret:      process.env.TWITTER_API_SECRET,
        access_token:         process.env.TWITTER_API_TOKEN,
        access_token_secret:  process.env.TWITTER_API_TOKEN_SECRET,
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
      //const quoteId = await this.getQuoteIdFromFile();
      const query = this.createFetchQuery();
      let result;
      const res = await pool.query(query);
      if(res){
        result = this.extractData(res);
        this.incrementQuoteIdInFile(result.data.id);
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
      const quoteId = await pool.query()
      return parseInt(quoteId);
    }

    private async incrementQuoteIdInFile(quoteId){
      const data = parseInt(quoteId) + 1;
      // const filepath = path.join(__dirname, 'quote_id.txt');
      // const result = await writeFile(filepath, `${data}`, {flag: 'w'});
      // console.log(result)
      const query = `UPDATE quote_id SET quote_id = ${data} WHERE quote_id = ${quoteId}`
      await pool.query(query)
      return data;
    }

    private createFetchQuery(){
      return `select * from quote_id INNER JOIN quotes ON (quote_id.quote_id = quotes.id);`
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