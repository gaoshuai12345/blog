const Router=require('express').Router;
const router=Router();
const CateModel=require('../models/category.js')
const articleModel=require('../models/article.js')
const page=require('../util/page.js')
const getCommontData=require('../util/getCommontData.js')
const commentModel=require('../models/comment.js');



router.get('/',(req,res)=>{

	/*
	CateModel.find({},'_id name order')
	.sort({order:1})
	.then((categories)=>{//首页nav导航
		
		let options={
			page:req.query.page,
			model:articleModel,
			query:{},
			sort:{_id:-1},
			projection:'',
			populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
		}
		page(options)
		
		articleModel.getPageArticles(req)//分页文章列表
		.then((data)=>{
			articleModel.find({},'_id click title')//给首页的点击排行传递信息
			.sort({click:-1})//根据点击量排序
			.limit(5)//限制显示在首页点击排行中的数目
			.then((clickArticles)=>{
				// console.log('data',dasta.page)
				res.render('main/index',{//需要传userInfo，可试试
					userInfo:req.userInfo,
					articles:data.docs,
					page:data.page,
					lists:data.list,
					pages:data.pages,
					categories:categories,
					clickArticles:clickArticles
					// url:'/article'
				})
			})
			
		})
	});
	*/
	// console.log('1::',req.userInfo)
	articleModel.getPageArticles(req)//分页文章列表
	.then((pageData)=>{
		getCommontData()//将站点信息site获取也放在里边了
		.then((data)=>{
			// fs.readFile(filePath,(err,siteData)=>{
			// 	if(!err){
				console.log('1::',data.site)
					res.render('main/index',{//需要传userInfo，可试试
						userInfo:req.userInfo,
						articles:pageData.docs,
						page:pageData.page,
						lists:pageData.list,
						pages:pageData.pages,
						categories:data.categories,
						clickArticles:data.clickArticles,
						site:data.site//由getCommontData传输进来
						// url:'/article'
					})
				// }
				// else{

				// }
			// })
			
		})
	})
	
})

router.get('/articles',(req,res)=>{//文章详情页中的分页操作
	/*
	let options={
		page:req.query.page,
		model:articleModel,
		query:{},
		sort:{_id:-1},
		projection:'-__v',
		populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
	}
	page(options)
	*/
	let category=req.query.category;
	let query={};
	if(category){
		query.category=category;
	}
	console.log(category);
	articleModel.getPageArticles(req,query)
	.then((data)=>{
		// console.log('result:::',data)
		
		// let data1=JSON.stringify(data);
		// res.end(data1)
		res.json({
			code:0,
			data:data
		})
	})
})

router.get('/view/:id',(req,res)=>{//文章详情页
	let id=req.params.id;
	console.log('req.userInfo:::',req.userInfo);
	articleModel.update({_id:id},{$inc:{ click : 1}})
	.then((article)=>{
		articleModel.findById(id)
		.populate([{path:'category',select:'name'},{path:'user',select:'username'}])
		.then((article)=>{
			/*
			articleModel.find({},'_id click title')
			.sort({click:-1})
			.limit(5)
			.then((topArticles)=>{
				CateModel.find({},'_id name')
				.then((categories)=>{
					res.render('main/article-detail',{//main前边不能由/
						userInfo:req.userInfo,
						article:article,
						categories:categories,
						clickArticles:topArticles
					})
				})
			})
			*/
			// console.log('article:::',article)
			getCommontData()
			.then((data)=>{
				// console.log('::',data)
				commentModel.getPageComments(req,{article:id})
				.then(pageData=>{
					// console.log('pageData:::',pageData)
					res.render('main/article-detail',{//main前边不能有/
						userInfo:req.userInfo,
						article:article,
						categories:data.categories,
						clickArticles:data.clickArticles,
						category:article.category._id.toString(),//从首页的文章区域点击进入详情页
													//的同时，改变nav导航部分的分类名高亮
						comments:pageData.docs,
						page:pageData.page,
						lists:pageData.list,
						pages:pageData.pages,
						site:data.site//由getCommontData传输进来
					})
				})
				
			})
			
			
		})
	})
})

router.get('/list/:id',(req,res)=>{//分类下所包含所有的文章
	let id=req.params.id;//分类名的id
	articleModel.getPageArticles(req,{category:id})//分页文章列表
	.then(pageData=>{
		getCommontData()//显示nav及今日排行部分
		.then((data)=>{
			// console.log('pageData',pageData)
			res.render('main/list',{//main前边不能有/
				userInfo:req.userInfo,
				articles:pageData.docs,
				page:pageData.page,
				lists:pageData.list,
				pages:pageData.pages,
				categories:data.categories,
				category:id,
				site:data.site,//由getCommontData传输进来
				clickArticles:data.clickArticles
			})
		})
	})
})

// router.get('/articlesInCate',(req,res)=>{//文章分页列表
// 	let id =req.query.id
// 	articleModel.getPageArticles(req,{category:id})
// 	.then((data)=>{

// 		res.json({
// 			code:0,
// 			data:data
// 		})
// 	})
// })
module.exports=router;