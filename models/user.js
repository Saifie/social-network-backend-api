const mongoose =require("mongoose")
const {Schema}=mongoose
const {uuidv1}=require("uuid")
const crypto =require("crypto")
const {ObjectId}=mongoose.Schema
const userSchema =new Schema({
	name:{
		type:String,
		requiured:true,
		trim:true
	},
	email:{
		type:String,
		requiured:true,
		trim:true
	},
	hashed_password:{
		type:String,
		requiured:true
	},
	salt:String,
	created:{
		type:Date,
		default:Date.now

	},
	updated:Date,
	photo:{
		data:Buffer,
		contentType:String
	},
	about:{
		type:String,
		trim:true
	},
	following:[{type:ObjectId,ref:"users"}],
	followers:[{type:ObjectId,ref:"users"}],
	resetPasswordLink: {
        data: String,
        default: ""
    },


	role:{
		type:String,
		default:"subscriber"
	}

})
userSchema.virtual("password")
.set(function (password){
	this._password=password
	this.salt="98798ihi798iu897hjio7oijo98u90u"
	this.hashed_password=this.encryptedPassword(password)

})
.get(function(){
	return this._password
})


userSchema.methods={
	authenticate:function  (password) {
		return this.encryptedPassword(password)===this.hashed_password
			},
	encryptedPassword:function  (password) {
		if (!password){
			return ""
		}
		try {


			return crypto.createHmac("sha1",this.salt)
			.update(password)
			.digest("hex")


			
		} catch(e) {

			
		return ""
		}
		
	}
}

module.exports=mongoose.model("users",userSchema)