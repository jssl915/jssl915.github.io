后台管理框架

这套框架主要分为三个部分(项目)

1 mybatis-generator 代码生成器(工具项目) 支持oracle 和 mysql

2 com_service 服务端项目，主要提供服务，支持oracle 和 mysql

3 com_system 客户端项目，主要显示前端页面，有两个版本operamasks 和 easyui

框架技术

后台技术主要用到:

框架是用的springMVC+mybatis，远程调用用的是httpInvoker(http协议)，缓存是用的oscache(目前用于数据字典的缓存）,安全框架用的是shiro，主要用于用户登录，定时器之前的用的是 spring 的 quartz,支持动态修改定时规则。还可以用Spring升级到3.0版本后自带的任务调度器Spring task，分页用的是mybatis自带的，只不过针对oracle和mysql进行了相应扩展，将原来在内存中分页改为在数据库中进行分页。

前台技术主要用到:

主要插件用的是operamasks2.0(包括grid,tree,tab等)和easyui1.4.1,弹出框用的artDialog,表单验证用的是框架自带的validator,图表插件用的highcharts-4.0.3。所用的开源插件基本都是最新版本。另外还自己封装了一些jquery插件，如左边的菜单树，图片上传拖拽排序功能等。


框架优势

一、兼容所有主流浏览器,已测试过的有火狐firefox、谷哥chrome、苹果safari、360浏览器、ie9、ie8(稍有不同，css3圆角属性不支持)等。另外ie6、ie7存在的问题比较大，不过如果需要，我可以做相关方面的兼容工作。

二、针对本套框架实现的代码生成器，可以生成大部分代码，对于业务逻辑比较简单的模块即不需要关联多张表查询的模块生成后(entity、mapper、service)直接可以使用，基本不需要做任何
修改。可以节约大部分开发时间。

虽然可以对web层(也可以说是controller层)和jsb层进行封装，甚至可以在java代码里拼接jsp页面，但感觉有点过度封装，反而增加了开发的难度，从而会增加程序员的负担。

三、服务端service项目利用多态和泛型将代码生成器生成的八个公共方法写入父类。另外这套框架重新封装了一些公共方法，并且将之前项目中没有用到的、重复的、过于复杂的代码进行重构，至少目前看来代码是比较干净和整洁的。

客户端对于公用方法如查询、新增、编辑、删除、导出等方法实现了公共的函数，并尽可能的使其调用简单。另外对于jsp页面也进行了简化，定义了一些常用的样式，如search框里的表单按钮，弹出层的表单和按钮等。

四、系统管理模块数据库表进行了重新设计，将一些没用的表、字段进行了整理和删除，目前只有八张表：用户表T_S_USER、角色表T_S_ROLE、菜单表T_S_MENU、日志表T_S_LOG、角色菜单关联表T_S_ROLE_MENU、角色用户关联表T_S_USER_ROLE、字典表T_S_DICT、字典明细表T_S_DETAIL

框架DEMO

mysql-operamasks:http://192.168.1.59:8081/com_mysql_system

mysql-easyui: http://192.168.1.59:8082/com_easyui_system

oracle-operamasks: http://192.168.1.59:8083/com_operamasks_system

部分代码介绍

八个公共接口:

public abstract void insert(T paramT); //新增

public void deleteByCondition(Map condition);//按条件删除

public void updateByCondition(T record);//按条件修改

public List selectByCondition(Map condititon);//按条件查询

public Integer countByCondition(Map condititon);//按条件查询总数

public abstract List selectByCondition(Map condititon, RowBounds rowBounds);//按条件查询分页

public void deleteByPrimaryKey(Long id); //根据主键删除

public T findByPrimaryKey(Long id); //根据主键查询

这八个方法对于单表来说，基本上实现了所有接口，如果需要查询多表或操作多表，需要自己定义接口，实现方法。


另外这里有架构中一些技术的总结:

shiro 实现拦截功能，并记住拦截前地址，登录后直接跳转到记录地址 

http://www.cnblogs.com/lj915/p/3443590.html

spring+quartz实现动态修改定时规则

http://www.cnblogs.com/lj915/p/3444930.html

mybatis在mysql中的分页扩展

http://www.cnblogs.com/lj915/p/4262732.html

mybatis在oracle中的分页扩展

http://www.cnblogs.com/lj915/p/4262743.html
