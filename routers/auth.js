const express=require("express")
const router =express.Router()
const {signup,signin,signout,
forgotPassword,
    resetPassword, socialLogin}=require("../controllers/auth")
const {userById}=require("../controllers/user.js")
const {body}= require("express-validator")
	
const {userValidator,userpValidator}=require("../validator/index.js")


router.post('/signup',
	 [
	 body("name","Name is not mean't to be empty.").notEmpty(),
	body("name","Name should be high than 4 letter and less than 50 fucker.").isLength({
		min:4,
		max:50
	}),
	body("email","email is not mean't to be empty.").notEmpty(),
	body("email").isEmail().withMessage("please Enter A Valid Email").normalizeEmail(),
	body("password","password is not mean't to be empty.").notEmpty(),
	body("password","Password should be high than 6 letter and less than 20.").isLength({
		min:6,
		max:20

	}),
	body("password").matches(/\d/).withMessage("Password must contain a Number")





	],userValidator




	,signup)
router.post("/signin",signin)
router.get("/signout",signout)
router.post("/social-login", socialLogin);
router.put("/forgot-password", forgotPassword);

router.put("/reset-password",
	[body("newPassword","password is not mean't to be empty.").notEmpty(),
	body("newPassword","Password should be high than 6 letter and less than 20.").isLength({
		min:6,
		max:20

	}),
	body("newPassword").matches(/\d/).withMessage("Password must contain a Number")


],userpValidator, resetPassword);

router.param("userId",userById)


module.exports =router