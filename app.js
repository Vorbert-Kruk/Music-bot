const { startBrowser } = require('./modules/Browser');
const express = require('express');
const app = express();
const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer, {
    path: '/socketConnection'
});
const appPort = 3000;
const socketPort = 4761;
let browser;
let currentPage;

require('./modules/Page');

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

app.get('/', async (req, res) => {
    console.log(`Request to the site: localhost:${appPort}${req.path} has been made from ${req.hostname}`);
    res.render('index', {
      // Dane do renderowanka
      appPort: appPort,
      socketPort: socketPort
    });
});

app.get('/socketPort', (req, res) => {
    res.type('application/json');
    res.end(JSON.stringify({
        portNumber: socketPort
    }));
});

io.on('connection', client => {
    console.log(`Nowa osoba, o id: ${client.id}, połączyła się!`);
    if(typeof currentPage != 'undefined' || typeof browser == 'undefined')
    {
        client.on('song', message => {
            switch(message)
            {
                case 'pause':
                    currentPage.pauseMusic();
                break;
                case 'resume':
                    currentPage.resumeMusic();
                break;
                case 'reload':
                    currentPage.reload();
                break;
                case 'next': 
                    currentPage.playNext();
                break;
                case 'save':
                    currentPage.saveSong();
                break;
                case 'remove':
                    currentPage.removeSong();
                break;
                case 'previous':
                    currentPage.playPrevious();
                default:
                    console.log(`Zostało wysłane żądanie do elementu 'song' zatytułowane, jako: ${message}`);
                break;
            }
        });
        client.on('newSong', async songTitle => {
            if(typeof browser == 'undefined')
            { 
                browser = await startBrowser();
                currentPage = await browser.run();
            }
            await currentPage.playSong(songTitle);
        });
        client.on('page', utility => {
            switch(utility) 
            {
                case 'refresh':
                    currentPage.refresh();
                break;
                default:
                    console.log(`Zostało wysłane żądanie do elementu 'page' zatytułowane, jako: ${utility}`);
                break;
            }
        });
    }
});

console.log(`Serwer is online on port ${appPort}`);
console.log(`Socket is being open on port ${socketPort}`);

socketServer.listen(socketPort);
app.listen(appPort);