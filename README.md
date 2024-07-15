<center><h1>Hexo-Auto-FriendLink</h1></center>

--------------

新的Hexo友链管理后台系统，基于LeanCloud+Vercel

## 功能

- 友链后台管理
- Butterfly风格的YAML导入导出
- 博客页友链申请/修改系统
- Hexo静态生成友链

**友链修改暂未实现**

## TODO

- 兼容MongoDB
- 友链备份/恢复
- Hexo生成器用Node重写并插件化
- 更科学的模块化
- 自动新建class和表列
- 密码更改/初始化

## 项目结构

- 前端使用原生HTML+CSS+JS
- 后端使用Python+FastAPI，LeanCloud数据库
- Hexo生成器使用Python编写

本仓库为后台管理，使用Vercel即可前后端合一部署。

根目录的 html+js+css为项目前端，后端API为 `/api/xxx` 目录。

## 提示

目前适配于Butterfly主题，支持管理友链的分组 名称 链接 头像 描述以及背景色（在自己的博客中用到了），如果不需要背景色的话可以自己修改，在前端进行格式检查 xss过滤等。

友链隶属于不同的分组，申请友链时还会留下个人邮箱，在通过后邮箱将会被删除。

## 部署与配置

首先创建一个LeanCloud应用，并添加4个class `flink` `group` `login` `pending`。

在 `flink` class中添加几个列：

- avatar:string
- color:string
- descr:string
- group:number
- link:string
- name:string

在 `group` class中添加几个列：

- name:string
- descr:string
- id:number
- pos:number

在 `login` class中添加几个列

- allowtoken:array 初始值修改为 `[]`
- pwdsha:string 并将你想设置的密码转为sha256并转小写之后输入进去

在 `pending` class中添加几个列：

- avatar:string
- color:string
- descr:string
- email:string
- link:string
- name:string
- type:number

以上缺一不可，且类型不能错误。

建议使用LeanCloud国际版，然后获取APPURL的地理位置后修改Vercel的函数地理位置就近，这将大大增加面板的速度。

Fork这个仓库并创建一个Vercel项目，然后添加以下环境变量：

- `APPID`：LeanCloud应用ID
- `APPKEY`：LeanCloud应用Key
- `APPURL`：LeanCloud应用URL
- `GHTOKEN`: 在Github账户中新建一个Personal Access Token，并赋予`repo`权限，用于自动更新友链
- `GHREPO`: 你博客的Github仓库名，用于自动更新友链
- `SENDEMAIL`: 用于自动发送邮件的邮箱
- `MAILPASS`: 用于自动发送邮件的邮箱密码
- `SMTPHOST`: 用于自动发送邮件的邮箱SMTP服务器
- `SMTPPORT`: 用于自动发送邮件的邮箱SMTP服务器端口
- `OWNEREMAIL`: 博主的邮箱，用于接收友链申请

以上内容缺一不可，然后重新部署。

接下来请在你的博客的Action YAML中添加触发钩子：

```diff
...
on:
+  repository_dispatch:
+    types:
+    - hooklink
...
```

以及设置时区：

```diff
steps:
  ...
+  - name: 设置北京时区
+    uses: szenius/set-timezone@v1.2
+    with:
+      timezoneLinux: "Asia/Shanghai"
  ...
```

咕咕咕

## API文档

咕咕咕