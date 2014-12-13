# Fixed Floating Navigation Bar for Avalonjs

一个页面内导航的 avalonjs 插件，可以在滚动时固定在头部

demo 页面请看[这里](maogm.com/projects/fixedfloatingnav/example.html)

## 功能

1. 滚动时固定在顶部
2. 点击导航项跳转到相应锚点
3. 在滚动到某个区域的时候高亮显示当前区域的导航项
4. 自动从 `nav` 标签里面的 `a` 便签里面解析导航项

## 用法

用起来超级简单，在模型里面配置项目名字和要跳转的锚点 id 就 OK 了:

    fixedfloatingnav: {
        navItems: [
            {label: "项目一", anchor: "item1"},
            {label: "项目二", anchor: "item2"}
        ]
        panelHeight: 110,   // 导航条容器的高度
        navBarHeight: 40,   // 导航条高度
        offsetY: 30,    // 导航条在容器内的相对位移
    },

如果你使用 `bower`

    bower install avalon-fixed-floating-nav
