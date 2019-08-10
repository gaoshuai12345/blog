const Router=require('express').Router;
const router=Router();
const userModel=require('../models/user.js');
const page=require('../util/page.js');
const commentModel=require('../models/comment.js');
const hmac=require('../util/hmac.js')
const fs=require('fs');
const path=require('path')

router.use((req,res,next)=>{//防止直接在地址栏请求/admin后登陆到管理员界面
	if(req.userInfo.isAdmin){
		next()
	}
	else{
		res.send('请用管理员身份登录')
	}
})
router.get('/',(req,res)=>{//请求管理元首页
	// res.send('ok')
	res.render('admin/index',{
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

router.get('/users',(req,res)=>{//请求用户列表
	let options={
		page:req.query.page,
		model:userModel,
		query:{},
		sort:{_id:-1},
		projection:'_id username isAdmin',
	}
	page(options)
	.then((data)=>{
		res.render('admin/users_list',{
			userInfo:req.userInfo,
			users:data.docs,
			page:data.page,    //注意page的类型是否是Number
			lists:data.list,
			pages:data.pages,//为了前端页面判断是否需要显示分页栏
			url:'/admin/users'//为了把分页做成一个多次调用的页面->page.html
		})
	})
	/*
	let page = req.query.page || 1;//第一次请求默认page=1,且page的类型为Number;
								//当其他次请求来时，page接收自req.query.page,此时page类型为string
	// console.log('type::',typeof page)
	if(page<=0){
		page=1
	}

	let limit=2;
	
	userModel.estimatedDocumentCount({})
	.then((count)=>{
		let pages=Math.ceil(count/limit);      ///向上取整
		if(page>pages){
			page=pages;
		}
		let skip=(page-1)*limit;//skip赋值必须放在page验证后的里边，否则会先用
								//page给skip赋值,那样跳过的值会不正确(会大于拥有的值)
		let list=[];
		for(var i=1;i<=pages;i++){
			list.push(i);
		}
		userModel.find({},'_id username isAdmin')
		.skip(skip)
		.limit(limit)
		.then((users)=>{
			res.render('admin/users_list',{
				userInfo:req.userInfo,
				users:users,
				page:page*1,    //转换为number类型
				lists:list
			})
		})
	})
*/
})

router.get('/comments',(req,res)=>{
	commentModel.getPageComments(req)
	.then(data=>{
		res.render('admin/comments',{
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
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'删除评论成功',
				url:'/admin/comments'//点击跳转
			})
		}
		else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'删除评论失败',
			})
		}
		
	})
})


router.get('/site',(req,res)=>{
	let path = __dirname+'/../site.json';
	fs.readFile(path,(err,data)=>{
		if(!err){

			let site=JSON.parse(data);
			// console.log('site:::',site)
			res.render('admin/site',{
				site:site
			})
		}
		else{
			console.log(err);
		}
	})
	
})


router.get('/updatePWD',(req,res)=>{
	res.render('admin/PWD')
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
						res.render('admin/success',{
							// userInfo:req.userInfo,
							message:'密码已修改，点击后重新登录',
							url:'/'//点击跳转
						})
					}
					else{
						res.render('admin/error',{
							userInfo:req.userInfo,
							message:'修改密码失败',
						})
					}

				
			})
		}
		else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'修改密码失败',
			})
		}
	})
	.catch(e=>{
		console.log(e);
	})
})



router.post('/site',(req,res)=>{
	let body=req.body;
	console.log(body)
	console.log(body.name)
	let site={
		name:body.name,
		author:{
			authorName:body.authorName,
			authorIntro:body.authorIntro,
			authorImage:body.authorImage,
			wechat:body.wechat
		}
	}
	site.carousels=[];
	if(typeof body.carouselUrl =='object'&& body.carouselUrl.length){
		for(var i=0;i<body.carouselUrl.length;i++){
			site.carousels.push({//因为carouselUrl与carouselPath数据是共通的
				url:body.carouselUrl[i],
				path:body.carouselPath[i]
			})
		}
	}
	else{
		site.carousels.push({
			url:body.carouselUrl,
			path:body.carouselPath
		})
	}
	site.ads=[];
	console.log(typeof body.adUrl)
	if(typeof body.adUrl =='object'&&body.adUrl.length){
		for(var i=0;i<body.adUrl.length;i++){
			site.ads.push({//因为adUrl与adPath数据是共通的
				url:body.adUrl[i],
				path:body.adPath[i]
			})
		}
	}
	else{
		site.ads.push({
			url:body.adUrl,
			path:body.adPath
		})
	}

	let str=JSON.stringify(site);
	console.log(str);
	let path = __dirname+'/../site.json';
	fs.writeFile(path,str,(err,data)=>{
		if(!err){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'更改站点信息成功',
				url:'/admin/site'//点击跳转
			})
		}
		else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'更改站点信息失败',
			})
		}
	})

})
module.exports=router;