const mongoose=require('mongoose');

const roles=new mongoose.Schema({
		name:{
			type:String
		},
		order:{
			type:Number,
			default:0
		},
	});

	
const CateModel=mongoose.model('Cate',roles);//Cate会数据库blog中生成cates集合

module.exports=CateModel;