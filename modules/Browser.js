const puppeteer = require('puppeteer');
const { Browser } = require('../node_modules/puppeteer/lib/Browser.js');

const extensionsPath = __dirname.substring(0, __dirname.lastIndexOf('\\')) + '\\browserExtensions\\';
const adblockPath = extensionsPath + 'adblock';
console.log(extensionsPath);

module.exports.startBrowser = () => new Promise((res, rej) => {
    puppeteer.launch({
        headless: false,
        args: [
            '--window-size=640,480',
            `--disable-extensions-except=${adblockPath}`,
            `--load-extension=${adblockPath}`
            // ,'--mute-audio'
        ]
    })
    .then(browser => res(browser))
    .catch(err => console.log(err));
});

Browser.prototype.run = async function(link = 'https://youtube.com') {
    return new Promise(async (res, rej) => {
        const page = await this.newPage();
        page.goto(link)
            .then(async () => {
                console.log(`Pomyślnie udało się przejść do strony: ${link}`);
                await this.closeEmptyPage();
                res(page);
            })
            .catch(err => console.log(`Nie udało się przejść do strony: ${link}.\nKod błędu: ${err}`));
    });
};

Browser.prototype.closeEmptyPage = async function() {
    const pages = await this.pages();
    if(pages.length > 1 && !pages[0].url().includes('http'))
        await pages[0].close();
};