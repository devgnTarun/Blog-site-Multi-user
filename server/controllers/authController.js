const asyncHandler = require("express-async-handler");
const { validateRegisterInput } = require("../utils/validators");
const bcryptjs = require("bcryptjs");
const { activationEmail, forgotPasswordEmail } = require("../utils/mail");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const JWT_RESET_KEY = process.env.JWT_RESET_KEY

const User = require("../models/User");

// @Desc    Register New user through formdata
// @Route   /auth/register
// @Access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validating Data
    const validate = validateRegisterInput(email, name, password);

    if (!validate.valid) {
        res.status(400)
        throw new Error(JSON.stringify(validate.errors))
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'User Already exists' }))
    }

    // Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Save user in database
    const user = new User({
        name,
        email,
        password: hashedPassword
    })

    await user.save();

    // Generate Token
    const token = generateToken(user._id);

    // Send Confirmation/Activation Email 
    activationEmail({ to: user.email.trim(), token });

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
})

// @Desc    Login User through formdata
// @Route   /auth/login
// @Access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such user exists' }))
    }

    // Verify Password
    const isMatch = await bcryptjs.compare(password, userExists.password);
    if (!isMatch) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Incorrect Password' }))
    }

    res.json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        token: generateToken(userExists._id)
    });
})

// @Desc    Activate User Account
// @Route   /auth/activate/:token
// @Access  Public
const activateAccount = asyncHandler(async (req, res) => {

    //Token
    const token = req.params.token;

    try {
        const decoded = await jwt.verify(token, JWT_SECRET_KEY);
        const userExists = await User.findById(decoded.id).select('-password');

        if (!userExists) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'Invalid Link' }))
        }

        if (userExists.isActivated) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'User account already activated' }))
        }

        // Set isActivated Property to true
        userExists.isActivated = true;
        await userExists.save();

        res.json(userExists);

    } catch (e) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Invalid/Expired Link' }))
    }
})

// @Desc    Forgot Password Link ( Email Sending )
// @Route   /auth/forgotpassword
// @Access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user with that email exists
    const userExists = await User.findOne({ email });

    if (!userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such user exists' }))
    }

    // Generate token
    const payload = { id: userExists._id };
    const token = jwt.sign(payload, JWT_RESET_KEY, { expiresIn: '10m' })

    // Send Reset Password Email
    forgotPasswordEmail({ to: userExists.email, token })

    res.status(200).json({ msg: 'Reset Password Link sent' });
})

// @Desc    Reset Password ( After Mail Sent )
// @Route   /auth/resetpassword/:token
// @Access  Public
const resetPassword = asyncHandler(async (req, res) => {
    try {
        const token = req.params.token;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.trim().length < 6) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'Password must be length of greater than 6' }))
        }

        const decoded = await jwt.verify(token, JWT_RESET_KEY);

        // Check if user exists for that id 
        const userExists = await User.findById(decoded.id);

        if (!userExists) {
            res.status(400)
            throw new Error(JSON.stringify({ err: 'No such user exists' }))
        }

        // Hash Password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        userExists.password = hashedPassword;
        await userExists.save();

        res.status(200).json({ msg: 'Passord reset successfully' });

    } catch (err) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'Invalid/Expired Link' }))
    }
})


// @Desc    Send Activation Link If Normal Activation Link Expires
// @Route   /auth/send-activation-link
// @Access  Private
const sendActivationLink = asyncHandler(async (req, res) => {
    // Check if user find with that id
    const userExists = await User.findById(req.user._id);

    if (!userExists) {
        res.status(400)
        throw new Error(JSON.stringify({ err: 'No such user exists' }))
    }

    const token = generateToken(req.user._id);
    activationEmail({ to: userExists.email, token })

    res.status(200).json({ msg: 'Activation Link Sent' });

})


// Generate Token
const generateToken = (id) => {
    const payload = { id };
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' })
}

module.exports = {
    register,
    login,
    activateAccount,
    sendActivationLink,
    forgotPassword,
    resetPassword
}