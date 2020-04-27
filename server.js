const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require("body-parser");
var expressValidator = require('express-validator');
var validator = require('./validator');
var constants = require('./constants');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
var Creator = require('./Creator');
var Publisher = require('./Publisher');
var Thumbnail = require('./Thumbnail');
var Video = require('./Video');
var ThumbnailUrlObj = require('./ThumbnailUrl');
var QueryObj = require('./Query');
var PivotSuggestion = require('./PivotSuggestion');


app = express();


//defining middleware
app.use('/api.videosearch.docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(expressValidator({
    customValidators: {
        isValidMarket : validator.isValidMarket,
        isValidSafeSearch : validator.isValidSafeSearch,
        isValidLanguage : validator.isValidLanguage,
        isValidAspectRatio : validator.isValidAspectRatio,
        isValidEmbeddedValue : validator.isValidEmbeddedValue,
        isValidFreshnessValue : validator.isValidFreshnessValue,
        isValidResolution : validator.isValidResolution,
        isValidVideoLength : validator.isValidVideoLength,
        isValidPricing : validator.isValidPricing,
        isValidTextFormat :  validator.isValidTextFormat,
        isValidModules : validator.isValidModules,
        isValidTrendingMarket: validator.isValidTrendingMarket
    }
}));

//defining required values
var ip = "45.55.61.84";
var port = 3000;
var version = "v1.0";
var url = "/api/"+version+"/videos";
const accessKey = "c433209098f7458ca1c1d76c44070b86";
var baseUrl = "https://aditi-rojatkar.cognitiveservices.azure.com/bing/v7.0/videos";

let requestHeader = {
    headers:{
        'Ocp-Apim-Subscription-Key' : accessKey
    }
};

