require("dotenv").config();

module.exports = {
  secret: process.env.JWT_SECRET_ACCESS_KEY,
  emailUser: process.env.ADMIN_EMAIL,
  emailPassword: process.env.ADMIN_PASSWORD,
};
