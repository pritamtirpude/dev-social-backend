import prisma from "../../db";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const createProfile = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;
  try {
    if (!firstName || !lastName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Firstname and Lastname are required",
      });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      const imageResult = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "dev-images",
        }
      );
      fs.unlinkSync(req.files.image.tempFilePath);
      imageUrl = imageResult.secure_url || "";
    }

    const profileData = await prisma.profile.create({
      data: {
        firstName,
        lastName,
        email,
        imageUrl,
        userId: req.user.id,
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Profile Saved Successfully",
      data: profileData,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  const { firstName, lastName, email } = req.body;

  const { id: profileId } = req.params;

  const isProfileUser = await prisma.profile.findFirst({
    where: {
      id: profileId,
    },
  });

  if (!isProfileUser) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: `Profile with id: ${profileId} not found`,
    });
    return;
  }

  try {
    if (!firstName || !lastName) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Firstname and Lastname are required",
      });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      const imageResult = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
          use_filename: true,
          folder: "dev-images",
        }
      );
      fs.unlinkSync(req.files.image.tempFilePath);
      imageUrl = imageResult.secure_url || "";
    }

    const profileData = await prisma.profile.update({
      where: {
        id_userId: {
          id: profileId,
          userId: req.user.id,
        },
      },
      data: {
        firstName,
        lastName,
        email,
        imageUrl,
      },
    });

    res.status(StatusCodes.OK).json({
      message: "Profile Updated Successfully",
      data: profileData,
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profileData = await prisma.profile.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(StatusCodes.OK).json({
      data: profileData,
    });
  } catch (error) {
    next(error);
  }
};

export { createProfile, getProfile, updateProfile };
