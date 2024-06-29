import crypto from 'crypto'
import nodemailer from 'nodemailer'

export const random = () => crypto.randomBytes(128).toString('base64')
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac('sha256', [salt, password].join('/'))
    .update(process.env.secretKey)
    .digest('hex')
}

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 999999)
}

export const sendMail = (options: Record<string, any>) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.mail,
      pass: process.env.mailPass,
    },
  })

  transporter
    .sendMail(options)
    .then((info) => {
      console.log(info)
    })
    .catch((error) => {
      console.log(error)
    })
}
