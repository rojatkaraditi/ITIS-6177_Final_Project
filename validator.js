const constants = require('./constants');

exports.isValidMarket=(market)=>{
    if(constants.markets.hasOwnProperty(market)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidTrendingMarket=(market)=>{
    if(constants.trendingMarkets.hasOwnProperty(market)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidSafeSearch=(value)=>{
    if(constants.safeSearchOptions.includes(value)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidLanguage=(language)=>{
    if(constants.languages.hasOwnProperty(language)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidAspectRatio=(aspect)=>{
    if(constants.aspectRatioOptions.includes(aspect)){
         return true;
    }
    else{
        return false;
    }
};

exports.isValidEmbeddedValue=(value)=>{
    if(constants.embeddedOptions.includes(value)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidFreshnessValue=(value)=>{
    if(constants.freshnessOptions.includes(value)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidResolution=(resolution)=>{
    if(constants.resolutionOptions.includes(resolution)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidVideoLength=(videoLength)=>{
    if(constants.videoLengthOptions.includes(videoLength)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidPricing=(pricing)=>{
    if(constants.pricingOptions.includes(pricing)){
        return true;
    }
    else{
        return false;
    }
};

exports.isValidTextFormat=(format)=>{
    if(constants.textFormatOptions.includes(format)){
        return true;
    }
    else{
        return false;
    }
};

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