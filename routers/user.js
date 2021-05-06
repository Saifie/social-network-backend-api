const express=require("express")
const router =express.Router()

const {
	userById,
	getUsers,getUser,
	updateUser,
	deleteUser
	,userPhoto,
	addFollowing,
	addFollower,
	removeFollowing,
	removeFollower,
	hasAuthorization,
	findPeople
}=require("../controllers/user.js")
const {requireSignin}=require("../controllers/auth.js")

router.put("/user/follow",requireSignin,addFollowing,addFollower)
router.put("/user/unfollow",requireSignin,removeFollowing,removeFollower)
router.get("/users",getUsers)
router.get("/user/:userId",requireSignin,getUser)
router.param("userId",userById)
router.get("/user/findpeople/:userId", requireSignin,findPeople)

router.put("/user/:userId",requireSignin,hasAuthorization,updateUser)
router.delete("/user/:userId",requireSignin,hasAuthorization,deleteUser)

router.get("/user/photo/:userId",userPhoto)

module.exports=router

