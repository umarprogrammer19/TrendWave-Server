import usersModels from "../models/users.models.js";
import bcrypt from "bcrypt";

// Sign Up Api 
export const signUp = async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname) return res.status(400).json({ message: "full Name is required" });
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!password) return res.status(400).json({ message: "password is required" });
    try {
        const user = await usersModels.findOne({ email })
        if (user) return res.status(400).json({ message: "user already exits" });

        await usersModels.create({ fullname, email, password });
        await transporter.sendMail({
            from: '"Umar Farooq 👻"',
            to: `${email}, ${process.env.EMAIL}`,
            subject: `Registration`,
            text: `Hello ${fullname} You Have Successfully Registered To Our ECommerce Stor`,
            html: `<br>Welcome ${fullname} <br/>We're thrilled to have you here. Explore, connect, and enjoy a seamless experience tailored just for you. If you need assistance, our team is here to help. Let's make great things happen together!</b> `,
        });

        res.status(200).json({ message: "user register successfully" })
    } catch (error) {
        res.status(400).json({ message: "error occured" })
        console.log(error);
    }
};

// Login Api 
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) return res.status(400).json({ message: "Email is Required" });
        if (!password) return res.status(400).json({ message: "Password is Required" });

        const user = await usersModels.findOne({ email });
        if (!user) return res.status(404).json({ message: "User Does Not Exists With This Email" });

        const isTruePassword = await bcrypt.compare(password, user.password);
        if (!isTruePassword) return res.status(400).json({ message: "Password Is Incorrect" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: '/'
        });

        res.status(200).json({
            message: "User Logged In Successfully",
            accessToken,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred during Login" });
    }
}

export const getUser = async (req, res) => {
    if (!req.user) return res.status(404).json({ message: "Please Login First" });
    try {
        const { email } = req.user;
        const userData = await usersModels.findOne({ email });
        res.status(200).json({
            message: "Successfully Get The User",
            user: {
                id: userData._id,
                fullname: userData.fullname,
                email: userData.email,
                orders: userData.orders
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred" });
    }
}