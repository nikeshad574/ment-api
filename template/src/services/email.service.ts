import nodemailer from "nodemailer";
import conf from "../conf/conf";

interface IOptions {
  email: string;
  subject: string;
  message: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: conf.email.user,
    pass: conf.email.pass,
  },
} as nodemailer.TransportOptions);

const sendEmail = async (options: IOptions) => {
  const mailOptions = {
    from: conf.email.user,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };
  await transporter.sendMail(mailOptions);
};

export default { sendEmail };
