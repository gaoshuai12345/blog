const express=require('express');
const swig=require('swig');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
// const Cookies=require('cookies');//存在安全隐患
const session=require('express-session')
const MongoStore = require("connect-mongo")(session);//用于cookie存储
//链接数据库
mongoose.connect('mongodb://localhost:27017/blog',{useNewUrlParser:true});
                                   //这里创建数据库
const db=mongoose.connection;
db.on('error',()=>{
	throw error;
})
db.on('open',()=>{
	console.log('DB is connected');
})

const app=express();

//配置模板
// swig.setDefaults({
//   cache: false
// })
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');

//配置静态资源
app.use(express.static('public'));



//设置cookie的中间件
/*  cookie存在安全隐患，用户可以更改浏览器存储的cookie中的值(比如改用户名username)
app.use((req,res,next)=>{
	req.cookies = new Cookies(req,res);
	req.userInfo = {};//自定义req上的一个属性，用于传递数据，并且与其他数据分隔开
	let userInfo = req.cookies.get('userInfo');
	// console.log(userInfo)
	if(userInfo){//第一次启动服务不存在userInfo
		try{//try catch主要为了避免JSON.Parse编译出现问题(小概率)

			req.userInfo = JSON.parse(userInfo)

		}catch(e){
			console.log(e);
		}

	}
	next();
})
*/
app.use(//每一次请求时随机生成一个验证码,此验证码会在登录成功时与登陆用户绑定，并不是根据输入的用户名或密码生成的cookie
	session({
		 //设置cookie名称
		name:'blogId',
		//用它来对session cookie签名，防止篡改
		secret:'LMZ',
		 //强制保存session即使它并没有变化
		resave:true,
		//强制将未初始化的session存储
		saveUninitialized:true,
		//cookie过期时间 1天
    	cookie:{maxAge:1000*60*60*24}, 
		//设置session存储在数据库中
   	    store:new MongoStore({ mongooseConnection: mongoose.connection }) 
	})
)
app.use((req,res,next)=>{
	req.userInfo=req.session.userInfo||{};
	next();
})

//添加处理POST请求的中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//处理路由
app.use('/',require('./routes/index.js'))
app.use('/user',require('./routes/user.js'))
app.use('/admin',require('./routes/admin.js'))//管理员首页
app.use('/category',require('./routes/category.js'))
app.use('/article',require('./routes/article.js'))
app.use('/admin/uploadImages',require('./routes/uploadImages.js'))//博文里上传图片
app.use('/comment',require('./routes/comment.js'));//文章评论
app.use('/resource',require('./routes/resource.js'));//资源管理

app.use('/customer',require('./routes/customer.js'))//普通用户首页




app.listen(3000,()=>{
	console.log('server is running at 127.0.0.1:3000')
})