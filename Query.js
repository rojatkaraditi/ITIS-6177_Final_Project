class Query{
    constructor(query,thumbnail){
        this.text = query.text;
        this.displayText = query.displayText;
        this.webSearchUrl = query.webSearchUrl;
        this.searchLink = query.searchLink;
        this.thumbnail = thumbnail;
    }
}

module.exports = Query;