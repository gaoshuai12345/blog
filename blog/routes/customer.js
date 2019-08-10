const Router=require('express').Router;
const router=Router();
const userModel=require('../models/user.js');
const commentModel=require('../models/comment.js')
const page =require('../util/page.js')
const hmac=require('../util/hmac.js')
// router.use((req,res,next)=>{//防止直接在地址栏请求/customer后登陆到用户界面
// 	if(req.userInfo.isAdmin){
// 		next()
// 	}
// 	else{
// 		res.send('请用管理员身份登录')
// 	}
// })
router.get('/',(req,res)=>{//请求管理元首页
	// res.send('ok')
	res.render('customer/index',{
		userInfo:req.userInfo
	})
})

router.get('/loginOut',(req,res)=>{//管理员退出
	var result={
		code:0,
		errMessage:''
	}
	// req.cookies.set('userInfo',null);
	req.session.destroy();
	res.json(result);
})

router.get('/comments',(req,res)=>{
	commentModel.getPageComments(req,{user:req.userInfo._id})
	.then(data=>{
		// console.log('2222::',data)
		res.render('customer/comments',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			pages:data.pages,
			lists:data.list
		})
	})
})
router.get('/comment/delete/:id',(req,res)=>{
	let id =req.params.id;
	commentModel.remove({_id:id})
	.then((cate)=>{
		if(cate){
			res.render('customer/success',{
				userInfo:req.userInfo,
				message:'删除评论成功',
				url:'/customer/comments'//点击跳转
			})
		}
		else{
			res.render('customer/error',{
				userInfo:req.userInfo,
				message:'删除评论失败',
			})
		}
		
	})
})





router.get('/updatePWD',(req,res)=>{
	res.render('customer/PWD')
})

router.post('/updatePWD',(req,res)=>{
	// console.log(req.body)
	let body=req.body;
	userModel.findOne({username:body.username,password:hmac(body.oldPwd)})
	.then((user)=>{
		if(user){
			// console.log(user)
			userModel.update({_id:user._id},{password:hmac(body.newPwd)},(err,raw)=>{
					if(!err){
						req.session.destroy();
						res.render('customer/success',{
							// userInfo:req.userInfo,
							message:'密码已修改，点击后重新登录',
							url:'/'//点击跳转
						})
					}
					else{
						res.render('customer/error',{
							userInfo:req.userInfo,
							message:'修改密码失败',
						})
					}

				
			})
		}
		else{
			res.render('customer/error',{
				userInfo:req.userInfo,
				message:'修改密码失败',
			})
		}
	})
	.catch(e=>{
		console.log(e);
	})
})



module.exports=router;