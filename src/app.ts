import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const app = express();
const apolloServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String!
        }
    `,
    resolvers: {
        Query: {
            hello: () => "hello world"
        }
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export {
    app,
    apolloServer
}