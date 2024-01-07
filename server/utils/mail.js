const path = require("path");
const nodeMailer = require('nodemailer');
// Environmental Variables
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const URL = process.env.CLIENT_HOST_URL
const { activationTemplate, forgotPasswordTemplate, userRoleChangedEmailTemplate, userBlockEmailTemplate } = require("./mailTemplates");

const trasporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    service: process.env.SMPT_SERVICE,
    auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
    },
});
// tarundevgan29.9.2003@gmail.com
// Sends Email For Activate Account
const activationEmail = async ({ to, token }) => {
    const message = {
        to: [to],
        from: process.env.SMPT_MAIL,
        subject: 'Activate your email account',
        html: activationTemplate(URL, token)
    }
    try {
        await trasporter.sendMail(message);
        console.log('Activation Link Email Sent...')
    } catch (err) {
        console.log(err)
    }
}

// Sends Email For Reset Password
const forgotPasswordEmail = async ({ to, token }) => {
    const message = {
        to: [to],
        from: process.env.SMPT_MAIL,
        subject: 'Activate your email account',
        html: forgotPasswordTemplate(URL, token)
    }
    try {
        await trasporter.sendMail(message);
        console.log('Reset Password Email Sent...')
    } catch (err) {
        console.log(err)
    }
}

// Sends Email when user role changed
const userRoleChangedEmail = async ({ to, isAdminNow }) => {
    const message = {
        to: [to],
        from: process.env.SMPT_MAIL,
        subject: 'Activate your email account',
        html: userRoleChangedEmailTemplate(URL, isAdminNow)
    }
    try {
        await trasporter.sendMail(message);
        console.log('User role changed Email Sent...')
    } catch (err) {
        console.log(err)
    }
}

// Sends Email when user block/unblock
const userBlockEmail = async ({ to, isBlockNow }) => {
    const message = {
        to: [to],
        from: process.env.SMPT_MAIL,
        subject: 'Activate your email account',
        html: userBlockEmailTemplate(URL, isBlockNow)
    }
    try {
        await trasporter.sendMail(message);
        console.log('User status changed Email Sent...')
    } catch (err) {
        console.log(err)
    }
}
module.exports = {
    activationEmail,
    forgotPasswordEmail,
    userRoleChangedEmail,
    userBlockEmail
}