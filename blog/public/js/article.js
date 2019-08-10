(function($){



	
	ClassicEditor//富文本编辑器
    .create( document.querySelector( '#editor' ),{
    	language:'zh-cn',
    	ckfinder:{
    		uploadUrl:'/admin/uploadImages'
    	}
    } )
    .catch( error => {
        console.error( error );
    } );





    $err=$('.err');
    $('#btn-sub').on('click',function(){
		var title=$('[name="title"]').val();
		var intro=$('[name="intro"]').val();
		var content=$('[name="content"]').val();//因为内容区加了富文本编辑器
									//通过val并不能获取到值
		if(title.trim()==''){
			 $err.eq(0).html('分类名称不能为空')
			return false;
		}
		else{
			$err.eq(0).html('')
		}

		if(intro.trim()==''){
			 $err.eq(1).html('简介不能为空')
			return false;
		}
		else{
			$err.eq(1).html('')
		}

		if(content=='<p>$nbsp;</p>'){
			 $err.eq(2).html('内容不能为空')
			return false;
		}
		else{
			$err.eq(2).html('')
		}
	})
})(jQuery)

