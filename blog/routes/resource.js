const Router=require('express').Router;
const router=Router();
const page=require('../util/page.js')
const resourceModel=require('../models/resource.js')
const path=require('path');
const fs=require('fs');

const multer = require('multer');
// const upload = multer({ dest: 'public/resource/' });//上传图片  还必须在前端页面加上enctype="multipart/form-data"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/resource/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+path.extname(file.originalname))
    // console.log(file.originalname)
     // cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage: storage })


router.get('/',(req,res)=>{
	let options={
		page:req.query.page,
		model:resourceModel,
		query:{},
		sort:{order:1},
	}
	page(options)
	.then(data=>{
		res.render('admin/resource',{
			resources:data.docs,
			page:data.page,//注意page的类型是否是Number
			lists:data.list,
			pages:data.pages,//为了前端页面判断是否需要显示分页栏
			url:'/resource'//为了把分页做成一个多次调用的页面->page.html
		})
	})
	
})


router.get('/add',(req,res)=>{
	res.render('admin/resource_add')
	
})

router.post('/add', upload.single('file'),(req,res)=>{//填入file是因为前端页面的name="file"
	// console.log(req.file);
	let body=req.body;

	new resourceModel({

		name:body.name,
		path:'/resource/'+req.file.filename,

	})
	.save()
	.then((resource)=>{
		if(resource){
			res.render('admin/success',{
				userInfo:req.userInfo,
				message:'添加资源成功',
				url:'/resource'
			})
		}
		else{
			res.render('admin/error',{
				userInfo:req.userInfo,
				message:'添加资源失败',
			})
		}
	})

})	

router.get('/delete/:id',(req,res)=>{
	let id =req.params.id;
	console.log(id)
	resourceModel.findByIdAndRemove(id)//仅仅删除了数据库中的数据，并没有删除硬存中的图片
	.then((resource)=>{
		let filePath=path.normalize(__dirname+'/../public/'+resource.path);
		console.log(filePath)
		fs.unlink(filePath,(err)=>{//删除物理内存中的图片
			if(!err){
				res.render('admin/success',{
					userInfo:req.userInfo,
					message:'删除资源成功',
					url:'/resource'
				})
			}else{
				res.render('admin/error',{
					userInfo:req.userInfo,
					message:'删除资源失败，删除图片失败',
				})
			}
		})
	})
	.catch(e=>{
		console.log(e);
		res.render('admin/error',{
			userInfo:req.userInfo,
			message:'删除资源失败，数据库操作失败',
		})
	})
})


module.exports=router;