
/*
	options={
		page://需要显示的页码
		model:,
		query:,
		sort:,
		projection,
	}
	


*/



let page=(options)=>{
 return new Promise((resolve,reject)=>{
			let page = 1;
			if(!isNaN(parseInt(options.page))){
				page=options.page
			}
			if(page<=0){
				page=1
			}

			let limit= options.limit*1 || 2;
			
			options.model.countDocuments(options.query)//countDocuments可返回经过筛选条件后的值
			.then((count)=>{
				let pages=Math.ceil(count/limit);      ///向上取整
				if(page>pages){
					page=pages;
				}
				if(pages==0){//避免数据库查询不到数据的时候，导致skip值为负数从而报错
					page=1
				}
				let skip=(page-1)*limit;//skip赋值必须放在page验证后的里边，否则会先用
										//page给skip赋值,那样跳过的值会不正确(会大于拥有的值)
				let list=[];
				for(var i=1;i<=pages;i++){
					list.push(i);
				}
				let query=options.model.find(options.query,options.projection);
				if(options.populate){//如果不存在就不需要执行
					for(var i=0;i<options.populate.length;i++){//避免写死
						query=query.populate(options.populate[i]);
					}
				}
				query
				.sort(options.sort)
				.skip(skip)
				.limit(limit)
				.then((docs)=>{
					// console.log(docs);
					resolve({//传递出去的data数据包，resolve函数在返回值的then函数中执行
						docs:docs,
						list:list,
						page:page*1,
						pages:pages
					})
				})
				.catch((e)=>{
					console.log(e);
				})
			})
		})
	
}
module.exports=page;