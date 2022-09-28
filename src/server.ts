#!/usr/bin/env node
import { app, apolloServer } from './app';
import http from 'http';

async function startApolloServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}

(async () => {
    await startApolloServer();
    const port = normalizePort(process.env.PORT || '3000');
    app.set('port', port)

    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    function normalizePort(portNumber: string) {
        const port = parseInt(portNumber, 10);
    
        if (isNaN(port)) {
            return portNumber;
        }
    
        if (port >= 0) {
            return port;
        }
    
        return false;
    }

    function onError(error: any) {
        if (error.syscall !== 'listen') {
        throw error;
        }
    
        var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
            default:
                throw error;
        }
    }

    function onListening() {
        var addr = server.address();
        var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr?.port;
        console.log('Listening on ' + bind);
    }
})()