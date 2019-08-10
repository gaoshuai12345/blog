const Router=require('express').Router;
const router=Router();

const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });//博文里上传图片


                    //中间件
router.post('/',upload.single('upload'),(req,res)=>{
	console.log(req.file)
	let path = "/uploads/"+req.file.filename;
	res.json({
		uploaded:true,
        url:path
	})
})

module.exports=router;