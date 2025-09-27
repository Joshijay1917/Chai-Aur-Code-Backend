import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Delete old uploaded Image - Pending

const updateUserAvatar = asyncHandler(async (req, res) => {
    
    let avatarLocalPath;
    if(req.file) {
        avatarLocalPath = req.file.path
    } else {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    if(!user) {
        throw new ApiError(500, "Failed to update file in database")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Successfully update avatar")
    )
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    
    const coverImageLocalPath = req.file.url;

    if(!coverImageLocalPath) {
        throw new ApiError(400, "CoverImage file is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url) {
        throw new ApiError(500, "Error while uploading coverImage")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Successfully update coverImage")
    )
})

export {
    updateUserAvatar,
    updateUserCoverImage
}