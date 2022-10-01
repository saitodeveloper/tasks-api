import { Db } from 'mongodb'
import { MigrationInterface } from 'mongo-migrate-ts';
const collection = 'users'

export class Migration1664667183632 implements MigrationInterface {
    public async up(db: Db): Promise<any> {
        const indexes = await db
            .collection(collection)
            .indexes()
        const hasIndex = indexes.find(item => item.name === 'username_unique')
        if (!hasIndex) {
            await db.collection(collection).createIndex(
                { 'username': 1 }, 
                { 'unique': true, 'sparse': false, 'name': '_username_unique_' }
            )
        }
        return
    }

    public async down(db: Db): Promise<any> {
        const indexes = await db
            .collection(collection)
            .indexes()
        const hasIndex = indexes.find(item => item.name === 'username_unique')
        if (hasIndex) {
            await db.collection(collection).dropIndex('username_unique')
        }
        return
    }
}
