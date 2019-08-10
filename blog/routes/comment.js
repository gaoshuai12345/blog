const Router=require('express').Router;
const router=Router();

const commentModel=require('../models/comment.js');
const page=require('../util/page.js');
const getCommontData=require('../util/getCommontData.js')
const userModel=require('../models/user.js');

router.post('/add',(req,res)=>{
	let body=req.body;
	// data:{
	// 	content:commentContent,
	// 	articleId:id
	// }
	new commentModel({
		article:body.articleId,//key值只能是在model中定义好了的！！！！！！！！！！！！！！！！
		content:body.content,
		user:req.userInfo._id
	})
	.save()
	.then((newComment)=>{
		userModel.findOne({_id:req.userInfo._id},'username -_id')
		.then(user=>{
				res.json({
				code:0,
				comment:newComment,
				username:user.username
			})
		})
		
	})
	.catch(e=>{
		console.log(e);
	})
})



module.exports=router;