async function up(db) {
    return await db.command({
        collMod: "users",
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: [ "username", "password", "name" ],
                properties: {
                    username: {
                        bsonType: "string",
                        not: {
                            enum: ["null"]
                        }
                    },
                    password: {
                        bsonType: "string",
                        not: {
                            enum: ["null"]
                        }
                    },
                    name: {
                        bsonType: "string",
                        not: {
                            enum: ["null"]
                        }
                    }
                }
            }
        }
    });
}

async function down(db) {
    return await db.command({
        collMod: "users",
        validator: {},
        validationLevel: "off"
    });
}

module.exports = { up, down };
