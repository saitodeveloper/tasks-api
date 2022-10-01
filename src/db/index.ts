import { MongoClient, Db } from 'mongodb';
import * as environment from '../environment';

export class DatabaseHelper {
    private static db: Db | null = null;
    private static dbName = environment.value('MONGO_DB', '');
    private static mongoUrl = environment.value('MONGO_URL', '');

    static async requestConnection() {
        if (!this.db) {
            try {
                const connection = await MongoClient.connect(this.mongoUrl);
                this.db = connection.db(this.dbName)
                return this.db
            } catch(error) {
                throw new Error('Connection Fail!')
            }
        } else {
            return this.db
        }
    }
}