//endpoint to get videos by search query and other paramaters
app.get(url+'/search',(request,response)=>{
    var queryString = request.query;
    var queryParams = '';

    //input sanitization and validation

    request.checkQuery('searchQuery','Search query must be specified').notEmpty().trim().escape();

    var queryError = request.validationErrors();

    if(!queryError){
        queryParams = "?q="+queryString.searchQuery.trim();
    }

    if(queryString.count){
        request.checkQuery('count','Count must be an integer value and should be less than or equal to 105 and greater than 0').isInt({gt:0,lt:106}).trim().escape();
        queryParams = queryParams.concat('&count=',queryString.count);
    }
    if(queryString.offset){
        request.checkQuery('offset','Offset must be an integer value').isInt().trim().escape();
        request.checkQuery('count','Offset should not be present without count').notEmpty().trim().escape();
        queryParams = queryParams.concat('&offset=',queryString.offset);
    }
    if(queryString.market){
        request.checkQuery('market','Market value is invalid. Valid options are: '+Object.keys(constants.markets)).isValidMarket().trim();
        queryParams = queryParams.concat('&mkt=',constants.markets[queryString.market.trim()]);
    }
    if(queryString.safeSearch){
        request.checkQuery('safeSearch','SafeSearch value should be alphabetical values').isAlpha().trim().escape();
        request.checkQuery('safeSearch','Invalid safe search option. Valid options are: '+constants.safeSearchOptions).isValidSafeSearch().trim().escape();
        queryParams = queryParams.concat('&safeSearch=',queryString.safeSearch.trim());
    }
    if(queryString.setLanguage){
        request.checkQuery('setLanguage','Language is invalid. Valid options are: '+Object.keys(constants.languages)).isValidLanguage().trim().escape();
        queryParams = queryParams.concat('&setLang=',constants.languages[queryString.setLanguage.trim()]);
    }
    if(queryString.aspectRatio){
        request.checkQuery('aspectRatio','Aspect ration should be alphabetiucal value').isAlpha().trim().escape();
        request.checkQuery('aspectRatio','Invalid acpect ration option. Valid options are: '+constants.aspectRatioOptions).isValidAspectRatio().trim().escape();
        queryParams = queryParams.concat('&aspect=',queryString.aspectRatio.trim());
    }
    if(queryString.embedded){
        request.checkQuery('embedded','Embedded option value should be alphabetical').isAlpha().trim().escape();
        request.checkQuery('embedded','Invalid embedded option value. Valid options are: '+constants.embeddedOptions).isValidEmbeddedValue().trim().escape();
        queryParams = queryParams.concat('&embedded=',queryString.embedded.trim());
    }
    if(queryString.freshness){
        request.checkQuery('freshness','Freshness option value should be alphabetical').isAlpha().trim().escape();
        request.checkQuery('freshness','Invalid freshness option value. Valid options are: '+constants.freshnessOptions).isValidFreshnessValue().trim().escape();
        queryParams = queryParams.concat('&freshness=',queryString.freshness.trim());
    }
    if(queryString.resolution){
        request.checkQuery('resolution','Invalid resolution option value. Valid options are: '+constants.resolutionOptions).isValidResolution().trim().escape();
        queryParams = queryParams.concat('&resolution=',queryString.resolution.trim());
    }
    if(queryString.videoLength){
        request.checkQuery('videoLength','Video Length option value should be alphabetical').isAlpha().trim().escape();
        request.checkQuery('videoLength','Invalid video length option value. Valid options are: '+constants.videoLengthOptions).isValidVideoLength().trim().escape();
        queryParams = queryParams.concat('&videoLength=',queryString.videoLength.trim());
    }
    if(queryString.pricing){
        request.checkQuery('pricing','Pricing option value should be alphabetical').isAlpha().trim().escape();
        request.checkQuery('pricing','Invalid pricing option value. Valid options are: '+constants.pricingOptions).isValidPricing().trim().escape();
        queryParams = queryParams.concat('&pricing=',queryString.pricing.trim());
    }
    if(queryString.textDecorations){
        request.checkQuery('textDecorations','TextDecorations can have only boolean value').isBoolean().trim().escape();
        queryParams = queryParams.concat('&textDecorations=',queryString.textDecorations.trim());
    }
    if(queryString.textFormat){
        request.checkQuery('textFormat','TextFormat option value should be alphabetical').isAlpha().trim().escape();
        request.checkQuery('textFormat','Invalid textFormat option value. Valid options are: '+constants.textFormatOptions).isValidTextFormat().trim().escape();
        queryParams = queryParams.concat('&textFormat=',queryString.textFormat.trim());
    }

    var errors = request.validationErrors();

    if(!errors){
        var url = baseUrl+'/search'+queryParams;
        //making call to azure to fetch data
        axios.get(encodeURI(url),requestHeader).then(resp=>{

            //data transformation
            var result = resp.data;
            var videoValues = [];
            var queryExpansions = [];
            var pivotSuggestions = [];
            var relatedSearches = []; 

            if(result.value && result.value.length>0){
                result.value.forEach(video=>{
                    var creator = {};
                    var publisher = [];
                    var thumbnail = {};
                    if(video.creator){
                        creator = new Creator(video.creator);
                    }
                    if(video.thumbnail){
                        thumbnail = new Thumbnail(video.thumbnail);
                    }
                    if(video.publisher && video.publisher.length>0){
                        video.publisher.forEach(pub => {
                            var publish = new Publisher(pub);
                            publisher.push(publish);
                        });
                    }
                     
                    var vid = new Video(video,creator,publisher,thumbnail);

                    videoValues.push(vid);

                });
            }

            if(result.queryExpansions && result.queryExpansions.length>0){
                result.queryExpansions.forEach(query => {
                    var thumbnailUrl = {};
                    if(query.thumbnail){
                        thumbnailUrl = new ThumbnailUrlObj(query.thumbnail);
                    }
                    var qObj = new QueryObj(query,thumbnailUrl);
                    queryExpansions.push(qObj);
                });
            }

            if(result.pivotSuggestions && result.pivotSuggestions.length>0){
                result.pivotSuggestions.forEach(pivot=>{
                    var suggestions = [];
                    if(pivot.suggestions && pivot.suggestions.length>0){
                        pivot.suggestions.forEach(suggestion => {
                            var thumbnailUrl = {};
                            if(suggestion.thumbnail){
                                thumbnailUrl = new ThumbnailUrlObj(suggestion.thumbnail);
                            }
                            var qObj = new QueryObj(suggestion,thumbnailUrl);
                            suggestions.push(qObj);
                        });
                    }
                    
                    var pivSuggestions = new PivotSuggestion(pivot.pivot,suggestions);
                    pivotSuggestions.push(pivSuggestions);
                });
            }

            if(result.relatedSearches && result.relatedSearches.length>0){
                result.relatedSearches.forEach(query => {
                    var thumbnailUrl = {};
                    if(query.thumbnail){
                        thumbnailUrl = new ThumbnailUrlObj(query.thumbnail);
                    }
                    var qObj = new QueryObj(query,thumbnailUrl);
                    relatedSearches.push(qObj);
                });
            }

            var res = {
                'azureReadLink' : result.readLink,
                'webSearchUrl' : result.webSearchUrl,
                'totalEstimatedMatches' : result.totalEstimatedMatches,
                'videos' : videoValues,
                'currentOffset' : result.currentOffset,
                'nextOffset' : result.nextOffset,
                'queryExpansions' : queryExpansions,
                'pivotSuggestions' : pivotSuggestions,
                'relatedSearches' : relatedSearches
            }
            
            var result = {
                'results' : res,
                'links':getLinks()
            };

            //send response
            response.status(resp.status).json(result);
        }).catch(error=>{
            if(error.response){
                //data transformation
                var result = {
                    'errors' : error.response.data,
                    'links':getLinks()
                };
                //send response
                response.status(error.response.status).json(result);
            }
            else{
                //data transformation
                var result = {
                    'errors' : error,
                    'links':getLinks()
                };
                //send response
                response.status(500).json(result);
            }
        });
    }
    else{
        //Data Transformation
        var result = {
            'errors': errors,
            'links':getLinks()
        }
        //send response
        response.status(400).json(result);
    }
});

