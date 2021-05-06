const User =require("../models/user.js")
const jwt=require("jsonwebtoken")
const _ = require("lodash");
const { sendEmail } = require("../helpers");
const expressJwt=require("express-jwt")
const secret ="hhhhhhhhhggvy7"
exports.signup=async(req,res)=>{

	const userExist =await User.findOne({
		email:req.body.email
	})

//if user exist return responce immediatetly...
	if (userExist){
		return res.status(403).json({
			error:"Email is already exist.."
		})
	}


	const user=await new User(req.body)
	await user.save()
	res.status(201).json({
		message:"Signup  succeeded..."
	})


}

exports.signin=async(req,res)=>{
	const user =await User.findOne({
		email:req.body.email
	})
	const {password}=req.body
	if (!user){
		return res.status(403).json({
			error:"User with that Email not exists..."
		})
	}
	if (!user.authenticate(password)){
		return res.status(403).json({
			error:" Email or Password not Correct ..."
		})

	}
	

	const token =jwt.sign({_id:user.id,role:user.role},secret)
	const {_id,name,email,role}=user

	res.cookie("t",token,{
		expire:new Date()+60*60*1000
	})
	return res.status(200).json({
		token,user:{
			_id,name,email,role
		}
	})

}

exports.signout=async(req,res)=>{
	res.clearCookie("t")
return	res.status(200).json({
	message:"Signout Successfully ..."
})
}
exports.requireSignin=expressJwt({
	secret:"hhhhhhhhhggvy7",
	algorithms: ['HS256'],
	userProperty:"auth"

})

exports.socialLogin = (req, res) => {
    // try signup by finding user with req.email
    let user = User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
            // create a new user and login
            user = new User(req.body);
            req.profile = user;
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                secret
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        } else {
            // update existing user with new social info and login
            req.profile = user;
            user = _.extend(user, req.body);
            user.updated = Date.now();
            user.save();
            // generate a token with user id and secret
            const token = jwt.sign(
                { _id: user._id, iss: "NODEAPI" },
                secret
            );
            res.cookie("t", token, { expire: new Date() + 9999 });
            // return response with user and token to frontend client
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
        }
    });
}



exports.forgotPassword = (req, res) => {
    if (!req.body) {return res.status(400).json({ message: "No request body" });}
    if (!req.body.email){
        return res.status(400).json({ message: "No Email in request body" });
    }

    console.log("forgot password finding user with that email");
    const { email } = req.body;
    console.log("signin req.body", email);
    // find the user based on email
    User.findOne({ email }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "User with that email does not exist!"
            });

        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, iss: "NODEAPI" },
           secret
        );

        // email data
        const emailData = {
            from: "noreply@node-react.com",
            to: email,
            subject: "Password Reset Instructions",
            text: `Please use the following link to reset your password:
               https://social-networkk.netlify.app/reset-password/${token}`,
            html: `<p>Please use the following link to reset your password:</p> <p>
                 https://social-networkk.netlify.app/reset-password/${token}</p>`
        };

        return user.updateOne({ resetPasswordLink: token }, (err, success) => {
            if (err) {
                return res.json({ message: err });
            } else {
                sendEmail(emailData);
                return res.status(200).json({
                    message: `Email has been sent to ${email}. Follow the instructions to reset your password.`
                });
            }
        });
    });
};

exports.resetPassword = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;

    User.findOne({ resetPasswordLink }, (err, user) => {
        // if err or no user
        if (err || !user)
            return res.status("401").json({
                error: "Invalid Link!"
            });

        const updatedFields = {
            password: newPassword,
            resetPasswordLink: ""
        };

        user = _.extend(user, updatedFields);
        user.updated = Date.now();

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({
                message: `Great! Now you can login with your new password.`
            });
        });
    });
};
