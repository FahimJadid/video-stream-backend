import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats of total video views, total subscribers, total videos, total likes etc.
   try {
    // Get the user's channel ID from the request
    const { channelId } = req.params;

    // Find the user by their channel ID
    const user = await User.findById(channelId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Get the total video views
    const totalVideoViews = await Video.aggregate([
      {
        $match: {
          owner: user._id,
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    // Get the total subscribers
    const totalSubscribers = await User.aggregate([
      {
        $match: {
          subscriptions: user._id,
        },
      },
      {
        $group: {
          _id: null,
          totalSubscribers: { $sum: 1 },
        },
      },
    ]);

    // Get the total videos
    const totalVideos = await Video.countDocuments({ owner: user._id });

    // Get the total likes
    const totalLikes = await Video.aggregate([
      {
        $match: {
          owner: user._id,
        },
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" },
        },
      },
    ]);

    // Return the channel stats
    return res.status(200).json(
      new ApiResponse(200, {
        totalVideoViews: totalVideoViews[0]?.totalViews || 0,
        totalSubscribers: totalSubscribers[0]?.totalSubscribers || 0,
        totalVideos,
        totalLikes: totalLikes[0]?.totalLikes || 0,
      }, "Channel stats fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch channel stats");
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  try {
    // Get the user's channel ID from the request
    const { channelId } = req.params;

    // Find the user by their channel ID
    const user = await User.findById(channelId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Get all the videos uploaded by the channel
    const videos = await Video.find({ owner: user._id });

    // Return the channel videos
    return res.status(200).json(
      new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Failed to fetch channel videos");
  }
});

export { getChannelStats, getChannelVideos };
