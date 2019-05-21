const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

module.exports.initializeDatabase = () => {
    connection.connect(err => {
        if(err)
            throw new Error(`Nie udało się wbić na baze ;/.\nKod błędu: ${err}`);
        else
            console.log('Pomyślnie połączono się z bazą danych!');
    });
};

const makeQuery = (query, callback) => {
    return new Promise((res, rej) => {
        connection.query(query, (err, results, fields) => {
            if(err)
                rej(err);
            res(callback(results, fields) || true);
        });
    });
};

module.exports.addSong = async (songName, songLink) => {
    if(!songName || !songLink) 
        return;
    await makeQuery(`INSERT INTO songs VALUES(null, '${songName}', '${songLink}')`, results => {
        if(results)
            console.log(`Pomyślnie dodano nowy utwór: "${songName}"`);
    }).catch(() => console.log(`W bazie znajduje się duplikat piosenki o nazwie "${songName}"`));
};

module.exports.removeSong = async (songLink) => {
    if(!songLink) 
        return;
    await makeQuery(`DELETE FROM songs WHERE link = "${songLink}"`, results => {
        if(results.affectedRows >= 1)
            console.log(`Pomyślnie usunięto utwór, znajdujący się pod linkiem: "${songLink}"`)
    }).catch(() => console.log(`Wystąpił problem podczas usuwania utworu z linkiem: "${songLink}"`));
};

module.exports.getRandomSong = () => {
    return new Promise(res => {
        makeQuery('SELECT * FROM songs ORDER BY RAND() LIMIT 1', results => res(results[0]))
            .catch(err => console.log(`Nie było możliwe otrzymanie losowego utworu.\nKod błędu: ${err}`));
    });
};

module.exports.getSong = songName => {
    return new Promise((res, rej) => {
        if(!songName) rej('Nie podano nazwy utworu!');
        makeQuery(`SELECT link FROM songs WHERE name LIKE '%${songName}%' ORDER BY RAND() LIMIT 1`, (results, fields) => 
        {   
            if(results.length == 0) 
                return res(false);
            res(results[0].link);
        }).catch(err => rej(err));
    });
};