app.get(url+'/details',(request,response)=>{
    var queryString = request.query;
    var queryParams = '';

    //input sanitization and validation
    request.checkQuery('videoId','Video ID must be specified').notEmpty().trim().escape();
    request.checkQuery('modules','Modules must be specified').notEmpty().trim().escape();
    request.checkQuery('modules','Invalid modules values. Module values should be a comma separated list of values: '+constants.modules+'. If using \'All\' value, no other value must be specified in the list').isValidModules().trim().escape();

    var queryError = request.validationErrors();

    if(!queryError){
        queryParams = "?id="+queryString.videoId.trim();
        queryParams = queryParams.concat('&modules=',trimArray(queryString.modules.trim()));
    }

    if(queryString.searchQuery){
        queryParams = queryParams.concat('&q=',queryString.searchQuery.trim());
    }
    if(queryString.count){
        request.checkQuery('count','Count must be an integer value and should be less than or equal to 105 and greater than 0').isInt({gt:0,lt:106}).trim().escape();
        queryParams = queryParams.concat('&count=',queryString.count);
    }
    if(queryString.offset){
        request.checkQuery('offset','Offset must be an integer value').isInt().trim().escape();
        request.checkQuery('count','Offset should not be present without count').notEmpty().trim().escape();
        queryParams = queryParams.concat('&offset=',queryString.offset);
    }
    if(queryString.market){
        request.checkQuery('market','Market value is invalid. Valid options are: '+Object.keys(constants.markets)).isValidMarket().trim();
        queryParams = queryParams.concat('&mkt=',constants.markets[queryString.market.trim()]);
    }
    if(queryString.safeSearch){
        request.checkQuery('safeSearch','SafeSearch value should be alphabetical values').isAlpha().trim().escape();
        request.checkQuery('safeSearch','Invalid safe search option. Valid options are: '+constants.safeSearchOptions).isValidSafeSearch().trim().escape();
        queryParams = queryParams.concat('&safeSearch=',queryString.safeSearch.trim());
    }
    if(queryString.setLanguage){
        request.checkQuery('setLanguage','Language is invalid. Valid options are: '+Object.keys(constants.languages)).isValidLanguage().trim().escape();
        queryParams = queryParams.concat('&setLang=',constants.languages[queryString.setLanguage.trim()]);
    }
    if(queryString.textDecorations){
        request.checkQuery('textDecorations','TextDecorations can have only boolean value').isBoolean().trim().escape();
        queryParams = queryParams.concat('&textDecorations=',queryString.textDecorations.trim());
    }
    if(queryString.textFormat){
        request.checkQuery('textFormat','TextFormat option value should be alphabetical').isAlpha().trim().escape();
        request.checkQuery('textFormat','Invalid textFormat option value. Valid options are: '+constants.textFormatOptions).isValidTextFormat().trim().escape();
        queryParams = queryParams.concat('&textFormat=',queryString.textFormat.trim());
    }

    var errors = request.validationErrors();

    if(!errors){
        var url = baseUrl+'/details'+queryParams;
        //make call to azure fetch video details
        axios.get(encodeURI(url),requestHeader).then(resp=>{

            //data transformation
            var result = resp.data;

            var  videoValues = [];
            var videoResult = {};
            var res = {};

            if(result.relatedVideos){
                if(result.relatedVideos.value && result.relatedVideos.value.length>0){
                    result.relatedVideos.value.forEach(video=>{
                        var creator = {};
                        var publisher = [];
                        var thumbnail = {};
                        if(video.creator){
                            creator = new Creator(video.creator);
                        }
                        if(video.thumbnail){
                            thumbnail = new Thumbnail(video.thumbnail);
                        }
                        if(video.publisher && video.publisher.length>0){
                            video.publisher.forEach(pub => {
                                var publish = new Publisher(pub);
                                publisher.push(publish);
                            });
                        }
                         
                        var vid = new Video(video,creator,publisher,thumbnail);
    
                        videoValues.push(vid);
    
                    });

                    var relatedVideoValues = {'videos':videoValues};
                    res.relatedVideos = relatedVideoValues;
                }
            }

            if(result.videoResult){
                var video = result.videoResult;
                var creator = {};
                var publisher = [];
                var thumbnail = {};
                if(video.creator){
                    creator = new Creator(video.creator);
                }
                if(video.thumbnail){
                    thumbnail = new Thumbnail(video.thumbnail);
                }
                if(video.publisher && video.publisher.length>0){
                    video.publisher.forEach(pub => {
                        var publish = new Publisher(pub);
                        publisher.push(publish);
                    });
                }
                    
                videoResult = new Video(video,creator,publisher,thumbnail);
                res.videoResult = videoResult;
            }

            var result = {
                'results' : res,
                'links':getLinks()
            };
            //send response
            response.status(resp.status).json(result);
        }).catch(error=>{
            if(error.response){
                //data transformation
                var result = {
                    'errors' : error.response.data,
                    'links':getLinks()
                };
                //send response
                response.status(error.response.status).json(result);
            }
            else{
                //data transformation
                var result = {
                    'errors' : error,
                    'links':getLinks()
                };
                //send response
                response.status(500).json(result);
            }
        });
    }
    else{
        //Data Transformation
        var result = {
            'errors': errors,
            'links':getLinks()
        }
        //send response
        response.status(400).json(result);
    }
});

