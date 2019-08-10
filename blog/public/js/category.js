(function($){
		$('#btn-sub').on('click',function(){
			var cateName=$('[name="name"]').val();
			if(cateName.trim()==''){
				$('.err').html('分类名称不能为空')
				return false;
			}
			else{
				$('.err').html('')
			}
		})
})(jQuery)