import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// 문의하기
// Name: 2자 이상
// Email : Email형식
// Message: 5자 이상

export const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.NODEMAILER_AUTH_USER,
    pass: process.env.NODEMAILER_AUTH_PASS,
  },
} as SMTPTransport.Options);

export const sendEmail = async (
  name: string,
  email: string,
  message: string,
) => {
  try {
    await transporter.sendMail({
      from: `${name} <${process.env.NODEMAILER_FROM}>`,
      to: `스나이퍼팩토리 <${process.env.NODEMAILER_SENDER}>`,
      subject: "[1:1 문의] 안녕하세요 문의드립니다.",
      html: `
        <p>Name: ${name} </p>
        <p>Email: ${email} </p>
        <p>Message: ${message} </p>
        `,
    });
  } catch (error) {
    console.log(error);
  }
};
