const mongoose=require('mongoose');

const roles=new mongoose.Schema({
		username:{
			type:String
		},
		password:{
			type:String,
		},
		isAdmin:{
			type:Boolean,//必须是Boolean，否则后边对管理员的判断会有问题
			default:false
		},
	});

	
const UserModel=mongoose.model('User',roles);//User会在数据库blog中生成users集合

module.exports=UserModel;