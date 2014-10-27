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
            vm.$skipArray = ["widgetElement", "template", "navElem", "validAnchorIds", "validAnchorElems"];
            vm.navRelativeTop = 30;
            vm.navElem = null;
            vm.validAnchorIds = [];
            vm.validAnchorElems = [];

            // check scroll event to change nav bar
            var checkScroll = function() {
                // check if nav should fixed to top
                if (!vmodel.navElem) {
                    return;
                }

                // fixed to top
                var rectNav = vmodel.navElem.getBoundingClientRect();
                vmodel.fixed = rectNav.top < -vmodel.offsetY;
                vmodel.navRelativeTop = vmodel.fixed ? 0 : vmodel.offsetY;

                // change current active index
                var i, elem, activeSet = false;
                for (i = 0; i < vmodel.validAnchorElems.length; ++i) {
                    elem = vmodel.validAnchorElems[i];
                    if (elem.getBoundingClientRect().top > vmodel.navBarHeight) {
                        vmodel.activeIndex = i === 0 ? 0 : vmodel.validAnchorIds[i - 1];
                        activeSet = true;
                        break;
                    }
                }

                if (!activeSet) {
                    vmodel.activeIndex = vmodel.validAnchorIds[i - 1];
                }
            };

            // find out valid anchors
            var findValidAnchors = function() {
                vmodel.validAnchorIds.splice(0);
                vmodel.validAnchorElems.splice(0);
                for (var i = 0; i < vmodel.navItems.length; ++i) {
                    var hash = vmodel.navItems[i].anchor;
                    if (!!hash) {
                        var elem = document.getElementById(hash);
                        if (elem && elem.getBoundingClientRect().height > 0) {
                            vmodel.validAnchorIds.push(i);
                            vmodel.validAnchorElems.push(elem);
                        }
                    }
                }
            };

            vm.$init = function() {
                var pageHTML = options.template;
                element.style.display = "none";
                element.innerHTML = pageHTML;
                avalon.scan(element, [vmodel].concat(vmodels));
                element.style.display = "block";

                vmodel.navElem = element.getElementsByClassName("fixed-floating-nav-panel")[0];
                if (!vmodel.navElem) {
                    throw new Error("找不到导航条");
                }
                findValidAnchors();

                checkScroll = avalon.bind(window, "scroll", checkScroll);

                if (typeof options.onInit === "function") {
                    options.onInit.call(element, vmodel, options, vmodels);
                }
            };
            vm.$remove = function() {
                element.innerHTML = element.textContent = "";
                avalon.unbind(window, "scroll", checkScroll);
                vmodel.navElem = null;
                vmodel.validAnchorIds.splice(0);
                vmodel.validAnchorElems.splice(0);
            };

            // scroll to view
            vm.scrollToAnchorId = function(hash, el) {
                var navBar = document.getElementsByClassName("fixed-floating-nav-panel")[0];
                el = document.getElementById(hash) || getFirstAnchor(document.getElementsByName(hash));

                if (navBar && el) {
                    if (navBar.offsetTop > el.offsetTop) {
                        el.scrollIntoView();
                    } else {
                        window.scrollTo(0, el.offsetTop - vmodel.navBarHeight);
                    }
                } else {
                    window.scrollTo(0, 0);
                }
            };
        });
        vmodel.$watch("$all", function() {});

        return vmodel
    };

    widget.defaults = {
        navItems: [], //@param navItems navigation items
        onInit: avalon.noop, //@optMethod onInit(vmodel, options, vmodels) 完成初始化之后的回调,call as element's method
        panelHeight: 110,
        navBarHeight: 40,
        offsetY: 30, // to the top of panel
        getTemplate: function(tmpl, opts) {
            return tmpl;
        }, //@optMethod getTemplate(tpl, opts, tplName) 定制修改模板接口
        $author: "maogm12@gmail.com"
    }
});