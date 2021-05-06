const express=require("express")
const mongoose=require("mongoose")
const app=express()
const morgan=require("morgan")
const bodyParser =require("body-parser")
const cookieParser =require("cookie-parser")
const expressValidator=require("express-validator")
const fs =require("fs")
const cors =require("cors")

const postrRoutes=require("./routers/post.js")
const authRoutes=require("./routers/auth.js")
const userRoutes=require("./routers/user.js")

//ENVIROMENT VARIABLES
if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}
//DATA BASE CONNECTION....
mongoose.connect('mongodb+srv://admin-saif:saifhoney@cluster0.mss6k.mongodb.net/social',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify:false
}).then(()=>{
	console.log("database connected...")

})



mongoose.connection.on("error",(error)=>{
	console.log(error.message)
})
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
// app.use(expressValidator())
app.get("/",(req,res)=>{
	fs.readFile("docs/documentation.json",(err,data)=>{
		if(err){
			res.status(400).json({
				error:err
			})
		}
		data=JSON.parse(data)
		res.json(data)

	})
	
})


app.use(postrRoutes)
app.use(authRoutes)
app.use(userRoutes)
app.use((err,req,res,next)=>{
	if (err.name==="UnauthorizedError"){
		res.status(403).json({
			error:"Unauthorized..."
		})
	}
	
})

port =process.env.PORT || 8080

app.listen(port,()=>{
	console.log("port is listening on port "+port)
})