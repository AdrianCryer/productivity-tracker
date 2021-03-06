const express = require('express');
const http = require('http');
const path = require('path');
const getPort = require('get-port');

module.exports = (async () => {
    const port = await getPort();

    // Check if port in use. Else die.
    
    let authServer = express();
    authServer.use(express.static(path.join(__dirname, '../../../auth-client/build')));

    authServer.get('*', async (req, res) => {
        const root =  path.join(__dirname, '../../../auth-client/build/index.html');
        res.sendFile(root);
    });

    http.createServer(authServer).listen(50022, () => {
        console.log('Auth server listening on port', 50022, port);
    });
});