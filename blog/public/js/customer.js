(function($){
	$('.login-out').on('click',function(){
		$.ajax({
			url:'/customer/loginOut',
			dataType:'json',

		})
		.done((result)=>{
			if(result.code==0){
				// window.location.reload();
				window.location.href="/";
			}
			
		})
		.fail((err)=>{
			console.log(err);
		})
	})

})(jQuery)