const mongoose=require('mongoose');
const page=require('../util/page.js');//getPageArticle方法用到了
const roles=new mongoose.Schema({
		category:{//所属分类
			type:mongoose.Schema.Types.ObjectId,
			ref:'Cate'
		},
		intro:{
			type:String
		},
		user:{
			type:mongoose.Schema.Types.ObjectId,
			ref:'User'
		},
		title:{
			type:String
		},
		content:{
			type:String
		},
		click:{
			type:Number,
			default:0
		},
		createdAt:{
			type:Date,
			default:Date.now
		}
});


roles.statics.getPageArticles=function(req,query={}){//异步函数想要传递信息需要用promise或是回调函数
	return new Promise((resolve,reject)=>{
		let options={
			page:req.query.page,
			model:this,
			query:query,
			sort:{_id:-1},
			projection:'-__v',
			populate:[{path:'category',select:'name'},{path:'user',select:'username'}]
		}
		page(options)
		.then((data)=>{
			resolve(data);
		})
	})
	
}

const articleModel=mongoose.model('Article',roles);//Cate会数据库blog中生成cates集合

module.exports=articleModel;