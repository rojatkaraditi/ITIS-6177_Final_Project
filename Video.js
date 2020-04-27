class Video{
    constructor(video,creator,publishers,thumbnail){
        this.webSearchUrl = video.webSearchUrl;
        this.name = video.name;
        this.description = video.description;
        this.thumbnailUrl = video.thumbnailUrl;
        this.datePublished = video.datePublished;
        this.publisher = publishers;
        this.creator = creator;
        this.isAccessibleForFree = video.isAccessibleForFree;
        this.isFamilyFriendly = video.isFamilyFriendly;
        this.contentUrl = video.contentUrl;
        this.hostPageUrl = video.hostPageUrl;
        this.encodingFormat = video.encodingFormat;
        this.hostPageDisplayUrl = video.hostPageDisplayUrl;
        this.width = video.width,
        this.height = video.height,
        this.duration = video.duration;
        this.motionThumbnailUrl = video.motionThumbnailUrl;
        this.embedHtml = video.embedHtml;
        this.allowHttpsEmbed = video.allowHttpsEmbed;
        this.viewCount = video.viewCount,
        this.thumbnail = thumbnail;
        this.videoId = video.videoId;
        this.allowMobileEmbed = video.allowMobileEmbed;
        this.isSuperfresh = video.isSuperfresh;
    }
}

module.exports = Video;