import jwt from "jsonwebtoken";
import foodmodel from "../models/foodpartner.model.js";
import usermodel from "../models/auth.model.js";


export const bothAuth = async (req, res, next) => {
  try {

    console.log("========== BOTH AUTH ==========");
    console.log("COOKIES:", req.cookies);

    const userToken = req.cookies.refreshtoken;

    if (userToken) {
      try {

        console.log("USER TOKEN FOUND");

        const data = jwt.verify(
          userToken,
          process.env.JWT_SECRET
        );

        const user = await usermodel.findById(data.id);

        console.log("USER:", user);

        if (user) {
          req.user = {
            id: data.id,
            token: userToken
          };

          console.log("USER AUTH SUCCESS");

          return next();
        }

      } catch (error) {
        console.log("USER AUTH ERROR:", error.message);
      }
    }


    const foodPartnerToken =
      req.cookies.foodpartnerrefreshtoken;

    if (foodPartnerToken) {
      try {

        console.log("FOOD PARTNER TOKEN FOUND");

        const data = jwt.verify(
          foodPartnerToken,
          process.env.JWT_SECRET
        );

        console.log("FOOD JWT:", data);

        const foodPartner =
          await foodmodel.findById(data.id);

        console.log("FOOD PARTNER:", foodPartner);

        if (foodPartner) {

          req.foodPartner = data.id;

          console.log("FOOD PARTNER AUTH SUCCESS");

          return next();
        }

      } catch (error) {
        console.log(
          "FOOD PARTNER AUTH ERROR:",
          error.message
        );
      }
    }

    console.log("AUTH FAILED");

    return res.status(401).json({
      success: false,
      message: "Unauthorized user"
    });

  } catch (error) {
    next(error);
  }
};