const constants = require('./constants');

//function to check validity of market
exports.isValidMarket=(market)=>{
    if(constants.markets.hasOwnProperty(market)){
        return true;
    }
    else{
        return false;
    }
};

//function to check validity of markets for trending endpoint
exports.isValidTrendingMarket=(market)=>{
    if(constants.trendingMarkets.hasOwnProperty(market)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate the safe search option value
exports.isValidSafeSearch=(value)=>{
    if(constants.safeSearchOptions.includes(value)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate language selection
exports.isValidLanguage=(language)=>{
    if(constants.languages.hasOwnProperty(language)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate aspect ratio value
exports.isValidAspectRatio=(aspect)=>{
    if(constants.aspectRatioOptions.includes(aspect)){
         return true;
    }
    else{
        return false;
    }
};

//function to validate embeddedValue options
exports.isValidEmbeddedValue=(value)=>{
    if(constants.embeddedOptions.includes(value)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate freshness value
exports.isValidFreshnessValue=(value)=>{
    if(constants.freshnessOptions.includes(value)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate resolution value
exports.isValidResolution=(resolution)=>{
    if(constants.resolutionOptions.includes(resolution)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate video length value
exports.isValidVideoLength=(videoLength)=>{
    if(constants.videoLengthOptions.includes(videoLength)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate pricing value
exports.isValidPricing=(pricing)=>{
    if(constants.pricingOptions.includes(pricing)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate text format value
exports.isValidTextFormat=(format)=>{
    if(constants.textFormatOptions.includes(format)){
        return true;
    }
    else{
        return false;
    }
};

//function to validate to validate modules selected
exports.isValidModules=(modulesList)=>{
    if(typeof modulesList === 'string'){
        var modulesArr = modulesList.split(',');
        if(modulesArr.includes('All') && modulesArr.length > 1){
            return false;
        }
        else{
            for(var i=0;i<modulesArr.length;i++){
                if(!constants.modules.includes(modulesArr[i].trim())){
                    return false;
                }
            }
            return true;
        }
    }
    else{
        return false;
    }
};