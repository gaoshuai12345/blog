const mongoose=require('mongoose');

const roles=new mongoose.Schema({
		name:{
			type:String
		},
		path:{
			type:String
		}
	});

	
const resourceModel=mongoose.model('Resource',roles);//User会在数据库blog中生成users集合

module.exports=resourceModel;