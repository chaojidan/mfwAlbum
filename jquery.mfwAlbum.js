/**
 * Created with JetBrains PhpStorm.
 * User: wanghui
 * Date: 13-4-25
 * Time: 上午12:20
 * To change this template use File | Settings | File Templates.
 *
 * 蚂蜂窝相册弹出层插件
 *
 * 特点：
 *      1.所有图片（包括缩略图）实现按需加载，不浪费带宽
 *      2.显示样式可自由定制
 *      3.支持键盘左右箭头翻页
 *
 * 兼容性：
 *      兼容Firefox，360，chrome，Safari、搜狗、IE7及以上浏览器
 *      IE6 下基本可用，但不能设置 mouse_arrow=true 和 mask=true
 *      强烈建议jQuery版本大于1.4，否则当图片过多时（缩略图容器宽度超过10000像素）缩略图滚动效果可能不正确（jQuery自身bug导致）
 *      程序执行需要 jquery.tmpl.js 文件
 *
 * 配置方法：
 *
 *      配置相册主要分四部分：1.CSS样式；2.HTML代码及模板； 3.数据； 4.JS代码。下面分别介绍：
 *
 * 1.CSS样式：
 *      可根据需要定制样式，这部分工作主要由Builder完成，这里省略。
 *
 * 2.HTML代码及模板：
 *      (1).首先需要一个空的div作为相册容器：
 *          <div class="popup hide" id="album_box"></div>
 *
 *      (2).模板分两部分，相册主模板和缩略图列表模板，模板使用jQuery.tmpl 插件的语法：
 *
 *      A.相册主模板类似下面：
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

 *      其中 title，desc，user_link，username，lv，ctime 这几个class是预先定义好的，和数据中的字段相对应，这些class可省略，
 *      如果省略，则程序不会在数据中查找对应的值，如果不省略，则数据中必须提供相应的值。
 *
 *      cur_num（当前图片序号），total（图片总数）不需手工指定，如果模板中出现这些class，则程序会自动给它们赋值。
 *
 *      close、img_box、photo-prev、photo-next、arrow-prev、arrow-next、thumb_box 等class名称对应于各种功能性按钮和容器。
 *
 *      以上class名称都可在配置参数中修改。
 *
 *      B.缩略图列表模板比较简单，类似下面：
 *      <script id="album_item_tmpl" type="text/x-jquery-tmpl">
 *          <li data-id="${id}" data-img="${thumb_url}"></li>
 *      </script>
 *      ${id} 是图片id，${thumb_url} 是缩略图url地址
 *
 * 3.数据：
 *      数据是一个二维数组，类似下面：
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

 * 4.JS代码：
    <script language="javascript" src="/js/jquery-1.8.1.min.js" type="text/javascript"></script>
    <script language="javascript" src="/js/jquery.tmpl.js" type="text/javascript"></script>
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
 * 使用实例：
 *      http://www.mafengwo.cn/hotel/info.php?iId=1588
 *
 *      ajax传入数据的例子：
 *      http://www.mafengwo.cn/gonglve/poi_v6.php?iId=1913
 * */
