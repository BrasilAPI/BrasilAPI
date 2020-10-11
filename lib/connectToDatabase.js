import { MongoClient } from 'mongodb';
import url from 'url';

let cacheDb;

async function connectToDatabase(uri) {
  if (cacheDb) {
    return cacheDb;
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const dbName = url.parse(uri).pathname.substr(1);
  const db = client.db(dbName);
  cacheDb = db;

  return cacheDb;
}

export default connectToDatabase;
