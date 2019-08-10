(function($){
	$('.btn-remove').on('click',function(){
		$(this.parentNode).remove();
	})
	$('.btn-add').on('click',function(){
		var $dom=$(this).siblings().eq(0).clone(true);//siblings:查找兄弟元素；true：同时克隆事件
		$dom.find('[type="text"]').val('')
		console.log($dom)
		$(this.parentNode).append($dom);
	})
})(jQuery)