;(function($){
    var defaults= {
        template : '#album_tmpl',
        item_template : '#album_item_tmpl',
        close_btn : '.close',
        img_box : '.img_box',
        thumb_box : '.thumb_box',
        thumb_item : 'li',

        next_btn : '.photo-next',
        prev_btn : '.photo-prev',

        thumb_next_btn : '.arrow-next',
        thumb_prev_btn : '.arrow-prev',

        thumb_display_width : 600,
        thumb_height : 100,
        thumb_item_width : 100,
        thumb_focus_class : 'li_fous',

        max_height : 350,
        max_width : 600,

        mouse_arrow : true, //鼠标指针为左右切换箭头
        mask : false,  //背景遮障层

        thumb_lazy_load : true,  //缩略图是否延迟加载
        thumb_easing : 'swing',  //缩略图滚动动画效果,更多效果需要加载 jquery.easing.1.3.js
        thumb_speed : 800,
        loading_img : '/images/loading_gray2.gif',
        loading_width : 24,

        css_map : {
            cur_num : '.cur_num',
            total : '.total',
            title : '.title',
            desc : '.desc',
            user_link : '.user_link',
            username : '.username',
            lv : '.lv',
            ctime : '.ctime'
        },

        auto_open : false,
        z_index : '',

        //以下配置通常不需要更改
        loading_class : 'mfwAlbum_loading',
        thumb_loading_class : 'mfwAlbum_thumb_loading',
        thumb_lazy_load_box : 'mfwAlbum_lazy_load'
    };

    var methods = {
        init : function( options ) {
            var defaultSettings = $.extend({ }, defaults, options);
            return this.each(function() {
                var $this = $(this),
                    settings = $.extend({ }, defaultSettings);
                $this.data({ bssettings : settings, cur_id : null, arr_data : [], key_map : { } });
                $(settings.template).tmpl().appendTo($this);

                if ( settings.z_index!='' && parseInt(settings.z_index)>0 ) {
                    $this.css('zIndex', parseInt(settings.z_index));
                }

                //鼠标指针为左右切换箭头
                if (settings.mouse_arrow) {
                    var arrow_prev = '_mfwAlbum_arrow_prev',
                        arrow_next = '_mfwAlbum_arrow_next',
                        arrow = '_mfwAlbum_arrow';
                    $(settings.img_box).after('<div title="上一张" class="' + arrow_prev + ' ' + arrow + '" style="left:0; cursor: url(http://file.mafengwo.net/images/gonglve/arr_left.cur), auto;" ></div>' +
                        '<div title="下一张" class="' + arrow_next + ' ' + arrow + '" style="right:0; cursor: url(http://file.mafengwo.net/images/gonglve/arr_right.cur), auto;" ></div>');
                    $this.find('.' + arrow).css({ height:'100%', position:'absolute', top:0, width:'50%', zIndex: parseInt($this.css('zIndex')) + 1, background : "none repeat scroll 0 0 #FFFFFF", opacity:0 });
                    $this
                        .delegate('.' + arrow_prev, 'click', function() {
                            var arr_data = $this.data('arr_data'),
                                key_map = $this.data('key_map'),
                                cur_id = $this.data('cur_id'),
                                new_cur_num = key_map[cur_id] - 1;
                            if ( new_cur_num >= 0 ) {
                                _change($this, new_cur_num);
                            }
                        })
                        .delegate('.' + arrow_next, 'click', function() {
                            var arr_data = $this.data('arr_data'),
                                key_map = $this.data('key_map'),
                                cur_id = $this.data('cur_id'),
                                new_cur_num = key_map[cur_id] + 1;
                            if ( new_cur_num < arr_data.length ) {
                                _change($this, new_cur_num);
                            }
                        });
                } else {
                    $this
                        .delegate(settings.prev_btn, 'click', function() {
                            var arr_data = $this.data('arr_data'),
                                key_map = $this.data('key_map'),
                                cur_id = $this.data('cur_id'),
                                new_cur_num = key_map[cur_id] - 1;
                            if ( new_cur_num >= 0 ) {
                                _change($this, new_cur_num);
                            }
                        })
                        .delegate(settings.next_btn, 'click', function() {
                            var arr_data = $this.data('arr_data'),
                                key_map = $this.data('key_map'),
                                cur_id = $this.data('cur_id'),
                                new_cur_num = key_map[cur_id] + 1;
                            if ( new_cur_num < arr_data.length ) {
                                _change($this, new_cur_num);
                            }
                        });
                }
                $this
                    .delegate(settings.close_btn, 'click', function() {
                        methods['close'].apply($this, arguments);
                    })
                    .delegate(settings.thumb_box + '>' + settings.thumb_item, 'click', function() {
                        var cur_id = $(this).data('id');
                            methods['change'].call($this, cur_id);
                    })
                    .delegate(settings.thumb_next_btn, 'click', function() {
                        var box = $this.find(settings.thumb_box),
                            reamin_width = box.width() + parseInt(box.css('left')) - settings.thumb_display_width,
                            left;
                        if (reamin_width > 0) {
                            if (reamin_width < settings.thumb_display_width) {
                                left = parseInt(box.css('left')) - reamin_width;
                            } else {
                                left = parseInt(box.css('left')) - settings.thumb_display_width;
                            }
                            box.not(':animated').animate({ left : left }, settings.thumb_speed, settings.thumb_easing, function(){
                                if (settings.thumb_lazy_load) {
                                    load_curr_img($this);
                                }
                            });
                        }
                    })
                    .delegate(settings.thumb_prev_btn, 'click', function() {
                        var box = $this.find(settings.thumb_box),
                            left;
                        if (box.not(':animated') && parseInt(box.css('left')) < 0) {
                            if (-1 * parseInt(box.css('left')) < settings.thumb_display_width) {
                                left = 0;
                            } else {
                                left = parseInt(box.css('left')) + settings.thumb_display_width;
                            }
                            box.not(':animated').animate({ left : left }, settings.thumb_speed, settings.thumb_easing, function(){
                                if (settings.thumb_lazy_load) {
                                    load_curr_img($this);
                                }
                            });
                        }
                    });
                if ( true === settings.auto_open ) {
                    methods['open'].apply($this, arguments);
                } else {
                    methods['close'].apply($this, arguments);
                }
            });
        },
        open : function(cur_id) {
            return this.each(function () {
                var $this = $(this),
                    settings = $this.data('bssettings');
                if(settings.mask) {
                    var mask_class = '_mfwAlbum_mask',
                        $mask = $('.' + mask_class);
                    if ($mask.size()==0) {
                        $('<div class=" ' + mask_class +' "></div>').css({
                            position: 'absolute',
                            zIndex: $this.css('zIndex') - 1,
                            top: 0,
                            left: 0,
                            width: $(window).width(),
                            height: $(document).height(),
                            background: '#000000',
                            opacity: 0.6
                        }).appendTo($("body"));
                    } else {
                        $mask.show();
                    }
                }
                $this.fadeIn(300, function(){
                    if($this.data('is_setdata') == 1) {
                        lazy_load_init($this);
                    }
                    $this.data('is_open', 1);
                    if (cur_id!=undefined) {
                        methods['change'].call($this, cur_id);
                    }
                });
                if ($this.data('is_bandkeyevent') != 1) {
                    $(window).keydown($.proxy(keydown_fn, $this));
                    $this.data('is_bandkeyevent', 1);
                }

            });
        },
        setData : function(data, cur_id) {
            return this.each(function () {
                var $this = $(this),
                    settings = $this.data('bssettings');
                var n = 0 , first_id,
                    arr_data = [], key_map = { },
                    thumb_box_width = 0;
                for (k in data) {
                    if (data.hasOwnProperty(k)) {
                        if (n == 0) {
                            first_id = k;
                        }
                        arr_data[n] = data[k];
                        key_map[k] = n;
                        n += 1;
                        thumb_box_width += settings.thumb_item_width;
                    }
                }

                var $thumb_box = $this.find(settings.thumb_box);
                $thumb_box.width(thumb_box_width).css({ position : 'relative', left : 0 });
                $this.data('arr_data', arr_data);
                $this.data('key_map', key_map);
                $(settings.item_template).tmpl(arr_data).appendTo($thumb_box);
                $this.data('is_setdata', 1);
                if (cur_id!=undefined) {
                    methods['open'].call($this, cur_id);
                } else {
                    if($this.data('is_open') == 1) {
                        lazy_load_init($this);
                    }
                }
            });
        },
        close : function() {
            return this.each(function () {
                var $this = $(this),
                    settings = $this.data('bssettings');
                $this.fadeOut();
                if(settings.mask) {
                    $('._mfwAlbum_mask').remove();
                }
                $(window).unbind('keydown', keydown_fn);
                $this.data('is_bandkeyevent', 0);
            });
        },
        change : function(new_cur_id) {
            return this.each(function () {
                var $this = $(this);
                var key_map = $this.data('key_map'),
                    new_cur_num = key_map[new_cur_id];
                if ( new_cur_num != undefined ) {
                    _change($this, new_cur_num);
                }

            });
        }
    };

    function _change($this, new_cur_num) {
        var settings = $this.data('bssettings'),
            thumb_box = $this.find(settings.thumb_box),
            arr_data = $this.data('arr_data'),
            key_map = $this.data('key_map'),
            cur_id = $this.data('cur_id'),
            cur_num = key_map[cur_id];
        if (thumb_box.not(':animated').size()==1) {
            if ( cur_num !== new_cur_num ) {
                render($this, new_cur_num);
                $this.data('cur_id', arr_data[new_cur_num].id);
            }
            thumb_position($this, new_cur_num);
        }
    }

    function keydown_fn(event) {
        var $this = this,
            arr_data = $this.data('arr_data'),
            key_map = $this.data('key_map'),
            cur_id = $this.data('cur_id'),
            new_cur_num;
        switch(event.keyCode) {
            case 37:
                new_cur_num = key_map[cur_id] - 1;
                if ( new_cur_num >= 0 ) {
                    _change($this, new_cur_num);
                }
                break;
            case 39:
                new_cur_num = key_map[cur_id] + 1;
                if ( new_cur_num < arr_data.length ) {
                    _change($this, new_cur_num);
                }
                break;
        }
    }

    function lazy_load_init($this) {
        var settings = $this.data('bssettings');
        if (settings.thumb_lazy_load && $this.data('lazy_load_init')!=1) {
            var $thumb_box = $this.find(settings.thumb_box);
            var offset = $thumb_box.offset(),
                left_min = offset.left,
                left_max = left_min + settings.thumb_display_width;
            $this.data({ left_min : left_min, left_max : left_max });
            $thumb_box.find(settings.thumb_item).each(function() {
                $(this).css('position', 'relative').addClass(settings.thumb_lazy_load_box);
                $('<div class="' + settings.thumb_loading_class + '"><img src="' + settings.loading_img + '" style="width:' + settings.loading_width + 'px; height:' + settings.loading_width + 'px;"></div>').appendTo($(this))
                    .css({ position:'absolute', left:'50%', top:'50%', marginLeft:'-' + (settings.loading_width/2) + 'px', marginTop:'-' + (settings.loading_width/2) + 'px', width:settings.loading_width + 'px' });
            });
            $this.data('lazy_load_init', 1);
        }
    }

    function thumb_position($this, cur_num) {
        var settings = $this.data('bssettings'),
            thumb_box = $this.find(settings.thumb_box),
            arr_data = $this.data('arr_data'),
            relative_num = Math.floor(settings.thumb_display_width / settings.thumb_item_width), //一屏显示多少张图
            relative_prev_offset_num = Math.ceil(relative_num/2) - 1,
            relative_next_offset_num = relative_num - relative_prev_offset_num - 1,
            total = arr_data.length,
            offset_num = cur_num,
            thumb_box_left = parseInt(thumb_box.css('left')),
            need_animate = false,
            left;

        if ( total<=relative_num ) {
            need_animate = false;
        } else if (cur_num < relative_prev_offset_num) {
            //前几张
            if (thumb_box_left < 0) {
                need_animate = true;
                left = 0;
            }
        } else if (cur_num >= total - relative_next_offset_num - 1) {
            //后几张
            if (-1 * thumb_box_left < thumb_box.width() - settings.thumb_display_width) {
                need_animate = true;
                left = -1 * thumb_box.width() + settings.thumb_display_width;
            }
        } else {
            need_animate = true;
            //jquery 1.4 有bug，left超过-10000px时animate()动画效果不正常，请使用1.8.1版本jquery
            offset_num = cur_num - relative_prev_offset_num;
            left = -1 * offset_num * settings.thumb_item_width;
            /*
            var absolute_left = -1 * offset_num * settings.thumb_item_width;
            var disp;
            if (absolute_left < thumb_box_left) {
                disp = '-=' + (thumb_box_left - absolute_left);
            } else {
                disp = '+=' + (absolute_left - thumb_box_left) ;
            }*/
        }
        if (need_animate) {
            thumb_box.not(':animated').animate({ left : left }, settings.thumb_speed, settings.thumb_easing, function(){
                load_curr_img($this);
            });
        } else {
            load_curr_img($this);
        }
    }

    function render($this, cur_num) {
        var settings = $this.data('bssettings'),
            arr_data = $this.data('arr_data'),
            key_map = $this.data('key_map'),
            thumb_box = $this.find(settings.thumb_box),
            total = arr_data.length;

        $this.find(settings.css_map.total).text(total).end()
            .find(settings.css_map.cur_num).text(cur_num + 1).end()
            .find(settings.css_map.title).text(arr_data[cur_num].title).end()
            .find(settings.css_map.desc).text(arr_data[cur_num].desc).end()
            .find(settings.css_map.ctime).text(arr_data[cur_num].ctime).end()
            .find(settings.css_map.username).text(arr_data[cur_num].username).end()
            .find(settings.css_map.lv).text(arr_data[cur_num].lv).end()
            .find(settings.css_map.user_link).attr('href', arr_data[cur_num].user_link).end();

        thumb_box.children(settings.thumb_item + '.' + settings.thumb_focus_class).removeClass(settings.thumb_focus_class);
        thumb_box.children(settings.thumb_item).eq(cur_num).addClass(settings.thumb_focus_class);

        var img_url = arr_data[cur_num].img_url,
            $img_box = $this.find(settings.img_box);
        $('<div class="' + settings.loading_class + '"><img src="' + settings.loading_img + '"></div>').insertAfter($img_box)
            .css({ position:'absolute', left:'50%', top:'50%', marginLeft:'-' + (settings.loading_width/2) + 'px', marginTop:'-' + (settings.loading_width/2) + 'px', width: + settings.loading_width + 'px' });
        $img_box.hide();
        image_load(img_url, function(img){
            var img_height, img_width;
            $this.find('.' + settings.loading_class).remove();

            if(img.height > settings.max_height) {
                img_height = settings.max_height;
                img_width = Math.round(img_height * img.width / img.height);
            } else {
                img_height = img.height;
                img_width = img.width;
            }
            if(img_width > settings.max_width) {
                var tmp_width = img_width;
                img_width = settings.max_width;
                img_height = Math.round(img_height * img_width / tmp_width);
            }
            img_html = '<img src="' + img_url + '" style="width:' + img_width + 'px; height:' + img_height +
                'px; position:absolute; top:0; left:0; opacity: 1;">';
            $img_box.css({ width: img_width, height : img_height, position:'absolute', left : '50%', top : '50%',
                marginLeft : -1*img_width/2, marginTop : -1*img_height/2 }).html(img_html).fadeIn();
        });
    }

    function image_load(url, callback) {
        var img = new Image();
        $(img).load(function() {
            callback(img);
        });
        img.onerror = function(msg, url, line) {
            console.log('image load error:', msg, url, line);
            return true;
        };
        img.src = url;
    }

    function load_curr_img($this) {
        var settings = $this.data('bssettings'),
            $thumb_box = $this.find(settings.thumb_box),
            left_min = $this.data('left_min'),
            left_max = $this.data('left_max'),
            num = 0;
        $thumb_box.find(settings.thumb_item + '.' + settings.thumb_lazy_load_box).each(function() {
            var img_box = $(this),
                img_offset = img_box.offset(),
                img_left = img_offset.left,
                img_url = img_box.data('img');
            if (img_left>=left_min && img_left<left_max) {
                num += 1;
                image_load(img_url, function(img) {
                    img_box.append(img).removeData('img').removeClass(settings.thumb_lazy_load_box).children('.' + settings.thumb_loading_class).remove();
                });
            }
            if (num * settings.thumb_item_width >= settings.thumb_display_width) {
                return false;
            }
        });
    }

    $.fn.mfwAlbum = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.mfwCommentStar' );
            return false;
        }
    };
})(jQuery);