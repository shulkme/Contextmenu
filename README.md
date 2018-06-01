# Contextmenu

> 基于jQuery右键菜单插件，支持创建多个菜单，动态 增删改  菜单项，销毁菜单。

## 引用
1. 首先需要在 `<head>`  引入css样式，可以是包含自定义后的样式文件
``` html
<link rel="stylesheet" href="[Your project path]/dist/contextmenu.css">
```
2. 然后在 `</body>` 前引入JavaScript文件，两者都是必要的
``` html
<script src="[Your project path]/src/jquery.min.js"></script>
<script src="[Your project path]/dist/contextmenu.js"></script>
```
## 构建
1. 页面内需要一个容器，默认是body，该容器内将屏蔽系统默认右键菜单
   示例：
``` html
<div class="wrapper"></div>
```
2. 然后在 `<script>` 实例化菜单
``` javascript
var menu= new Contextmenu();
```
这样就创建了基本的右键菜单功能，当然这样还不能满足实际场景需求，先来看看基本的配置参数

## 参数

| 参数         | 默认值               | 规范   | 解释           |
| ---------- | ----------------- | ---- | ------------ |
| name       | menu              | 必选   | 菜单id，多个菜单不重复 |
| wrapper    | body              | 必选   | 菜单作用区域的容器    |
| trigger    | body              | 必选   | 触发器          |
| item       | [{"name":"item"}] | 必选   | 菜单项，json数据   |
| target     | "_blank"          | 可选   | 链接跳转方式       |
| beforeFunc | null              | 可选   | 触发器触发前执行函数   |

#### item 参数

| 名称      | 默认值   | 规范                       | 解释      |
| ------- | ----- | ------------------------ | ------- |
| name    | ""    | 如果为 ‘-’ 则为分割线            | 菜单名     |
| func    | null  | 已经构建的函数名，如alert();       | 菜单项执行函数 |
| link    | null  | 非null时为可跳转链接的菜单项         | 跳转链接    |
| disable | false | false不启用禁用菜单项，true禁用该菜单项 | 是否禁用菜单项 |

这里举一个简单的构造示例：
```javascript
var menu= new Contextmenu({
	name:"menu",
    wrapper:".wrapper",
    trigger: ".item",
    item:[{
            "name":"点击事件",
            "func":"setText()",
            "link":null,
            "disable":false
          },
          {
            "name":"跳转链接",
            "link":"https://github.com/shulkme/Contextmenu",
            "disable":false
          },
          {
            "name":"禁用项",
            "disable":true
          },
          {
            "name":"-"
          },
          {
            "name":"删除菜单项",
            "func":"delItem()"
          },
          {
            "name":"更新菜单项",
            "func":"updateItem()"
          },
          {
            "name":"新增菜单项",
            "func":"addItem()"
          },
          {
            "name":"-"
          },
          {
            "name":"移除菜单",
            "func":"removeMenu()"
          },
          {
            "name":"关闭"
          }
    ],
    target:"_blank",
    beforeFunc: function (ele) {
       
    }
});
```

这样就完成了菜单的构建，这时候在指定容器的触发器元素右击就可以出现菜单啦，每个菜单项对应的点击事件，即 `func` 需要用户自定义，而菜单中 `beforeFunc` 函数的用处就是传递变量过程，通常的用法就是在调用菜单之前先判断是哪个触发器发生事件，或者是其它的全局变量，可以自行定义，当然默认为空。

## 动态

> Contextmenu 菜单支持动态增删改菜单项，以及销毁菜单

`add()` 、`del()` 、 `update()` 、`destroy()`  都是自带方法，每个实例化的对象都可以直接调用

| 函数名       | 参数        | 解释     |
| --------- | --------- | ------ |
| add()     | [options] | 添加新菜单项 |
| del()     | index     | 删除菜单项  |
| update()  | [options] | 更新菜单项  |
| destroy() | null      | 销毁菜单   |

1. `add()` 增加新的菜单项

   `add()` 是需要传递参数的，要求和规范如同上面实例的item参数，传递的也是json数据，每个参数都有默认值，所以都不是必选项，下面举一个简单的例子

   ```javascript
   //添加一个名为 "新增项" 的菜单，无点击事件，非跳转链接，非禁用状态，在菜单顶部位置插入
   menu.add({
   	index: 0,
   	name:"新增项",
   	func:"",
   	link:null,
   	disable:false
   });
   ```
   这样的添加方式是最标准的，其它参数跟之前一样，但新增一个 `index` 参数

   | 名称    | 默认值  | 规范                       | 解释        |
   | ----- | ---- | ------------------------ | --------- |
   | index | -1   | 大于等于0或小于等于菜单项原始长度，否则都为-1 | 新增菜单项索引位置 |

   `index` 参数就是指定新插入的菜单项放置在菜单的位置，取值范围在0到原始菜单长度内，将替换对应位置，其后的菜单项整体后移一位，如果不定义或不满足范围，将默认在菜单项最后端插入，也就是默认值-1。通常情况下，使用该功能还需要考虑整体的索引变化，新插入的菜单项如果更新了整体的排列，需要考虑其它菜单项的索引变化。

   如果熟悉默认参数的话，还可以简写这段代码

   ```javascript
   //添加一个名为 "新增项" 的菜单项，在菜单末尾添加
   menu.add({
   	name:"新增项"
   });
   ```

2. `del()`  删除原有的指定菜单项

   `del()`  是需要传递参数的，而且是必选参数，就是 `index` 参数，用来指定删除对象的索引，这个索引是根据整个菜单的排列布局，你可以理解为数组，起始下标为0，调用该方法后是不影响其它索引的，换句话说，删除其实本质是隐藏该菜单项，因此它的索引没有占空，仍然保留，这样的目的就是不影响其它索引。下面是标准的调用示例

   ``` javascript
   //删除菜单下标索引为4的菜单项
   menu.del(4);
   ```

3. `update()` 更新指定菜单项

   `update()` 同样需要参数，而且所有的参数跟 `add()` 的参数基本相同，只有 `index` 参数不同，这里的`index` 参数是指明需要更新的菜单项，必须是现存的菜单项，否则事件不响应，而且除了`index` 参数是必选外，其它参数都有默认值，可以不填，但实际场景中是需要的，不然就没有任何意义。下面是标准的调用示例

   ``` javascript
   //更新菜单下标索引为4的菜单项
   menu.update({
   	index: 4,
   	name:"github",
   	func:"",
   	link:"https://github.com/shulkme/Contextmenu",
   	disable:false
   });
   ```

4. `destroy()` 销毁已经存在的菜单

   `destroy()` 是不需要参数的，因为调用的实例对象已经指定，销毁后的菜单项无法重新启用，只能通过新建菜单的方法添加新菜单，同样的，销毁后的菜单会释放该区域容器的右击绑定，也就是恢复系统右击事件。下面是标准调用示例

   ``` javascript
   //销毁名为 menu 的菜单
   menu.destroy();
   ```

   如果同一区域存在多个不同的菜单，那么会影响到其它菜单的调用，因为实际场景中，通常一个区域绑定一个菜单，因此，暂时不考虑这种情况，如果需要，可以自行绑定系统右击事件，直接调用`prevent(ele)` 的内置函数就可以了，这里的 `ele` 参数就是该菜单所在区域容器的对象。如 `prevent(".wrapper")` 。
