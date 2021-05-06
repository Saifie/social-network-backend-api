const express=require("express")
const router=express.Router()
const {getPosts,
	createPost,
	postsByUser,
	postById,isPoster,
	deletePost,getPost,
	updatePost,
	photo,
like,unlike,
comment,uncomment}=require("../controllers/post.js")
const {requireSignin}=require("../controllers/auth.js")
const {userById}=require("../controllers/user.js")

const {body}=require("express-validator")

const {postValidator}=require("../validator/index.js")

router.get("/postings",getPosts)

router.post("/post/new/:userId",createPost,requireSignin,
	//validation server side.....
	[body("title","title is empty fucker.").notEmpty(),
	body("title","title should be high than 4 letter and less than 180 fucker.").isLength({
		min:4,
		max:180
	}),

	body("body","body is empty fucker.").notEmpty(),
	body("body","body should be high than 4 letter and less than 2000 fucker.").isLength({
		min:4,
		max:2000
	})],postValidator

	)

router.get("/posts/by/:userId",requireSignin,postsByUser)
router.get("/posts/:postId",getPost)
router.put("/posts/:postId",requireSignin,updatePost)
router.delete("/posts/:postId",requireSignin,isPoster,deletePost)


router.put("/post/like",requireSignin,like)
router.put("/post/unlike",requireSignin,unlike)

router.put("/post/comment",requireSignin,comment)
router.put("/post/uncomment",requireSignin,uncomment)

router.get("/post/photo/:postId",photo)
router.param("userId",userById)
router.param("postId",postById)
module.exports=router