const Post =require("../models/post.js")
const fs=require("fs")
const formidable=require("formidable")
const _=require("lodash")
const User =require("../models/user.js")



exports.postById=(req,res,next,id)=>{
	Post.findById(id)
	.populate("postedBy","_id name role")
	.populate("comments","text created")
	.populate("comments.postedBy","_id name")
	.exec((err,post)=>{
		if (err || !post){
			return res.status(400).json({
				error:"no post found.."

			})
		}

		req.post=post
		next()

	})

}

exports.getPost=(req,res,next)=>{
	res.json(req.post)

}
exports.updatePost=(req,res)=>{
	const form=new formidable.IncomingForm()
	form.keepExtentions=true
	form.parse(req,(err,fields,files)=>{
		if(err){
			return res.status(400).json({
				error:"image could not uploaded.."
			})

		}
		let post=req.post
		post=_.extend(post,fields)
		
		if(files.photo){
			post.photo.data=fs.readFileSync(files.photo.path)
			post.photo.contentType=files.photo.type
		}
		post.save((err,result)=>{
			if(err){
				return res.status(400).json({
					error:err.message
				})

			}
			 res.status(200).json(result)


	})


}
)
}

exports.isPoster=(req,res,next)=>{
	let sameUser=req.post && req.auth && req.post.postedBy._id==req.auth._i
	let admminUser=req.post && req.auth && req.auth.role==="admin"
	const isPost =sameUser || admminUser
	console.log(req.post.postedBy._id)
	console.log(req.auth._id)
	
	
	if(!isPost){
		return res.status(403).json({
			error:"user not authorized..."
		})
		
	}
	next()
}
	
	exports.deletePost=(req,res)=>{
		let post =req.post
		post.remove((err,post)=>{
			if(err){
				return res.status(403).json({
			error:"unable to delete post..."
		})
				


			}
			res.status(200).json({
					message:"post deleted sucessfully..."
				})
		})
	}
	


exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .populate("comments", "text created")
        // .populate("comments.postedBy", "_id name")
        .select("_id title body created likes")
        .sort({ created: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};

exports.createPost=(req,res)=>{

	const form=new formidable.IncomingForm()
	form.keepExtentions=true
	form.parse(req,(err,fields,files)=>{
		if(err){
			return res.status(400).json({
				error:"image could not uploaded.."
			})

		}
		let post =new Post(fields)
		req.profile.hashed_password=undefined
		req.profile.salt=undefined
		post.postedBy=req.profile
		if(files.photo){
			post.photo.data=fs.readFileSync(files.photo.path)
			post.photo.contentType=files.photo.type
		}
		post.save((err,result)=>{
			if(err){
				return res.status(400).json({
					error:err.message
				})

			}
			 res.status(200).json(result)


	})

	
})
}

exports.postsByUser=(req,res)=>{
	Post.find({postedBy:req.profile._id})
	.populate("postedBy","id name")
	.select("_id title body created likes")
	.sort("_created")
	.exec((err,posts)=>{
		if(err){
				return res.status(400).json({
					error:err.message
				})

			}
			 res.status(200).json(posts)
	})

	}

	exports.photo=(req,res,next)=>{
		res.set("Content-Type",req.post.photo.contentType)
		return res.send(req.post.photo.data)


}


exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $push: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, { $pull: { likes: req.body.userId } }, { new: true }).exec(
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        }
    );
};
      

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;

    Post.findByIdAndUpdate(req.body.postId, { $push: { comments: comment } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;

    Post.findByIdAndUpdate(req.body.postId, { $pull: { comments: { _id: comment._id } } }, { new: true })
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            } else {
                res.json(result);
            }
        });
};   