app.get(url+'/trending',(request,response)=>{
    var queryString = request.query;
    var queryParams = "";

    //input sanitization and validation
    if(queryString.market){
        request.checkQuery('market','Market value is invalid. Valid options are: '+Object.keys(constants.trendingMarkets)).isValidTrendingMarket().trim(); 
        if(queryParams){
            queryParams = queryParams.concat('&mkt=',constants.trendingMarkets[queryString.market.trim()]);
        }
        else{
            queryParams = '?mkt='+constants.trendingMarkets[queryString.market.trim()];
        }
    }
    if(queryString.safeSearch){
        request.checkQuery('safeSearch','SafeSearch value should be alphabetical values').isAlpha().trim().escape();
        request.checkQuery('safeSearch','Invalid safe search option. Valid options are: '+constants.safeSearchOptions).isValidSafeSearch().trim().escape();
        if(queryParams){
            queryParams = queryParams.concat('&safeSearch=',queryString.safeSearch.trim());
        }
        else{
            queryParams = '?safeSearch='+queryString.safeSearch.trim();
        }
    }
    if(queryString.setLanguage){
        request.checkQuery('setLanguage','Language is invalid. Valid options are: '+Object.keys(constants.languages)).isValidLanguage().trim().escape();
        if(queryParams){
            queryParams = queryParams.concat('&setLang=',constants.languages[queryString.setLanguage.trim()]);
        }
        else{
            queryParams = '?setLang='+constants.languages[queryString.setLanguage.trim()];
        }
    }
    if(queryString.textDecorations){
        request.checkQuery('textDecorations','TextDecorations can have only boolean value').isBoolean().trim().escape();
        if(queryParams){
            queryParams = queryParams.concat('&textDecorations=',queryString.textDecorations.trim());
        }
        else{
            queryParams = '?textDecorations='+queryString.textDecorations.trim();
        }
    }
    if(queryString.textFormat){
        request.checkQuery('textFormat','TextFormat option value should be alphabetical').isAlpha().trim().escape();
        request.checkQuery('textFormat','Invalid textFormat option value. Valid options are: '+constants.textFormatOptions).isValidTextFormat().trim().escape();
        if(queryParams){
            queryParams = queryParams.concat('&textFormat=',queryString.textFormat.trim());
        }
        else{
            queryParams = '?textFormat='+queryString.textFormat.trim();
        }
    }

    var errors = request.validationErrors();

    if(!errors){
        var url = baseUrl+'/trending'+queryParams;
        //make call to azure to fetch data
        axios.get(encodeURI(url),requestHeader).then(resp=>{

            //data transformation
            var result = resp.data;

            var res = {
                'bannerTiles' : result.bannerTiles,
                'categories' : result.categories
            };

            var result = {
                'results' : res,
                'links':getLinks()
            };
            //send result
            response.status(resp.status).json(result);
        }).catch(error=>{
            if(error.response){
                //data transformation
                var result = {
                    'errors' : error.response.data,
                    'links':getLinks()
                };
                //send response
                response.status(error.response.status).json(result);
            }
            else{
                //data transformation
                var result = {
                    'errors' : error,
                    'links':getLinks()
                };
                //send response
                response.status(500).json(result);
            }
        });
    }
    else{
        //Data Transformation
        var result = {
            'errors': errors,
            'links':getLinks()
        }
        //send response
        response.status(400).json(result);
    }

});


app.listen(port,()=>{
    console.log("Listening on port: "+port);
});

//getlinks function to support HATEOAS
getLinks=()=>{
    var links = [
        {
            "method" : "get",
            "href" : "http://"+ip+":3000/api/v1.0/videos/search"
        },
        {
            "method" : "get",
            "href" : "http://"+ip+":3000/api/v1.0/videos/details"
        },
        {
            "method" : "get",
            "href" : "http://"+ip+":3000/api/v1.0/videos/trending"
        }
    ];
    return links;
}

trimArray=(str)=>{
    var arr = str.split(',');
    var targetStr = '';
    for(var i=0;i<arr.length;i++){
        if(i==arr.length-1){
            targetStr = targetStr.concat(arr[i].trim());
        }
        else{
            targetStr = targetStr.concat(arr[i].trim(),',');
        }
    }
    return targetStr;
}