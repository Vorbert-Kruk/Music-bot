(async () => {
    const socket = io(`http://localhost:${socketPort}`, {
        path: `/socketConnection`
    });
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            socket.emit('song', button.innerHTML.toLowerCase());
        });
    });

    socket.addEventListener('connect', () =>{
        speak('Connection with the server has been established!');
        console.log('Pomyślnie nawiązano komunikacje z socketem serwera!');
        // Jeśli nie jest podłaczony, to pyknąć komunikat o np. braku dostepu do internetu, czy też po prostu problemu z połączeniem xDD
    });

    socket.addEventListener('song_err', async message => {
        await speak(message);
    });

    const saySmth = thingsToSay => speak(thingsToSay);

    const playSong = songName => socket.emit('newSong', `${songName.replace(/tupac/i, '2pac')}`);

    const pauseSong = () => socket.emit('song', 'pause');
    const resumeSong = () => socket.emit('song', 'resume');
    const nextSong = () => socket.emit('song', 'next');
    const previousSong = () => socket.emit('song', 'previous');
    const saveSong = () => socket.emit('song', 'save');
    const removeSong = () => socket.emit('song', 'remove');

    const refreshPage = () => socket.emit('page', 'refresh');

    // https://www.youtube.com/watch?v=ZORXxxP49G8 <- text to speech
    if(annyang)
    {
        const commands = {
            // 'play (me) *tag': playYoutube,
            // 'open *site': openSite,
            // 'search *phrase': searchPhrase
            'say *stuff': saySmth,
            'stop': pauseSong,
            'resume': resumeSong,
            'next (song)': nextSong,
            'previous (song)': previousSong,
            'save (song)': saveSong,
            'remove (song)': removeSong,
            'play *songName': playSong ,
            'refresh (page)': refreshPage
        }
        annyang.addCommands(commands);
        annyang.start();
    }
})();