(function($){
	var $register=$('#register');
	var $login=$('#login');
	var $logined=$('#logined');


	var $subRegister=$('.sub-register');
	var $subLogin=$('.sub-login');

	var $goRegister=$('.go-register');
	var $goLogin=$('.go-login');
	$goRegister.on('click',function(){
		$login.hide();
		$register.show();
	})
	$goLogin.on('click',function(){
		$login.show();
		$register.hide();
	})

	var $errRegister=$register.find('.err');
	var $errLogin=$login.find('.err');

	var usernameReg=/^[a-z][a-z|0-9|_]{2,9}$/i;
	var passwordReg=/^\w{3,10}$/

	$subRegister.on('click',function(){
		var username=$register.find('[name="username"]').val();
		var password=$register.find('[name="password"]').val();
		var repassword=$register.find('[name="repassword"]').val();
		var errMsg='';
		if(!usernameReg.test(username)){
			errMsg='用户名以字母开头由字母数字下划线组成3-10个字符'
		}
		else if(!passwordReg.test(password)){
			errMsg='密码由字母数字下划线组成3-10个字符'
		}
		else if(password!=repassword){
			errMsg='两次密码不一致'
		}

		if(errMsg){
			$err.show().html(errMsg);
		}
		else{
			//验证成功发送ajax请求
			$.ajax({
				url:'/user/register',
				data:{
					username:username,
					password:password
				},
				type:'post',
				dataType:'json'
			})
			.done(function(result){
				if(result.code==0){
					$goLogin.trigger('click');
				}
				else{
					$errRegister.show().html(result.errMessage);
				}
			})
			.fail(function(err){
				console.log(err);
			})
		}
	})
	$subLogin.on('click',function(){
		var username=$login.find('[name="username"]').val();
		var password=$login.find('[name="password"]').val();
		var errMsg='';
		if(!usernameReg.test(username)){
			errMsg='用户名以字母开头由字母数字下划线组成3-10个字符'
		}
		else if(!passwordReg.test(password)){
			errMsg='密码由字母数字下划线组成3-10个字符'
		}
		if(errMsg){
			$err.show().html(errMsg);
		}
		else{
			//验证成功发送ajax请求
			$.ajax({
				url:'/user/login',
				data:{
					username:username,
					password:password
				},
				type:'post',
				dataType:'json'
			})
			.done(function(result){
				if(result.code==0){
					/*
					$login.hide();
					$logined.find('span').html(result.data.username);
					
					$logined.show();
					*/ //第一次进来时读取index.html根本没有$logined元素,想要显示必须重新发送请求进入index.html读取
					window.location.reload();//浏览器已存储cookie，刷新时重新请求index.html
					// $logined.show();
				}
				else{
					$errLogin.show().html(result.errMessage);
				}
			})
			.fail(function(err){
				console.log(err);
			})
		}
	})

	// $(document).on('keydo')
	$('.login-out').on('click',function(){
		$.ajax({
			url:'/user/loginOut',
			dataType:'json',

		})
		.done((result)=>{
			if(result.code==0){
				window.location.reload();
			}
			
			// $logined.hide();
		})
		.fail((err)=>{
			console.log(err);
		})
	})

	$('#page').on('click','a',function(){
		console.log(this)//Dom
		var $article_list=$('.article_list')
		var $this=$(this);
		var page = 1;
	 	var currentPage = $('#page').find('.active a').html();

	 	if($this.attr('aria-label') == 'Previous'){//上一页
	 		page = currentPage - 1;
	 	}else if($this.attr('aria-label') == 'Next'){//下一页
	 		page = currentPage*1 + 1;
	 	}else{
	 		page = $(this).html();
	 	}
	 	var query='';
	 	query='page='+page;
	 	var category=$('#categoryId').val();
	 	if(category){
	 		query+='&category='+category;//&&&&&&&&&&&&&&&&分隔符
	 	}
		$.ajax({
			url:'/articles?'+query,
			dataType:'json'
		})
		.done(function(result){
			if(result.code==0){
				var articles=result.data.docs;
				bulidArticleList(articles);
				// console.log(result);
				// console.log(result.data.page,result.data.list)
				buildPage(result.data.page,result.data.list)
			}
		})
		.fail(function(err){
			console.log(err);
		})
	})
	function bulidArticleList(articles){//动态生成文章列表
		var html='';
		for(var i = 0;i<articles.length;i++){
	 	var date = moment(articles[i].createdAt).format('YYYY年MM月DD日 HH:mm:ss ');
	 	html +=`<div class="panel panel-default content-item">
			  <div class="panel-heading">
			    <h3 class="panel-title">
			    	<a href="/view/${articles[i]._id}" class="link" target="_blank">${ articles[i].title }</a>
				</h3>
			  </div>
			  <div class="panel-body">
				${ articles[i].intro }
			  </div>
			  <div class="panel-footer">
				<span class="glyphicon glyphicon-user"></span>
				<span class="panel-footer-text text-muted">
					${ articles[i].user.username }
				</span>
				<span class="glyphicon glyphicon-th-list"></span>
				<span class="panel-footer-text text-muted">
					${ articles[i].category.name }
				</span>
				<span class="glyphicon glyphicon-time"></span>
				<span class="panel-footer-text text-muted">
					${ date }
				</span>
				<span class="glyphicon glyphicon-eye-open"></span>
				<span class="panel-footer-text text-muted">
					<em>${ articles[i].click }</em>已阅读
				</span>
			  </div>
			</div>`
		}
		$('.article_list').html(html);
	}
	function buildPage(page,list){//动态生成分页
		var html='';
		html+=`<li>
					<a href="javascript:;" aria-label="Previous">
			        <span aria-hidden="true">&laquo;</span>
			        </a>
			   </li>
			`
		for(var i=0;i<list.length;i++){
			if(page==list[i]){
				html+=`<li class="active"><a  href="javascript:;">${list[i]}</a></li> `
			}
			else{
				html+=`<li><a href="javascript:;">${list[i]}</a></li>`
			}
		}
		html+=`<li>
			      <a href="javascript:;" aria-label="Next">
			        <span aria-hidden="true">&raquo;</span>
			      </a>
			    </li>`
		$('#page .pagination').html(html);
	}


	$('#comment-btn').on('click',function(){
		var commentContent=$('#comment-content').val();
		var id=$('#article-id').val();

		if(commentContent.trim()==''){
			$('.err').html('请输入评论内容后再提交')
			return false;
		}
		else{
			$('.err').html('')
		}

		$.ajax({
			url:'/comment/add',
			type:'post',
			dataType:'json',
			data:{
				content:commentContent,
				articleId:id,
			}
		})
		.done((result)=>{
			var date = moment(result.comment.createdAt).format('YYYY年MM月DD日 HH:mm:ss ');
			if(result.code==0){
				var html=	`	<div class="col-lg-12">
									<div class="panel panel-default">
									  <div class="panel-heading">${ result.username } 发表于${ date } </div>
									  <div class="panel-body">
									   ${ result.comment.content }
									  </div>
									</div>
								</div>
							`
				$('#comment').prepend(html);
			}
		})
		.fail(err=>{
			console.log(err);
		})
	})
})(jQuery)