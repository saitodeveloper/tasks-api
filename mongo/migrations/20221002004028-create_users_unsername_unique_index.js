const collection = 'users'

async function up (db) {
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
}

async function down (db) {
    const indexes = await db
        .collection(collection)
        .indexes()
    const hasIndex = indexes.find(item => item.name === 'username_unique')
    if (hasIndex) {
        await db.collection(collection).dropIndex('username_unique')
    }
}

module.exports = { up, down }
