const _= require("lodash")
const User =require("../models/user.js")
const formidable=require("formidable")
const fs=require("fs")
exports.userById= (req,res,next,id)=>{
	User.findById(id)
        // populate followers and following users array
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'User not found'
                });
            }
            req.profile = user; // adds profile object in req with user info
            next();
        });
};

exports.hasAuthorization=(req,res,next)=>{
	let sameUser=req.profile && req.auth && req.profile._id==req.auth._id
	let adminUser=req.profile && req.auth && req.auth.role==="admin"
	const authorized =sameUser || adminUser
	if(!authorized){
		return res.status(403).json({
			error:"user not authorized..."
		})
		next()
	}
	

}

exports.getUsers=(req,res)=>{
	User.find().select("id name email updated created role").then(users=>{
		return res.status(200).json(users)
	}).catch(err=>{
		res.status(400).json({
			error:"something went wrong with fetching users.."
		})
	})
}

exports.getUser=(req,res)=>{
	req.profile.hashed_password=undefined
	req.profile.salt=undefined
	return res.json(req.profile)
}

// exports.updateUser=(req,res)=>{
	
// 	let user=req.profile
// 	 user=_.extend(user,req.body)
// 	 user.updated=Date.now()
// 	 user.save(err=>{
// 	 	if (err){
// 	 		return res.stat(400).json({
// 		error:"unabele to update..."
// 	})

// 	 	}
// 	 	user.hashed_password=undefined
// 		user.salt=undefined
// 	 	res.status(200).json(user)
// 	 })
	
// }



exports.updateUser=(req,res,next)=>{
	let form =new formidable.IncomingForm()
	form.keepExtentions=true
	form.parse(req,(err,fields,files)=>{
		if(err){
			return res.status(402).json({
				error:"photo not uploaded"

			})
		}
		let user=req.profile
		user=_.extend(user,fields)
		user.updated=Date.now()
		if(files.photo){
			user.photo.data=fs.readFileSync(files.photo.path)
			user.photo.contentType=files.photo.type
		}
		user.save((err,result)=>{
			if(err){
				return res.status(402).json({
				error:err

			})
			}
			user.hashed_password=undefined
			user.salt=undefined
			res.json(user)


		})

	})
	
	
	
}

exports.userPhoto=(req,res,next)=>{
	if(req.profile.photo.data){
		res.set("Content-Type",req.profile.photo.contentType)
		return res.send(req.profile.photo.data)
	}
	next()

}

exports.deleteUser=(req,res)=>{
	
	let user=req.profile
	user.remove((err,user)=>{
		if (err){
				return res.stat(400).json({
		error:"unabele to delete please try again..."
	})

		}
		res.status(200).json({
			message:"user deleted successfully..."
		})
	})
	}



// follow unfollow
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};      
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

exports.findPeople=(req,res)=>{
	let following=req.profile.following
	following.push(req.profile._id)
	User.find({_id:{$nin:following }},(err,users)=>{
		if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(users)
	}).select("name")

}