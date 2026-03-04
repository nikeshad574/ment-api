require("dotenv").config();

export default {
  port: String(process.env.PORT),
  dbURI: String(process.env.DBURI),
  email: {
    user: String(process.env.EMAIL_USER),
    pass: String(process.env.EMAIL_PASS),
  },
};
