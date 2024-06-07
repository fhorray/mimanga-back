import type { CustomRequestData } from '@/types/types';

import type { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { userServices } from '@/services/userServices';

export const isAdminOrSelf = async (
  req: CustomRequestData,
  res: Response,
  next: NextFunction,
) => {
  try {
    // get the id comming from /:id & find the user.
    const id = req.params.id ?? req.session.passport?.user;
    const user = await userServices.findUserById(id as string);

    // get the id from loged user & find the user.
    const loggedUserId = req.session.passport?.user;
    const loggedUser = await userServices.findUserById(loggedUserId as string);

    console.log('\nID: ', id, '\nLOGED: ', loggedUserId);

    // verify if the user param ID is equal to the logged user ID
    if (!user || !loggedUser)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: 'UNAUTHORIZED: PLEASE LOGIN FIRST' });

    // verify if the user is admin or self, if one of this conditions is TRUE
    const isSelf = user.id !== loggedUser.id;
    const isAdmin = loggedUser.role !== 'admin';

    if (isAdmin && isSelf) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'FORBIDDEN: You are not authorized to access this resource',
      });
    }

    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'UNAUTHORIZED' });
  }
};