mfwAlbum
========

jQuery相册弹出层插件


  特点：
       1.所有图片（包括缩略图）实现按需加载，不浪费带宽
       2.显示样式可自由定制
       3.支持键盘左右箭头翻页
       4.缩略图切换效果可定制
 
  兼容性：
       兼容Firefox，360，chrome，Safari、搜狗、IE7及以上浏览器
       IE6 下基本可用，但不能设置 mouse_arrow=true 和 mask=true
 
  包依赖：
       jQuery 类库
       jquery.tmpl.js 插件
       jquery.easing.1.3.js （可选，如果要定制缩略图切换效果需加载）
       强烈建议jQuery版本大于1.4，否则当图片过多时（缩略图容器宽度超过10000像素）缩略图滚动效果可能不正确（jQuery自身bug导致）
 
  配置方法：
 
       配置相册主要分四部分：1.CSS样式；2.HTML代码及模板； 3.数据； 4.JS代码。
       下面分别介绍：
 
  1.CSS样式：
       可根据需要定制样式，这部分工作主要由Builder完成，这里省略。
 
  2.HTML代码及模板：
       (1).首先需要一个空的div作为相册容器：
           <div class="popup hide" id="album_box"></div>
 
       (2).模板分两部分，相册主模板和缩略图列表模板，模板使用jQuery.tmpl 插件的语法：
 
       A.相册主模板类似下面：
···html
        <script id="album_tmpl" type="text/x-jquery-tmpl">
            <!-- 关闭按钮 -->
            <span class="close"></span>
            <div class="album-popup">
                <div class="album-title">
                    <span class="photo-num">
                        <!-- 当前图片序号/图片总数 -->
                        <span class="cur_num"></span> / <span class="total"></span></span>
                    <!-- 标题 -->
                    <strong class="title"></strong>
                </div>
                <div class="album-box">
                    <!-- 当前图片容器 -->
                    <div class="middle img_box"></div>
                    <div class="ctrl-trigger">
                        <!-- 前一张按钮 -->
                        <span class="photo-prev"></span>
                        <!-- 下一张按钮 -->
                        <span class="photo-next"></span>
                    </div>
                </div>
                <!-- 图片描述 -->
                <div class="photo-desc desc"></div>
                <p class="photo-info">
                    <!-- 用户链接 -->
                    <a href="#" class="user_link" target="_blank">
                        <!-- 用户名 -->
                        <span class="username"></span>
                        <!-- 用户级别 -->
                        <span class="lv"></span>
                    </a> 上传于
                    <!-- 创建时间 -->
                    <span class="ctime"></span></p>
                <div class="photo-slide">
                    <!-- 缩略图前一组按钮 -->
                    <span class="arrow-prev"></span>
                    <!-- 缩略图下一组按钮 -->
                    <span class="arrow-next"></span>
                    <div class="slide-box">
                        <!-- 缩略图容器 -->
                        <ul class="thumb_box"></ul>
                    </div>
                </div>
            </div>
        </script>
```
       其中 title，desc，user_link，username，lv，ctime 这几个class是预先定义好的，和数据中的字段相对应，这些class可省略，
       如果省略，则程序不会在数据中查找对应的值，如果不省略，则数据中必须提供相应的值。
 
       cur_num（当前图片序号），total（图片总数）不需手工指定，如果模板中出现这些class，则程序会自动给它们赋值。
 
       close、img_box、photo-prev、photo-next、arrow-prev、arrow-next、thumb_box 等class名称对应于各种功能性按钮和容器。
 
       以上class名称都可在配置参数中修改。
 
       B.缩略图列表模板非常简单，类似下面：
       <script id="album_item_tmpl" type="text/x-jquery-tmpl">
           <li data-id="${id}" data-img="${thumb_url}"></li>
       </script>
       ${id} 是图片id，${thumb_url} 是缩略图url地址
 
  3.数据：
       数据是一个二维数组，类似下面：
```javascript
        data = [{
                id : id,    //图片唯一id，必填
                title : title,  //标题，可选
                desc : desc,    //简介，可选
                ctime : ctime,  //创建时间，可选
                thumb_url : thumb_url,  //图片缩略图地址，必填
                img_url : img_url,  //图片地址，必填
                user_link : '/u/' + uid + '.html', //用户链接，可选
                username : username,    //用户名，可选
                lv : 0
            }, {
                ......
            }];
```
  4.JS代码：
```html
    <script language="javascript" src="/js/jquery-1.8.1.min.js" type="text/javascript"></script>
    <script language="javascript" src="/js/jquery.tmpl.js" type="text/javascript"></script>
```
```javascript
    <script language="javascript">
        var album_data = [ ...数据省略... ];

        //相册初始化，更多配置选项请参考代码中默认配置参数
        $('#album_box').mfwAlbum({
            thumb_display_width : 640, //缩略图显示区域宽度
            thumb_item_width : 160, //单个缩略图宽度（包括margin,padding等）
            max_width : 660,  //图片最大宽度
            max_height : 440, //图片最大高度
            thumb_next_btn : '.next_f',  //下一组缩略图按钮jQuery选择器
            thumb_prev_btn : '.prev_f',  //上一组缩略图按钮jQuery选择器
            thumb_focus_class : 'li_fous', //当前选中状态的缩略图class
            mouse_arrow : true, //如果为true，鼠标点击当前图片左半部分会显示前一张图片，点击右半部分会显示下一张图片（鼠标指针会变成相应左右箭头）
            mask : true, //是否显示背景半透明遮障层
            thumb_lazy_load : true,  //缩略图是否延迟加载,默认为true，只有显示在屏幕上的图片才会被加载
            loading_img : '/images/loading_gray2.gif', //预加载时的loading图标
            loading_width : 24, //loading 图标宽度
        });

        //传入数据
        $album_box.mfwAlbum('setData', album_data);

        //显示相册
        $('.img').click(function(){
            $album_box.mfwAlbum('open', $(this).data('id'));
        });
   </script>
```
  使用实例：
       http://www.mafengwo.cn/hotel/info.php?iId=1588
 
       ajax传入数据的例子：
       http://www.mafengwo.cn/gonglve/poi_v6.php?iId=1913

