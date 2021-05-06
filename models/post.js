const mongoose =require("mongoose")
const {Schema}=mongoose
const {ObjectId}=mongoose.Schema
const postSchema =new Schema({
	title:{
		type:String,
		requiured:true
	},
	body:{
		type:String,
		requiured:true
	},
	photo:{
		data:Buffer,
		contentType:String

	},
	postedBy:{
		type:ObjectId,
		ref:"users"

	},updated:Date
	,created:{
		type:Date,
		default:Date.now
	},
	likes:[{type:ObjectId,ref:"users"}],
	 comments: [
        { postedBy: { type: ObjectId, ref: 'users' },
            text: String,
            created: { type: Date, default: Date.now },
           
        }
    ]

})

module.exports=mongoose.model("posts",postSchema)