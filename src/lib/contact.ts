import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {
  NODEMAILER_AUTH_PASS,
  NODEMAILER_AUTH_USER,
  NODEMAILER_HOST,
  NODEMAILER_PORT,
  NODEMAILER_SENDER,
} from "./const";

export const transporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: NODEMAILER_AUTH_USER,
    pass: NODEMAILER_AUTH_PASS,
  },
} as SMTPTransport.Options);

export const sendEmail = async (
  name: string,
  email: string,
  message: string,
) => {
  try {
    await transporter.sendMail({
      from: `${name} <${email}>`,
      to: `스나이퍼팩토리 <${NODEMAILER_SENDER}>`,
      subject: "[1:1 문의] 안녕하세요 문의드립니다.",
      html: `
        <p> ${message} </p>
        `,
      replyTo: email,
    });
  } catch (error) {
    console.log(error);
  }
};
