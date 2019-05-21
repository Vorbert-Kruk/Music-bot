const { Page } = require('../node_modules/puppeteer/lib/Page.js');
const database = require('./database');

require('./prototypes');

database.initializeDatabase();

Page.prototype.pauseMusic = async function() {
    await this.toggleMusic(true);
};

Page.prototype.resumeMusic = async function() {
    await this.toggleMusic(false);
};

Page.prototype.toggleMusic = async function(pause) {
    try 
    {
        await this.click(`button.ytp-play-button.ytp-button[title^="${pause ? 'W' : 'O'}"]`);
    }
    catch (err)
    {
        console.log(`Piosenka jest już ${pause ? 'zatrzymana' : 'wznowiona'}!`);
    }
};

Page.prototype.refresh = async function() {
    await this.reload();
};

Page.prototype.playSong = async function(songName) {
    database.getSong(songName)
        .then(async songLink => {
            console.log(songLink);
            await songLink ? 
                this.goto(songLink) :
                this.searchPhrase(songName);
        })
        .catch(err => console.log(err));
};

Page.prototype.playNext = async function() {
    try 
    {
        await this.click('ytd-compact-autoplay-renderer');
    }
    catch (err) 
    {
        console.log('Youtube nie rekomenduje następnego utworu');
        try 
        {
            await this.click('ytd-compact-video-renderer:not([lockup])');
        }
        catch (secondErr)
        {
            console.log('W prawym panelu znajdują się same listy piosenek!');
        }
    }
};

Page.prototype.playPrevious = async function() {
    try 
    {
        await this.goBack();
        if(!this.url.includes('http'))
            console.log('Jesteś aktualnie na pustej stronie!');
    }
    catch(err)
    {
        console.error('Nie można wrócić do poprzedniej strony!');
    }
};

Page.prototype.getSongName = async function() {
    try 
    {
        const songHandler = await this.$('h1.title.style-scope.ytd-video-primary-info-renderer');
        return await songHandler.$eval('yt-formatted-string.ytd-video-primary-info-renderer', nameContainer => nameContainer.innerText);
    }
    catch (err)
    {
        console.log('Nazwa piosenki nie zdążyła się jeszcze wczytać');
        return null;
    }
};

Page.prototype.saveSong = async function() {
    // Zrobic promise-a i zwracać do przeglądarki komunikaty: udało się / nie udalo się zapisać
    await database.addSong(await this.getSongName(), this.getSongLink());
};

Page.prototype.removeSong = async function() {
    await database.removeSong(this.url());
};

Page.prototype.getSongLink = function() {
    return this.url();
};

Page.prototype.searchPhrase = async function(phraseToSearch) {
    await this.goto(phraseToSearch.makeYoutubeQuery());
    await this.click('ytd-video-renderer.style-scope.ytd-item-section-renderer');
};

module.exports;