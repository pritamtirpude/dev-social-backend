import { StatusCodes } from "http-status-codes";
import prisma from "../../db";

const createLinks = async (req, res, next) => {
  const { platform, link } = req.body;

  try {
    if (!platform || !link) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Please provide platform and link",
      });
      return;
    }

    await prisma.socialLink.create({
      data: {
        platform,
        link,
        userId: req.user.id,
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Social Link Added Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getAllLinks = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const userLinks = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        SocialLink: true,
      },
    });

    res.status(StatusCodes.OK).json({
      data: userLinks.SocialLink,
    });
  } catch (error) {
    next(error);
  }
};

const deleteLink = async (req, res, next) => {
  const { id: linkId } = req.params;

  try {
    const link = await prisma.socialLink.findFirst({
      where: {
        id: linkId,
      },
    });

    if (!link) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: `No Link with id: ${linkId}`,
      });
      return;
    }

    await prisma.socialLink.delete({
      where: {
        id: linkId,
        id_userId: {
          id: linkId,
          userId: req.user.id,
        },
      },
    });

    res.status(StatusCodes.OK).json({
      message: "Social Link Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { createLinks, deleteLink, getAllLinks };
