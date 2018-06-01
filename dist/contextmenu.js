/**
 * Contextmenu
 * @func  init      初始化函数
 * @func  add       添加菜单项
 * @func  del       删除菜单项
 * @func  update    更新菜单项
 * @func  destroy   销毁菜单
 *
 *
 * author:  Shulk
 * source:  https://github.com/shulkme/Contextmenu
 * build:   2018/5/31
 * version: 1.0.0
 */
;(function($, window, document,undefined) {
    "use strict"
    var _global;
    //定义Contextmenu的构造函数
    var Contextmenu = function(opt) {
        this.defaults = {
            name : "menu",//菜单名称id
            wrapper : "body",//菜单所属容器区域，该区域将禁止系统右键菜单
            trigger : "body",
            item : [{
                    "name":"item",
                    /*"func":"",
                    "link":null,
                    "disable":false*/
                    }
            ],
            target : "_blank",
            beforeFunc: function () {
                //打开菜单前执行自定义函数
            }
        },
        this.options = $.extend({}, this.defaults, opt);
        this.init();
    }
    //定义Beautifier的方法
    Contextmenu.prototype = {
        //初始化实例
        init: function() {
            var obj = this;
            obj.createMenu(obj);
            obj.prevent(obj.options.wrapper);
            obj.bindHead(obj,obj.options.trigger,obj.options.wrapper,obj.options.name);
        },
        //创建菜单
        createMenu:function (_this) {
            var menuName = _this.options.name;
            var menuWrapper = $(_this.options.wrapper);
            var itemArr = _this.options.item;
            var itemTarget = _this.options.target;
            var itemName = '';
            var itemFunc = '';
            var itemLink = null;
            var itemDisable = false;
            var $html = '';
            $html ='<div class="contextmenu" id="'+ menuName +'">';
            $html += '<ul>';
            for (var i = 0; i < itemArr.length; i++) {
                itemName = itemArr[i]["name"] ? $.trim(itemArr[i]["name"]) : '';
                itemFunc = itemArr[i]["func"] ? 'onclick="'+itemArr[i]["func"] + '"': '';
                itemLink = itemArr[i]["link"] ? itemArr[i]["link"] : null;
                itemDisable = itemArr[i]["disable"] ? itemArr[i]["disable"] : false;

                if (itemName=="-") {
                    $html +='<li class="menu-line"></li>';
                }else{
                    $html += '<li class="menu-item ';
                    $html += itemDisable ? 'menu-disable' : '';
                    if (itemLink==null) {
                        $html += '" '+itemFunc+'>';
                        $html += itemName+'</li>';
                    }else{
                        $html += '"><a href="'+itemLink+'" class="menu-link" target="'+itemTarget+'">';
                        $html += itemName+'</a></li>';
                    }
                }
            }
            $html += '</ul>';
            $html += '</div>';
            menuWrapper.css("position" , "relative");
            menuWrapper.append($html);
        },
        //绑定菜单点击事件
        bindHead: function (_this,ele,wrapper,menu) {
            $(ele).mousedown(function(e) {
                //绑定鼠标右击事件
                if (3 == e.which) {
                    (_this.options.beforeFunc)(this);//菜单调用前函数

                    var mouseX = _this.getMousePoint(e).x; //鼠标相对文档的X坐标
                    var mouseY = _this.getMousePoint(e).y; //鼠标相对文档的Y坐标
                    var wrapperX = $(wrapper).offset().left; //容器相对文档的X坐标
                    var wrapperY = $(wrapper).offset().top; //容器相对文档的Y坐标
                    var MtoW_X = Math.floor(mouseX - wrapperX); //鼠标在容器中的相对位置 X
                    var MtoW_Y = Math.floor(mouseY - wrapperY); //鼠标在容器中的相对位置 Y
                    var W_w = $(wrapper).width(); //容器宽度
                    var W_h = $(wrapper).height(); //容器高度
                    var M_w = $('#'+menu).width(); //菜单宽度
                    var M_h = $('#'+menu).height(); //菜单高度
                    var P_top = 0; //菜单相对容器定位 Y
                    var P_left = 0; //菜单相对容器定位 X
                    var W_scroll_top = $(wrapper).scrollTop(); //容器滚动条的距离 Y 
                    var W_scroll_left = $(wrapper).scrollLeft(); //容器滚动条的距离 X 
                    //计算菜单出现的实际定位坐标，防止菜单被遮挡,这里加减3目的是解决firefox下文档点击的bug,防止鼠标溢出
                    P_top = ( W_h - MtoW_Y >= M_h && W_h - MtoW_Y < W_h ) ? MtoW_Y - 3 : MtoW_Y - M_h + 3; 
                    P_left = ( W_w - MtoW_X >= M_w && W_w - MtoW_X < W_w ) ? MtoW_X - 3: MtoW_X - M_w + 3;

                    //设置菜单出现的位置
                    $('#'+menu).addClass('contextmenu-visible');
                    $('#'+menu).css({
                        left: P_left + W_scroll_left + 'px',
                        top: P_top + W_scroll_top + 'px'
                    });
                }
            });
            $(document).click(function(e) {
                if ($(e.target).attr('class')!="contextmenu") {
                   $('.contextmenu').removeClass('contextmenu-visible'); 
                }
            });
        },
        //禁用系统右键菜单
        prevent: function (ele) {
            $(ele).bind("contextmenu", function(){
                return false;
            });
        },
        getMousePoint: function (ev) {
            //定义鼠标在视窗中的位置 
            var point={ 
                x:0, 
                y:0 
            }; 
            //如果浏览器支持 pageYOffset, 通过 pageXOffset 和 pageYOffset 获取页面和视窗之间的距离 
            if(typeof window.pageYOffset!='undefined'){ 
                point.x=window.pageXOffset; 
                point.y=window.pageYOffset; 
            } 
            //如果浏览器支持 compatMode, 并且指定了 DOCTYPE, 通过 documentElement 获取滚动距离作为页面和视窗间的距离 
            //IE 中, 当页面指定 DOCTYPE, compatMode 的值是 CSS1Compat, 否则 compatMode 的值是 BackCompat 
            else if(typeof document.compatMode!='undefined'&&document.compatMode!='BackCompat'){ 
                point.x=document.documentElement.scrollLeft; 
                point.y=document.documentElement.scrollTop; 
            } 
            //如果浏览器支持 document.body, 可以通过 document.body 来获取滚动高度 
            else if(typeof document.body!='undefined'){ 
                point.x=document.body.scrollLeft; 
                point.y=document.body.scrollTop; 
            } 
            //加上鼠标在视窗中的位置 
            point.x+=ev.clientX; 
            point.y+=ev.clientY; 
            //返回鼠标在视窗中的位置 
            return point; 
        },
        deviation: function (ele) {
            //用于判断容器是否出现滚动条，防止滚动条占用容器宽度，
            //从而影响菜单显示，只有在有滚动条的时候才用这个偏差问题
            //待解决
            var flog = false; 
            
        },
        //更新现存的菜单项
        update: function (opts) {
            //console.log(opts);
            var count = $('#'+this.options.name).children('ul').children('li').length;
            if (opts.index < 0 || opts.index > count -1) {
                console.log("指定的索引下标不在菜单项中！")
            }else{
                var ele = $('#'+this.options.name).children('ul').children('li').eq(opts.index);
                var target = this.options.target;
                var name = opts.name ? $.trim(opts.name) : ele.text();
                var func = opts.func ? opts.func : ( ele.attr("onclick") ? ele.attr("onclick") : '' );
                var link = opts.link!== undefined ? opts.link : ( ele.children('.menu-link').attr("href") ? ele.children('.menu-link').attr("href") : null );
                var disable = opts.disable!== undefined ? opts.disable : ( ele.hasClass('menu-disable') ? true : false );
                var $html='';
                if (name=="-") {
                    ele.attr("class","menu-line");
                    ele.removeClass('menu-item');
                    ele.removeClass('menu-disable');
                }else{
                    if(link==null){
                        if (func!='') {
                            ele.attr('onclick', func);
                        }
                        $html = name;
                    }else{
                        $html = '<a href="'+link+'" class="menu-link" target="'+target+'">';
                        $html += name + '</a>';
                    }
                    if (disable) {
                        ele.addClass('menu-disable');
                    }else{
                        ele.removeClass('menu-disable');
                    }
                } 
                ele.html($html);
            }
            
        },
        //添加新菜单项
        add:function (opts) {
            var ele = $('#'+this.options.name).children('ul');
            var target = this.options.target;
            var count = $('#'+this.options.name).children('ul').children('li').length;
            var index = opts.index!== undefined  && opts.index<= count ? opts.index : -1;
            var name = opts.name ? $.trim(opts.name) : '';
            var func = opts.func ? 'onclick="' + opts.func + '"' : '';
            var link = opts.link ? opts.link :  null ;
            var disable = opts.disable ? opts.disable : false;
            var $html='';
            if (name=="-") {
                $html +='<li class="menu-line"></li>';
            }else{
                $html += '<li class="menu-item ';
                $html += disable ? 'menu-disable' : '';
                if (link==null) {
                    $html += '" '+func+'>';
                    $html += name+'</li>';
                }else{
                    $html += '"><a href="'+link+'" class="menu-link" target="'+target+'">';
                    $html += name+'</a></li>';
                }
            }
            if (index<=-1) {
                ele.append($html);
            }else{
                ele.children('li').eq(index).before($html);
            }
        },
        del: function (index) {
            $('#'+this.options.name).children('ul').children('li').eq(index).hide();
        },
        destroy: function () {
            $(this.options.wrapper).unbind("contextmenu");//启用系统右键菜单
            $('#'+this.options.name).remove();
        }
    }
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = Contextmenu;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return Contextmenu;});
    } else {
        !('Contextmenu' in _global) && (_global.Contextmenu = Contextmenu);
    }
})(jQuery, window, document);
