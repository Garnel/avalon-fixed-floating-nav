/**
 * @fixedFloatingNav组件，
 **/

define(["avalon",
    "text!./fixedFloatingNav.html",
    "css!./fixedFloatingNav.css"
], function(avalon, template) {
    var widget = avalon.ui.fixedfloatingnav = function(element, data, vmodels) {
        var options = data.fixedfloatingnavOptions;
        options.template = options.getTemplate(template, options);

        //得到页面第一个符合条件的A标签
        function getFirstAnchor(list) {
            for (var i = 0, el; el = list[i++]; ) {
                if (el.nodeName === "A") {
                    return el
                }
            }
        }

        var vmodel = avalon.define(data.fixedfloatingnavId, function(vm) {
            avalon.mix(vm, options);
            vm.widgetElement = element;
            vm.fixed = false;
            vm.activeIndex = 0;
            vm.$skipArray = ["widgetElement", "template", "validAnchorIds"];
            vm.validAnchorIds = [];

            // check scroll event to change nav bar
            var checkScroll = function() {
                // check if nav should fixed to top
                var navBar = document.getElementsByClassName("fixed-floating-nav")[0];
                var rectNav = navBar.getBoundingClientRect();
                vmodel.fixed = rectNav.top < -30;

                // change current active index
                var prevValidId = -1;
                for (var i = 0; i < vmodel.navItems.length; ++i) {
                    var hash = vmodel.navItems[i].anchor;
                    if (!!hash) {
                        var elem = document.getElementById(hash);
                        if (!elem) {
                            continue;
                        }

                        if (elem.getBoundingClientRect().top > 40) {
                            vmodel.activeIndex = prevValidId == -1 ? 0 : prevValidId;
                            prevValidId = i;
                            break;
                        } else {
                            prevValidId = i;
                        }
                    }
                }

                if (i === vmodel.navItems.length) {
                    vmodel.activeIndex = prevValidId == -1 ? 0 : prevValidId;
                }
            };

            vm.$init = function() {
                var pageHTML = options.template;
                element.style.display = "none";
                element.innerHTML = pageHTML;
                avalon.scan(element, [vmodel].concat(vmodels));
                element.style.display = "block";

                checkScroll = avalon.bind(window, "scroll", checkScroll);

                if (typeof options.onInit === "function") {
                    options.onInit.call(element, vmodel, options, vmodels);
                }
            };
            vm.$remove = function() {
                element.innerHTML = element.textContent = "";
                avalon.unbind(window, "scroll", checkScroll);
            };

            // scroll to view
            vm.scrollToAnchorId = function(hash, el) {
                var navBar = document.getElementsByClassName("fixed-floating-nav")[0];
                el = document.getElementById(hash) || getFirstAnchor(document.getElementsByName(hash));

                if (navBar && el) {
                    if (navBar.offsetTop > el.offsetTop) {
                        el.scrollIntoView();
                    } else {
                        window.scrollTo(0, el.offsetTop - 40);
                    }
                } else {
                    window.scrollTo(0, 0)
                }
            };
        });
        vmodel.$watch("$all", function() {});

        return vmodel
    };

    widget.defaults = {
        navItems: [], //@param navItems navigation items
        onInit: avalon.noop, //@optMethod onInit(vmodel, options, vmodels) 完成初始化之后的回调,call as element's method
        getTemplate: function(tmpl, opts) {
            return tmpl;
        }, //@optMethod getTemplate(tpl, opts, tplName) 定制修改模板接口
        $author: "maogm12@gmail.com"
    }
});