const botVoice = window.speechSynthesis;
let voices = [];

if(botVoice.onvoiceschanged !== undefined)
    botVoice.onvoiceschanged = () => voices = botVoice.getVoices();

const speak = (thingToSay, voiceIndex = 3, voicePitch = .85, voiceRate = 1.05) => {
    return new Promise((res, rej) => {
        try 
        {
            if(isNaN(voiceIndex) || isNaN(voicePitch) || isNaN(voiceRate)) 
                throw new Error('Wprowadzono nieprawidłowe parametry!');
                
            if(botVoice.speaking) 
                throw new Error('Bot aktualnie przemawia!');
        
            if(thingToSay.length != '')
            {
                const speakText = new SpeechSynthesisUtterance(thingToSay);
                    speakText.onend = () => res('Skończyłem mówić :D');
                    speakText.voice = voices[voiceIndex];
                    speakText.pitch = voicePitch;
                    speakText.rate = voiceRate;
        
                botVoice.speak(speakText);
            }
        }
        catch(err)
        {
            rej(err);
        }
    });
};