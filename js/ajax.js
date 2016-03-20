//全局变量
var ajaxBinded = false;
jQuery(document).ready(function() {
    //下面三行你可以插入到你的jQuery(document).ready(function()里面，html5的历史记录API
    if( history && history.pushState){
       //为真就执行Ajaxopt函数
        Ajaxopt();
    }
})
//Ajaxopt函数
function Ajaxopt(){
    //所有不为新窗口打开的链接
    $('a[target!=_blank]').live('click',function(event){
    // $('a[target!=_blank]').on('click', 'a', function(event){
        var link = event.currentTarget;
        var url = link.href;
        
        if ( event.which > 1 || event.metaKey || event.ctrlKey )
        return
        if ( location.protocol !== link.protocol || location.host !== link.host ){
            return;
        }
        if (link.hash && link.href.replace(link.hash, '') === location.href.replace(location.hash, ''))
        return
        if (url.indexOf("respond")>0||url.indexOf("/wp-admin/")>0||url.indexOf("wp-login.php")>0||url.indexOf("sitemap.xml")>0)
        return
        //以上条件语句均为判断链接时候需要ajax加载，下面2句为执行loadDate函数进行ajax操作。
        loadData(url,true);
        event.preventDefault();
    });
}

//loadDate函数
function loadData(url,toPush){
    //进行AJAX操作
    $.ajax({
        url:url,
        data: "myRequest=ajax",   //这个可以参考ajax全站加载系列文章第二篇。
        dataType: "html",
        type: "post",
        beforeSend:function(jqXHR, settings){   //加载前操作 #content的DIV变化
            $('#content').fadeTo(500,0.3);
        }
        ,
        complete:function(){    //加载后操作 #content的DIV变化
            $('#content').fadeTo(200,1);
        }
        ,
        success:function(message){  //加载成功的操作
            var msger = message;
            var titl1 = $(message).find("h1:first").text();
            var titl2 = $(message).find("h2:first").text();
            if (titl1 == "") {
                window.document.title = titl2 + " \u2502 SOZ";
            }
            else {
                window.document.title = titl1 + " \u2502 SOZ";
            }
            //以上几句为组合新页面的标题。下面一句为插入ajax回来的内容到"#content"的DIV容器内。
            $("#content").html(msger);
            if(toPush){     //使用html5的特有API 来改变历史记录数据。
                window.history.pushState(null, titl1, url);
            }
            if(!ajaxBinded){    //ajax后重新绑定新加载页面的ajax事件。
                ajaxBinded = true;
                $(window).bind('popstate', function(e){
                    loadData(location.href,false);
                    return false;
                });
            }
        }
        ,
        error: function() {     //如果加载失败 报错内容
            $("#content").html("<div style='0margin-bottom: 800px;'><h2>AJAX Error...</h2></div>");
        },
    });
}
