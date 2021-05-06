const {validationResult}=require("express-validator")
exports.postValidator=(req,res,next)=>{

	const errors=validationResult(req)
	if (!errors.isEmpty()){
		const firstError=errors.errors.map(error=>{
			return error.msg

		})[0]

		return res.status(400).json({
			error:firstError
				})
	}
	next()
}


exports.userValidator=(req,res,next)=>{

	const errors=validationResult(req)
	if (!errors.isEmpty()){
		const firstError=errors.errors.map(error=>{
			return error.msg

		})[0]

		return res.status(400).json({
			error:firstError
				})
	}
	next()
}

exports.userpValidator=(req,res,next)=>{

	const errors=validationResult(req)
	if (!errors.isEmpty()){
		const firstError=errors.errors.map(error=>{
			return error.msg

		})[0]

		return res.status(400).json({
			error:firstError
				})
	}
	next()
}