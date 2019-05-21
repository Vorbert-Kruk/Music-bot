String.prototype.makeYoutubeQuery = function() {
    return `https://www.youtube.com/results?search_query=${this.split(' ').join('+')}`;
};

module.exports;