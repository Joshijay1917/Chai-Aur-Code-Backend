import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadVideo = asyncHandler(async (req, res) => {

    const { title, discription, isPublished} = req.body;

    if(!req.user?._id) {
        throw new ApiError(400, "Unauthorized request")
    }

    let videoLocalPath, thumbnailLocalPath;
    if(req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        videoLocalPath = req.files.video[0].path
    }
    if(req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailLocalPath = req.files.thumbnail[0].path
    }

    if(!videoLocalPath) {
        throw new ApiError(404, "Video file not found")
    }
    if(!thumbnailLocalPath) {
        throw new ApiError(404, "thumbnail file not found")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    console.log("CloudinaryVIDEO ", video);
    

    if(!video || !thumbnail) {
        throw new ApiError(500, "Failed to upload on cloudinary")
    }

    const resVideo = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        discription,
        duration: video.duration,
        views: 0,
        isPublished,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, resVideo, "Video successfully uploaded")
    )
})

const updateViews = asyncHandler(async (req, res) => {
    const { title } = req.params

    if(!title) {
        throw new ApiError(400, "Title is required")
    }

    const video = await Video.findOne({title})
})

export {
    uploadVideo,
    updateViews
}