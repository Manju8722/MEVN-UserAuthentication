const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports.register = async (req, res) => {

    const { userName, password, passwordConfirm, firstName, lastName, email } = req.body;

    if (!userName || !password || !passwordConfirm || !firstName || !lastName || !email) {
        return res.status(422).json({ "error": "All feilds are required" });
    }

    if (passwordConfirm !== password) {
        return res.status(422).json({ "error": "Password and Confirm password Not Matching" });
    }

    const existEmail = await User.findOne({ email }).exec();

    if (existEmail) {
        return res.status(422).json({ "error": "Email alraedy exist" });

    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            email, password: hashedPassword, firstName: firstName, lastName: lastName, userName
        });

        res.status(201).json({ "message": "Profile created successfully" })
    } catch (errors) {

        return res.status(422).json(errors);
    }

}

module.exports.login = async (req, res) => {

    const { password, email } = req.body;

    if (!password || !email) {
        return res.status(422).json({ "error": "All feilds are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(422).json({ "error": "Email Id Is not Found" });
    }

    try {
        const is_password_correct = await bcrypt.compare(password, user.password);
        if (!is_password_correct) {
            return res.status(422).json({ "error": "Incorrect Password " });
        }

        const access_token = await jwt.sign({
            id: user.id,

        }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: 1800
        });

        const refresh_token = await jwt.sign({
            id: user.id,

        }, process.env.REFRESH_TOKEN_KEY, {
            expiresIn: 1000 * 60 * 60 * 24 * 30
        });

        user.refresh_token = refresh_token;
        await user.save();

        res.cookie('refresh_token', refresh_token, {

            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
            sameSite: 'None', secure: true

        });
        res.status(200).json({ access_token: access_token });


    } catch (errors) {

        return res.status(422).json(errors);
    }


}

module.exports.logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refresh_token) {
        return res.status(422).json({ errors: "Cookies Not exists" });
    }

    const user = await User.findOne({ refresh_token: cookies.refresh_token }).exec();
    if (!user) {
        res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });
        return res.status(422).json({ errors: "User Not exists" });
    }

    user.refresh_token = null;

    await user.save();

    res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'None', secure: true });

    return res.status(204).json({ Message: "Logout Succesfully done" });

}

// SUM: to get new accese token if expires
module.exports.refresh = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies.refresh_token) {
        return res.status(422).json({ errors: "Cookies Not exists" });
    }
    const refreshToken = cookies.refresh_token;
    const user = await User.findOne({
        refresh_token: refreshToken
    })

    if (!user) {
        return res.status(422).json({ errors: "User Not exists" });
    }
    await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, async (err, decoded) => {

        if (err || decoded.id !== user.id
        ) {
            return res.status(422).json({ errors: "User Not exists" });
        }

        const access_token = await jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: 1800
        });

        return res.status(200).json({ access_token: access_token });
    })

}

module.exports.user = (req, res) => {

    res.status(200).json(req.user);
}