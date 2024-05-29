export const sendToken = async (user, statusCode, res, message, next) => {
    try {
      const token = user.getJWTToken();
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(statusCode).json({
        token,
        user: userWithoutPassword,
        message,
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
  