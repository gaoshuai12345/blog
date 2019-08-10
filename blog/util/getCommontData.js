
const CateModel=require('../models/category.js')
const articleModel=require('../models/article.js')
const path=require('path');
const fs=require('fs');


let getCommontData=()=>{
 return new Promise((resolve,reject)=>{
	CateModel.find({},'_id name order')
	.sort({order:1})
	.then((categories)=>{
		articleModel.find({},'_id click title')//给首页的点击排行传递信息
			.sort({click:-1})//根据点击量排序
			.limit(5)//限制显示在首页点击排行中的数目
			.then((clickArticles)=>{
				let filePath =path.normalize(__dirname+'/../site.json');
				fs.readFile(filePath,(err,data)=>{
					let siteData={};
					if(!err){
							siteData=JSON.parse(data)
					}
					resolve({
						categories:categories,
						clickArticles:clickArticles,
						site:siteData
					})
				})



				
			})
	})	
 })

}
module.exports=getCommontData;