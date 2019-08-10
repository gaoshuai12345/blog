const Router=require('express').Router;
const router=Router();
const CateModel=require('../models/category.js')
const page=require('../util/page.js')
const articleModel=require('../models/article.js')


router.get('/',(req,res)=>{
	/*
	let options={
		page:req.query.page,
		model:articleModel,
		query:{},
		sort:{_id:-1},
		// projection:'_id name order',
		projection:'',
		//populate使articleModel关联至categoryModel和userModel
		populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
		//path值根据model文件里的数据来定  //属性名
	}
	page(options)
	*/
	articleModel.getPageArticles(req)
	.then((data)=>{
		res.render('admin/article',{//?????????????????????不用传userInfo
			userInfo:req.userInfo,
			articles:data.docs,
			page:data.page,//注意page的类型是否是Number
			lists:data.list,
			pages:data.pages,//为了前端页面判断是否需要显示分页栏
			url:'/article'//为了把分页做成一个多次调用的页面->page.html
		})
	})
})


router.get('/add',(req,res)=>{
	CateModel.find({},'_id name')
	.sort({order:1})//可以用投影不存在的属性进行排序
	.then((categories)=>{
		res.render('admin/article_add_edit',{
			userInfo:req.userInfo,
			categories:categories,//将分类名传递进前端页面加以利用
		})
	})
	
})

router.post('/add',(req,res)=>{//post请求
	let body=req.body;
	new articleModel({
		category:body.category,
		title:body.title,
		content:body.content,
		intro:body.intro,
		user:req.userInfo._id//传递作者
	})
	.save()
	.then((article)=>{
		if(article){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'新建文章成功',
				url:'/article'
			})
		}
		else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'新建文章失败',
			})
		}
	})
})	

router.get('/delete/:id',(req,res)=>{
	let id =req.params.id;
	articleModel.remove({_id:id})
	.then((cate)=>{
		if(cate){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'删除文章成功',
				url:'/article'//点击跳转
			})
		}
		else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'删除文章失败',
			})
		}
		
	})
})

router.get('/edit/:id',(req,res)=>{
	let id=req.params.id
	CateModel.find({})
	.sort({_id:-1})
	.then((categories)=>{
		if(categories){
			articleModel.findOne({_id:id})
			// .populate({path:'category',select:'name'})
			// .populate({path:'user',select:'username'})
			.then((article)=>{
				console.log(article)
				res.render('admin/article_add_edit',{
					userInfo:req.userInfo,
					categories:categories,
					article:article
				})
			})
		}
	
	})
	
	
})
router.post('/edit',(req,res)=>{
	let body =req.body;
	let id=body.id;
	let options={
		category:body.category,
		title:body.title,
		intro:body.intro,
		content:body.content
	}
	articleModel.update({_id:id},options,(err,data)=>{
		if(!err){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'编辑文章成功',
				url:'/article'
			})
		}else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'编辑文章失败',
			})
		}
	})
})
module.exports=router;