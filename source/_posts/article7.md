---
title: 30个类手写Spring核心原理之自定义ORM
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/img/0006.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/img/0006.jpg
top: true
cover: true
toc: true
mathjax: true
summary: 选自《Spring 5核心原理》
tags: Java
categories: Java
abbrlink: 60214
date: 2021-12-21 08:57:30
password:
---

## 1 实现思路概述[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#1--实现思路概述)

### 1.1 从 ResultSet 说起[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#11--从resultset说起)

说到 ResultSet，有 Java 开发经验的“小伙伴”自然最熟悉不过了，不过我相信对于大多数人来说也算是“最熟悉的陌生人”。从 ResultSet 取值操作大家都会，比如：

    private static List<Member> select(String sql) {
        List<Member> result = new ArrayList<>();
        Connection con = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;
        try {
            //1. 加载驱动类
            Class.forName("com.mysql.jdbc.Driver");
            //2. 建立连接
            con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/gp-vip-spring-db-demo", "root","123456");
            //3. 创建语句集
            pstm =  con.prepareStatement(sql);
            //4. 执行语句集
            rs = pstm.executeQuery();
            while (rs.next()){
                Member instance = new Member();
                instance.setId(rs.getLong("id"));
                instance.setName(rs.getString("name"));
                instance.setAge(rs.getInt("age"));
                instance.setAddr(rs.getString("addr"));
                result.add(instance);
            }
            //5. 获取结果集
        }catch (Exception e){
            e.printStackTrace();
        }
        //6. 关闭结果集、关闭语句集、关闭连接
        finally {
            try {
                rs.close();
                pstm.close();
                con.close();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return result;
    }

以上我们在没有使用框架以前的常规操作。随着业务和开发量的增加，在数据持久层这样的重复代码出现频次非常高。因此，我们就想到将非功能性代码和业务代码进行分离。我们首先想到将 ResultSet 封装数据的代码逻辑分离，增加一个 mapperRow()方法，专门处理对结果的封装，代码如下：

    private static List<Member> select(String sql) {
        List<Member> result = new ArrayList<>();
        Connection con = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;
        try {
            //1. 加载驱动类
            Class.forName("com.mysql.jdbc.Driver");
            //2. 建立连接
            con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/gp-vip-spring-db-demo", "root","123456");
            //3. 创建语句集
            pstm =  con.prepareStatement(sql);
            //4. 执行语句集
            rs = pstm.executeQuery();
            while (rs.next()){
                Member instance = mapperRow(rs,rs.getRow());
                result.add(instance);
            }
            //5. 获取结果集
        }catch (Exception e){
            e.printStackTrace();
        }
        //6. 关闭结果集、关闭语句集、关闭连接
        finally {
            try {
                rs.close();
                pstm.close();
                con.close();
            }catch (Exception e){
                e.printStackTrace();
            }
        }
        return result;
    }

    private static Member mapperRow(ResultSet rs, int i) throws Exception {
        Member instance = new Member();
        instance.setId(rs.getLong("id"));
        instance.setName(rs.getString("name"));
        instance.setAge(rs.getInt("age"));
        instance.setAddr(rs.getString("addr"));
        return instance;
    }

但在真实的业务场景中，这样的代码逻辑重复率实在太高，上面的改造只能应用 Member 类，换一个实体类又要重新封装，聪明的程序员肯定不会通过纯体力劳动给每一个实体类写一个 mapperRow()方法，一定会想到代码复用方案。我们不妨来做这样一个改造。
先创建 Member 类：

    package com.gupaoedu.vip.orm.demo.entity;

    import lombok.Data;

    import javax.persistence.Entity;
    import javax.persistence.Id;
    import javax.persistence.Table;
    import java.io.Serializable;

    @Entity
    @Table(name="t_member")
    @Data
    public class Member implements Serializable {
        @Id private Long id;
        private String name;
        private String addr;
        private Integer age;

        @Override
        public String toString() {
            return "Member{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", addr='" + addr + '\'' +
                    ", age=" + age +
                    '}';
        }
    }

​  
 优化 JDBC 操作：

​  
 public static void main(String[] args) {
Member condition = new Member();
condition.setName("Tom");
condition.setAge(19);
List<?> result = select(condition);
System.out.println(Arrays.toString(result.toArray()));
}

    private static List<?> select(Object condition) {

        List<Object> result = new ArrayList<>();

        Class<?> entityClass = condition.getClass();

        Connection con = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;
        try {
            //1. 加载驱动类
            Class.forName("com.mysql.jdbc.Driver");
            //2. 建立连接
            con = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/gp-vip-spring-db-demo? characterEncoding=UTF-8&    rewriteBatchedStatements=true","root","123456");

            //根据类名找属性名
            Map<String,String> columnMapper = new HashMap<String,String>();
            //根据属性名找字段名
            Map<String,String> fieldMapper = new HashMap<String,String>();
            Field[] fields =  entityClass.getDeclaredFields();
            for (Field field : fields) {
                field.setAccessible(true);
                String fieldName = field.getName();
                if(field.isAnnotationPresent(Column.class)){
                    Column column = field.getAnnotation(Column.class);
                    String columnName = column.name();
                    columnMapper.put(columnName,fieldName);
                    fieldMapper.put(fieldName,columnName);
                }else {
                    //默认就是字段名、属性名一致
                    columnMapper.put(fieldName, fieldName);
                    fieldMapper.put(fieldName,fieldName);
                }
            }

            //3. 创建语句集
            Table table = entityClass.getAnnotation(Table.class);
            String sql = "select * from " + table.name();

            StringBuffer where = new StringBuffer(" where 1=1 ");
            for (Field field : fields) {
                Object value =field.get(condition);
                if(null != value){
                    if(String.class == field.getType()) {
                        where.append(" and " + fieldMapper.get(field.getName()) + " = '" + value + "'");
                    }else{
                        where.append(" and " + fieldMapper.get(field.getName()) + " = " + value + "");
                    }
                    //其他的在这里就不一一列举，后面我们手写ORM框架时会完善
                }
            }
            System.out.println(sql + where.toString());
            pstm =  con.prepareStatement(sql + where.toString());

            //4. 执行语句集
            rs = pstm.executeQuery();

            //元数据？
            //保存了处理真正数值以外的所有附加信息
            int columnCounts = rs.getMetaData().getColumnCount();
            while (rs.next()){
                Object instance = entityClass.newInstance();
                for (int i = 1; i <= columnCounts; i++) {
                    //实体类属性名，对应数据库表的字段名
                    //可以通过反射机制拿到实体类的所有字段

                    //从rs中取得当前这个游标下的类名
                    String columnName = rs.getMetaData().getColumnName(i);
                    //有可能是私有的
                    Field field = entityClass.getDeclaredField(columnMapper.get(columnName));
                    field.setAccessible(true);
                    field.set(instance,rs.getObject(columnName));
                }

                result.add(instance);

            }

            //5. 获取结果集
        }catch (Exception e){
            e.printStackTrace();
        }
        //6. 关闭结果集、关闭语句集、关闭连接
        finally {
            try {
                rs.close();
                pstm.close();
                con.close();
            }catch (Exception e){
                e.printStackTrace();
            }
        }

        return result;
    }

上面巧妙地利用反射机制读取 Class 信息和 Annotation 信息，将数据库表中的列和类中的字段进行关联映射并赋值，以减少重复代码。

### 1.2 为什么需要 ORM 框架[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#12--为什么需要orm框架)

通过前面的讲解，我们已经了解 ORM 框架的基本实现原理。ORM 是指对象关系映射（Object Relation Mapping），映射的不只是对象值，还有对象与对象之间的关系，例如一对多、多对多、一对一这样的表关系。现在市面上 ORM 框架也非常多，有大家所熟知的 Hibernate、Spring JDBC、MyBatis、JPA 等。在这里做一个简单的总结，如下表所示。

| 名称        | 特征         | 描述                                              |
| ----------- | ------------ | ------------------------------------------------- |
| Hibernate   | 全自动（挡） | 不需要写一句 SQL                                  |
| MyBatis     | 半自动（挡） | 手自一体，支持简单的映射，复杂关系需要自己写 SQL  |
| Spring JDBC | 纯手动（挡） | 所有的 SQL 都要自己写，它帮我们设计了一套标准流程 |

既然市面上有这么多选择，我为什么还要自己写 ORM 框架呢？
这得从我的一次空降担任架构师的经验说起。空降面临最大的难题就是如何取得团队“小伙伴们”的信任。当时，团队总共就 8 人，每个人的水平参差不齐，甚至有些人还没接触过 MySQL，诸如 Redis 等缓存中间件更不用说了。基本只会使用 Hibernate 的 CRUD，而且已经影响到了系统性能。由于工期紧张，没有时间和精力给团队做系统培训，也为了兼顾可控性，于是就产生了自研 ORM 框架的想法。我做了这样的顶层设计，以降低团队“小伙伴们”的存息成本，顶层接口统一参数、统一返回值，具体如下。

**（1）规定查询方法的接口模型为： **

    /**
     * 获取列表
     * @param queryRule 查询条件
     * @return
     */
    List<T> select(QueryRule queryRule) throws Exception;

    /**
     * 获取分页结果
     * @param queryRule 查询条件
     * @param pageNo 页码
     * @param pageSize 每页条数
     * @return
     */
    Page<?> select(QueryRule queryRule,int pageNo,int pageSize) throws Exception;

    /**
     * 根据SQL获取列表
     * @param sql SQL语句
     * @param args 参数
     * @return
     */
    List<Map<String,Object>> selectBySql(String sql, Object... args) throws Exception;

    /**
     * 根据SQL获取分页
     * @param sql SQL语句
     * @param pageNo 页码
     * @param pageSize 每页条数
     * @return
     */
    Page<Map<String,Object>> selectBySqlToPage(String sql, Object [] param, int pageNo, int pageSize) throws Exception;

​  
 **（2）规定删除方法的接口模型为：**

​  
 /\*\*
_ 删除一条记录
_ @param entity entity 中的 ID 不能为空，如果 ID 为空，其他条件不能为空，都为空不予执行
_ @return
_/
boolean delete(T entity) throws Exception;

    /**
     * 批量删除
     * @param list
     * @return 返回受影响的行数
     * @throws Exception
     */
    int deleteAll(List<T> list) throws Exception;

**（3）规定插入方法的接口模型为：**

    /**
     * 插入一条记录并返回插入后的ID
     * @param entity 只要entity不等于null，就执行插入
     * @return
     */
    PK insertAndReturnId(T entity) throws Exception;

    /**
     * 插入一条记录自增ID
     * @param entity
     * @return
     * @throws Exception
     */
    boolean insert(T entity) throws Exception;

    /**
     * 批量插入
     * @param list
     * @return 返回受影响的行数
     * @throws Exception
     */
    int insertAll(List<T> list) throws Exception;

**（4）规定修改方法的接口模型为：**

    /**
     *  修改一条记录
     * @param entity entity中的ID不能为空，如果ID为空，其他条件不能为空，都为空不予执行
     * @return
     * @throws Exception
     */
    boolean update(T entity) throws Exception;

利用这套基础的 API，后面我又基于 Redis、MongoDB、ElasticSearch、Hive、HBase 各封装了一套，以此来降低团队的学习成本，也大大提升了程序的可控性，更方便统一监控。

## 2 搭建基础架构[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#2--搭建基础架构)

### 2.1 Page[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#21--page)

定义 Page 类的主要目的是为后面的分页查询统一返回结果做顶层支持，其主要功能包括分页逻辑的封装、分页数据。

    package javax.core.common;

    import java.io.Serializable;
    import java.util.ArrayList;
    import java.util.List;

    /**
     * 分页对象，包含当前页数据及分页信息，如总记录数
     * 能够支持和JQuery EasyUI直接对接，能够支持和BootStrap Table直接对接
     */
    public class Page<T> implements Serializable {

       private static final long serialVersionUID = 1L;
       private static final int DEFAULT_PAGE_SIZE = 20;

       private int pageSize = DEFAULT_PAGE_SIZE; //每页的记录数

       private long start; //当前页第一条数据在List中的位置，从0开始

       private List<T> rows; //当前页中存放的记录，类型一般为List

       private long total; //总记录数

       /**
        * 构造方法，只构造空页
        */
       public Page() {
          this(0, 0, DEFAULT_PAGE_SIZE, new ArrayList<T>());
       }

       /**
        * 默认构造方法
        *
        * @param start 本页数据在数据库中的起始位置
        * @param totalSize 数据库中总记录条数
        * @param pageSize 本页容量
        * @param rows 本页包含的数据
        */
       public Page(long start, long totalSize, int pageSize, List<T> rows) {
          this.pageSize = pageSize;
          this.start = start;
          this.total = totalSize;
          this.rows = rows;
       }

       /**
        * 取总记录数
        */
       public long getTotal() {
          return this.total;
       }

       public void setTotal(long total) {
          this.total = total;
       }

       /**
        * 取总页数
        */
       public long getTotalPageCount() {
          if (total % pageSize == 0){
             return total / pageSize;
          }else{
             return total / pageSize + 1;
          }
       }

       /**
        * 取每页数据容量
        */
       public int getPageSize() {
          return pageSize;
       }

       /**
        * 取当前页中的记录
        */
       public List<T> getRows() {
          return rows;
       }

       public void setRows(List<T> rows) {
          this.rows = rows;
       }

       /**
        * 取该页的当前页码，页码从1开始
        */
       public long getPageNo() {
          return start / pageSize + 1;
       }

       /**
        * 该页是否有下一页
        */
       public boolean hasNextPage() {
          return this.getPageNo() < this.getTotalPageCount() - 1;
       }

       /**
        * 该页是否有上一页
        */
       public boolean hasPreviousPage() {
          return this.getPageNo() > 1;
       }

       /**
        * 获取任意一页第一条数据在数据集中的位置，每页条数使用默认值
        *
        * @see #getStartOfPage(int,int)
        */
       protected static int getStartOfPage(int pageNo) {
          return getStartOfPage(pageNo, DEFAULT_PAGE_SIZE);
       }

       /**
        * 获取任意一页第一条数据在数据集中的位置
        *
        * @param pageNo 从1开始的页号
        * @param pageSize 每页记录条数
        * @return 该页第一条数据
        */
       public static int getStartOfPage(int pageNo, int pageSize) {
          return (pageNo - 1) * pageSize;
       }

    }

​

### 2.2 ResultMsg[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#22--resultmsg)

    ResultMsg类主要是为统一返回结果做的顶层设计，主要包括状态码、结果说明内容和返回数据。

​  
 package javax.core.common;

    import java.io.Serializable;

    //底层设计
    public class ResultMsg<T> implements Serializable {

       private static final long serialVersionUID = 2635002588308355785L;

       private int status; //状态码，系统的返回码
       private String msg;  //状态码的解释
       private T data;  //放任意结果

       public ResultMsg() {}

       public ResultMsg(int status) {
          this.status = status;
       }

       public ResultMsg(int status, String msg) {
          this.status = status;
          this.msg = msg;
       }

       public ResultMsg(int status, T data) {
          this.status = status;
          this.data = data;
       }

       public ResultMsg(int status, String msg, T data) {
          this.status = status;
          this.msg = msg;
          this.data = data;
       }

       public int getStatus() {
          return status;
       }

       public void setStatus(int status) {
          this.status = status;
       }

       public String getMsg() {
          return msg;
       }

       public void setMsg(String msg) {
          this.msg = msg;
       }

       public T getData() {
          return data;
       }

       public void setData(T data) {
          this.data = data;
       }

    }

### 2.3 BaseDao[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#23--basedao)

作为所有 BaseDao 持久化框架的顶层接口，主要定义增、删、改、查统一的参数列表和返回值。

    package javax.core.common.jdbc;

    import com.gupaoedu.vip.orm.framework.QueryRule;

    import javax.core.common.Page;
    import java.util.List;
    import java.util.Map;

    public interface BaseDao<T,PK> {
        /**
         * 获取列表
         * @param queryRule 查询条件
         * @return
         */
        List<T> select(QueryRule queryRule) throws Exception;

        /**
         * 获取分页结果
         * @param queryRule 查询条件
         * @param pageNo 页码
         * @param pageSize 每页条数
         * @return
         */
        Page<?> select(QueryRule queryRule,int pageNo,int pageSize) throws Exception;

        /**
         * 根据SQL获取列表
         * @param sql SQL语句
         * @param args 参数
         * @return
         */
        List<Map<String,Object>> selectBySql(String sql, Object... args) throws Exception;

        /**
         * 根据SQL获取分页
         * @param sql SQL语句
         * @param pageNo 页码
         * @param pageSize 每页条数
         * @return
         */
        Page<Map<String,Object>> selectBySqlToPage(String sql, Object [] param, int pageNo, int pageSize) throws Exception;

        /**
         * 删除一条记录
         * @param entity entity中的ID不能为空，如果ID为空，其他条件不能为空，都为空则不予执行
         * @return
         */
        boolean delete(T entity) throws Exception;

        /**
         * 批量删除
         * @param list
         * @return 返回受影响的行数
         * @throws Exception
         */
        int deleteAll(List<T> list) throws Exception;

        /**
         * 插入一条记录并返回插入后的ID
         * @param entity 只要entity不等于null，就执行插入操作
         * @return
         */
        PK insertAndReturnId(T entity) throws Exception;

        /**
         * 插入一条记录自增ID
         * @param entity
         * @return
         * @throws Exception
         */
        boolean insert(T entity) throws Exception;

        /**
         * 批量插入
         * @param list
         * @return 返回受影响的行数
         * @throws Exception
         */
        int insertAll(List<T> list) throws Exception;

        /**
         *  修改一条记录
         * @param entity entity中的ID不能为空，如果ID为空，其他条件不能为空，都为空则不予执行
         * @return
         * @throws Exception
         */
        boolean update(T entity) throws Exception;
    }


    ### 2.4 QueryRule[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#24--queryrule)

如果用 QueryRule 类来构建查询条件，用户在做条件查询时不需要手写 SQL，实现业务代码与 SQL 解耦。

    package com.gupaoedu.vip.orm.framework;

    import java.io.Serializable;
    import java.util.ArrayList;
    import java.util.List;

    /**
     * QueryRule，主要功能用于构造查询条件
     */
    public final class QueryRule implements Serializable
    {
       private static final long serialVersionUID = 1L;
       public static final int ASC_ORDER = 101;
       public static final int DESC_ORDER = 102;
       public static final int LIKE = 1;
       public static final int IN = 2;
       public static final int NOTIN = 3;
       public static final int BETWEEN = 4;
       public static final int EQ = 5;
       public static final int NOTEQ = 6;
       public static final int GT = 7;
       public static final int GE = 8;
       public static final int LT = 9;
       public static final int LE = 10;
       public static final int ISNULL = 11;
       public static final int ISNOTNULL = 12;
       public static final int ISEMPTY = 13;
       public static final int ISNOTEMPTY = 14;
       public static final int AND = 201;
       public static final int OR = 202;
       private List<Rule> ruleList = new ArrayList<Rule>();
       private List<QueryRule> queryRuleList = new ArrayList<QueryRule>();
       private String propertyName;

       private QueryRule() {}

       private QueryRule(String propertyName) {
          this.propertyName = propertyName;
       }

       public static QueryRule getInstance() {
          return new QueryRule();
       }

       /**
        * 添加升序规则
        * @param propertyName
        * @return
        */
       public QueryRule addAscOrder(String propertyName) {
          this.ruleList.add(new Rule(ASC_ORDER, propertyName));
          return this;
       }

       /**
        * 添加降序规则
        * @param propertyName
        * @return
        */
       public QueryRule addDescOrder(String propertyName) {
          this.ruleList.add(new Rule(DESC_ORDER, propertyName));
          return this;
       }

       public QueryRule andIsNull(String propertyName) {
          this.ruleList.add(new Rule(ISNULL, propertyName).setAndOr(AND));
          return this;
       }

       public QueryRule andIsNotNull(String propertyName) {
          this.ruleList.add(new Rule(ISNOTNULL, propertyName).setAndOr(AND));
          return this;
       }

       public QueryRule andIsEmpty(String propertyName) {
          this.ruleList.add(new Rule(ISEMPTY, propertyName).setAndOr(AND));
          return this;
       }

       public QueryRule andIsNotEmpty(String propertyName) {
          this.ruleList.add(new Rule(ISNOTEMPTY, propertyName).setAndOr(AND));
          return this;
       }

       public QueryRule andLike(String propertyName, Object value) {
          this.ruleList.add(new Rule(LIKE, propertyName, new Object[] { value }).setAndOr(AND));
          return this;
       }

       public QueryRule andEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(EQ, propertyName, new Object[] { value }).setAndOr(AND));
          return this;
       }

       public QueryRule andBetween(String propertyName, Object... values) {
          this.ruleList.add(new Rule(BETWEEN, propertyName, values).setAndOr(AND));
          return this;
       }

       public QueryRule andIn(String propertyName, List<Object> values) {
          this.ruleList.add(new Rule(IN, propertyName, new Object[] { values }).setAndOr(AND));
          return this;
       }

       public QueryRule andIn(String propertyName, Object... values) {
          this.ruleList.add(new Rule(IN, propertyName, values).setAndOr(AND));
          return this;
       }

       public QueryRule andNotIn(String propertyName, List<Object> values) {
          this.ruleList.add(new Rule(NOTIN, propertyName, new Object[] { values }).setAndOr(AND));
          return this;
       }

       public QueryRule orNotIn(String propertyName, Object... values) {
          this.ruleList.add(new Rule(NOTIN, propertyName, values).setAndOr(OR));
          return this;
       }


       public QueryRule andNotEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(NOTEQ, propertyName, new Object[] { value }).setAndOr(AND));
          return this;
       }

       public QueryRule andGreaterThan(String propertyName, Object value) {
          this.ruleList.add(new Rule(GT, propertyName, new Object[] { value }).setAndOr(AND));
          return this;
       }

       public QueryRule andGreaterEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(GE, propertyName, new Object[] { value }).setAndOr(AND));
          return this;
       }

       public QueryRule andLessThan(String propertyName, Object value) {
          this.ruleList.add(new Rule(LT, propertyName, new Object[] { value }).setAndOr(AND));
          return this;
       }

       public QueryRule andLessEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(LE, propertyName, new Object[] { value }).setAndOr(AND));
          return this;
       }

​  
 public QueryRule orIsNull(String propertyName) {
this.ruleList.add(new Rule(ISNULL, propertyName).setAndOr(OR));
return this;
}

       public QueryRule orIsNotNull(String propertyName) {
          this.ruleList.add(new Rule(ISNOTNULL, propertyName).setAndOr(OR));
          return this;
       }

       public QueryRule orIsEmpty(String propertyName) {
          this.ruleList.add(new Rule(ISEMPTY, propertyName).setAndOr(OR));
          return this;
       }

       public QueryRule orIsNotEmpty(String propertyName) {
          this.ruleList.add(new Rule(ISNOTEMPTY, propertyName).setAndOr(OR));
          return this;
       }

       public QueryRule orLike(String propertyName, Object value) {
          this.ruleList.add(new Rule(LIKE, propertyName, new Object[] { value }).setAndOr(OR));
          return this;
       }

       public QueryRule orEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(EQ, propertyName, new Object[] { value }).setAndOr(OR));
          return this;
       }

       public QueryRule orBetween(String propertyName, Object... values) {
          this.ruleList.add(new Rule(BETWEEN, propertyName, values).setAndOr(OR));
          return this;
       }

       public QueryRule orIn(String propertyName, List<Object> values) {
          this.ruleList.add(new Rule(IN, propertyName, new Object[] { values }).setAndOr(OR));
          return this;
       }

       public QueryRule orIn(String propertyName, Object... values) {
          this.ruleList.add(new Rule(IN, propertyName, values).setAndOr(OR));
          return this;
       }

       public QueryRule orNotEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(NOTEQ, propertyName, new Object[] { value }).setAndOr(OR));
          return this;
       }

       public QueryRule orGreaterThan(String propertyName, Object value) {
          this.ruleList.add(new Rule(GT, propertyName, new Object[] { value }).setAndOr(OR));
          return this;
       }

       public QueryRule orGreaterEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(GE, propertyName, new Object[] { value }).setAndOr(OR));
          return this;
       }

       public QueryRule orLessThan(String propertyName, Object value) {
          this.ruleList.add(new Rule(LT, propertyName, new Object[] { value }).setAndOr(OR));
          return this;
       }

       public QueryRule orLessEqual(String propertyName, Object value) {
          this.ruleList.add(new Rule(LE, propertyName, new Object[] { value }).setAndOr(OR));
          return this;
       }


       public List<Rule> getRuleList() {
          return this.ruleList;
       }

       public List<QueryRule> getQueryRuleList() {
          return this.queryRuleList;
       }

       public String getPropertyName() {
          return this.propertyName;
       }

       protected class Rule implements Serializable {
          private static final long serialVersionUID = 1L;
          private int type;  //规则的类型
          private String property_name;
          private Object[] values;
          private int andOr = AND;

          public Rule(int paramInt, String paramString) {
             this.property_name = paramString;
             this.type = paramInt;
          }

          public Rule(int paramInt, String paramString,
                Object[] paramArrayOfObject) {
             this.property_name = paramString;
             this.values = paramArrayOfObject;
             this.type = paramInt;
          }

          public Rule setAndOr(int andOr){
             this.andOr = andOr;
             return this;
          }

          public int getAndOr(){
             return this.andOr;
          }

          public Object[] getValues() {
             return this.values;
          }

          public int getType() {
             return this.type;
          }

          public String getPropertyName() {
             return this.property_name;
          }
       }
    }

### 2.5 Order[#](https://www.cnblogs.com/gupaoedu-tom/p/15697485.html#25--order)

Order 类主要用于封装排序规则，代码如下：

    package com.gupaoedu.vip.orm.framework;

    /**
     * SQL排序组件
     */
    public class Order {
       private boolean ascending; //升序还是降序
       private String propertyName; //哪个字段升序，哪个字段降序

       public String toString() {
          return propertyName + ' ' + (ascending ? "asc" : "desc");
       }

       /**
        * Constructor for Order.
        */
       protected Order(String propertyName, boolean ascending) {
          this.propertyName = propertyName;
          this.ascending = ascending;
       }

       /**
        * Ascending order
        *
        * @param propertyName
        * @return Order
        */
       public static Order asc(String propertyName) {
          return new Order(propertyName, true);
       }

       /**
        * Descending order
        *
        * @param propertyName
        * @return Order
        */
       public static Order desc(String propertyName) {
          return new Order(propertyName, false);
       }
    }

## 3 基于 Spring JDBC 实现关键功能[#](https://www.cnblogs.com/gupaoedu-tom/p/15702051.html#3--基于spring-jdbc实现关键功能)

### 3.1 ClassMappings[#](https://www.cnblogs.com/gupaoedu-tom/p/15702051.html#31--classmappings)

ClassMappings 主要定义基础的映射类型，代码如下：

    package com.tom.orm.framework;

    import java.lang.reflect.Field;
    import java.lang.reflect.Method;
    import java.lang.reflect.Modifier;
    import java.math.BigDecimal;
    import java.sql.Date;
    import java.sql.Timestamp;
    import java.util.Arrays;
    import java.util.HashMap;
    import java.util.HashSet;
    import java.util.Map;
    import java.util.Set;

    public class ClassMappings {

       private ClassMappings(){}

        static final Set<Class<?>> SUPPORTED_SQL_OBJECTS = new HashSet<Class<?>>();

           static {
              //只要这里写了，默认支持自动类型转换
               Class<?>[] classes = {
                       boolean.class, Boolean.class,
                       short.class, Short.class,
                       int.class, Integer.class,
                       long.class, Long.class,
                       float.class, Float.class,
                       double.class, Double.class,
                       String.class,
                       Date.class,
                       Timestamp.class,
                       BigDecimal.class
               };
               SUPPORTED_SQL_OBJECTS.addAll(Arrays.asList(classes));
           }

           static boolean isSupportedSQLObject(Class<?> clazz) {
               return clazz.isEnum() || SUPPORTED_SQL_OBJECTS.contains(clazz);
           }

           public static Map<String, Method> findPublicGetters(Class<?> clazz) {
               Map<String, Method> map = new HashMap<String, Method>();
               Method[] methods = clazz.getMethods();
               for (Method method : methods) {
                   if (Modifier.isStatic(method.getModifiers()))
                       continue;
                   if (method.getParameterTypes().length != 0)
                       continue;
                   if (method.getName().equals("getClass"))
                       continue;
                   Class<?> returnType = method.getReturnType();
                   if (void.class.equals(returnType))
                       continue;
                   if(!isSupportedSQLObject(returnType)){
                      continue;
                   }
                   if ((returnType.equals(boolean.class)
                           || returnType.equals(Boolean.class))
                           && method.getName().startsWith("is")
                           && method.getName().length() > 2) {
                       map.put(getGetterName(method), method);
                       continue;
                   }
                   if ( ! method.getName().startsWith("get"))
                       continue;
                   if (method.getName().length() < 4)
                       continue;
                   map.put(getGetterName(method), method);
               }
               return map;
           }

           public static Field[] findFields(Class<?> clazz){
               return clazz.getDeclaredFields();
           }

           public static Map<String, Method> findPublicSetters(Class<?> clazz) {
               Map<String, Method> map = new HashMap<String, Method>();
               Method[] methods = clazz.getMethods();
               for (Method method : methods) {
                   if (Modifier.isStatic(method.getModifiers()))
                       continue;
                   if ( ! void.class.equals(method.getReturnType()))
                       continue;
                   if (method.getParameterTypes().length != 1)
                       continue;
                   if ( ! method.getName().startsWith("set"))
                       continue;
                   if (method.getName().length() < 4)
                       continue;
                   if(!isSupportedSQLObject(method.getParameterTypes()[0])){
                      continue;
                   }
                   map.put(getSetterName(method), method);
               }
               return map;
           }

           public static String getGetterName(Method getter) {
               String name = getter.getName();
               if (name.startsWith("is"))
                   name = name.substring(2);
               else
                   name = name.substring(3);
               return Character.toLowerCase(name.charAt(0)) + name.substring(1);
           }

           private static String getSetterName(Method setter) {
               String name = setter.getName().substring(3);
               return Character.toLowerCase(name.charAt(0)) + name.substring(1);
           }
    }

### 3.2 EntityOperation[#](https://www.cnblogs.com/gupaoedu-tom/p/15702051.html#32--entityoperation)

EntityOperation 主要实现数据库表结构和对象类结构的映射关系，代码如下：

    package com.tom.orm.framework;

    import java.lang.reflect.Field;
    import java.lang.reflect.Method;
    import java.sql.ResultSet;
    import java.sql.ResultSetMetaData;
    import java.sql.SQLException;
    import java.util.HashMap;
    import java.util.Map;
    import java.util.TreeMap;
    import javax.persistence.Column;
    import javax.persistence.Entity;
    import javax.persistence.Id;
    import javax.persistence.Table;
    import javax.persistence.Transient;
    import org.apache.log4j.Logger;
    import org.springframework.jdbc.core.RowMapper;
    import javax.core.common.utils.StringUtils;

    /**
     * 实体对象的反射操作
     *
     * @param <T>
     */
    public class EntityOperation<T> {
       private Logger log = Logger.getLogger(EntityOperation.class);
       public Class<T> entityClass = null; // 泛型实体Class对象
       public final Map<String, PropertyMapping> mappings;
       public final RowMapper<T> rowMapper;

       public final String tableName;
       public String allColumn = "*";
       public Field pkField;

       public EntityOperation(Class<T> clazz,String pk) throws Exception{
          if(!clazz.isAnnotationPresent(Entity.class)){
             throw new Exception("在" + clazz.getName() + "中没有找到Entity注解，不能做ORM映射");
          }
          this.entityClass = clazz;
          Table table = entityClass.getAnnotation(Table.class);
           if (table != null) {
                 this.tableName = table.name();
           } else {
                 this.tableName =  entityClass.getSimpleName();
           }
          Map<String, Method> getters = ClassMappings.findPublicGetters(entityClass);
           Map<String, Method> setters = ClassMappings.findPublicSetters(entityClass);
           Field[] fields = ClassMappings.findFields(entityClass);
           fillPkFieldAndAllColumn(pk,fields);
           this.mappings = getPropertyMappings(getters, setters, fields);
           this.allColumn = this.mappings.keySet().toString().replace("[", "").replace("]",""). replaceAll(" ","");
           this.rowMapper = createRowMapper();
       }

        Map<String, PropertyMapping> getPropertyMappings(Map<String, Method> getters, Map<String, Method> setters, Field[] fields) {
            Map<String, PropertyMapping> mappings = new HashMap<String, PropertyMapping>();
            String name;
            for (Field field : fields) {
                if (field.isAnnotationPresent(Transient.class))
                    continue;
                name = field.getName();
                if(name.startsWith("is")){
                   name = name.substring(2);
                }
                name = Character.toLowerCase(name.charAt(0)) + name.substring(1);
                Method setter = setters.get(name);
                Method getter = getters.get(name);
                if (setter == null || getter == null){
                    continue;
                }
                Column column = field.getAnnotation(Column.class);
                if (column == null) {
                    mappings.put(field.getName(), new PropertyMapping(getter, setter, field));
                } else {
                    mappings.put(column.name(), new PropertyMapping(getter, setter, field));
                }
            }
            return mappings;
        }

       RowMapper<T> createRowMapper() {
               return new RowMapper<T>() {
                   public T mapRow(ResultSet rs, int rowNum) throws SQLException {
                       try {
                           T t = entityClass.newInstance();
                           ResultSetMetaData meta = rs.getMetaData();
                           int columns = meta.getColumnCount();
                           String columnName;
                           for (int i = 1; i <= columns; i++) {
                               Object value = rs.getObject(i);
                               columnName = meta.getColumnName(i);
                               fillBeanFieldValue(t,columnName,value);
                           }
                           return t;
                       }catch (Exception e) {
                           throw new RuntimeException(e);
                       }
                   }
               };
           }

       protected void fillBeanFieldValue(T t, String columnName, Object value) {
           if (value != null) {
                 PropertyMapping pm = mappings.get(columnName);
                 if (pm != null) {
                     try {
                   pm.set(t, value);
                } catch (Exception e) {
                   e.printStackTrace();
                }
                 }
             }
       }

       private void fillPkFieldAndAllColumn(String pk, Field[] fields) {
          //设定主键
           try {
              if(!StringUtils.isEmpty(pk)){
                 pkField = entityClass.getDeclaredField(pk);
                 pkField.setAccessible(true);
              }
           } catch (Exception e) {
                 log.debug("没找到主键列，主键列名必须与属性名相同");
           }
          for (int i = 0 ; i < fields.length ;i ++) {
             Field f = fields[i];
             if(StringUtils.isEmpty(pk)){
                Id id = f.getAnnotation(Id.class);
                if(id != null){
                   pkField = f;
                   break;
                }
             }
          }
       }

       public T parse(ResultSet rs) {
          T t = null;
          if (null == rs) {
             return null;
          }
          Object value = null;
          try {
             t = (T) entityClass.newInstance();
             for (String columnName : mappings.keySet()) {
                try {
                   value = rs.getObject(columnName);
                } catch (Exception e) {
                   e.printStackTrace();
                }
                fillBeanFieldValue(t,columnName,value);
             }
          } catch (Exception ex) {
             ex.printStackTrace();
          }
          return t;
       }

       public Map<String, Object> parse(T t) {
          Map<String, Object> _map = new TreeMap<String, Object>();
          try {

             for (String columnName : mappings.keySet()) {
                Object value = mappings.get(columnName).getter.invoke(t);
                if (value == null)
                   continue;
                _map.put(columnName, value);

             }
          } catch (Exception e) {
             e.printStackTrace();
          }
          return _map;
       }

       public void println(T t) {
          try {
             for (String columnName : mappings.keySet()) {
                Object value = mappings.get(columnName).getter.invoke(t);
                if (value == null)
                   continue;
                System.out.println(columnName + " = " + value);
             }
          } catch (Exception e) {
             e.printStackTrace();
          }
       }
    }

    class PropertyMapping {

        final boolean insertable;
        final boolean updatable;
        final String columnName;
        final boolean id;
        final Method getter;
        final Method setter;
        final Class enumClass;
        final String fieldName;

        public PropertyMapping(Method getter, Method setter, Field field) {
            this.getter = getter;
            this.setter = setter;
            this.enumClass = getter.getReturnType().isEnum() ? getter.getReturnType() : null;
            Column column = field.getAnnotation(Column.class);
            this.insertable = column == null || column.insertable();
            this.updatable = column == null || column.updatable();
            this.columnName = column == null ? ClassMappings.getGetterName(getter) : ("".equals(column.name()) ? ClassMappings.getGetterName    (getter) : column.name());
            this.id = field.isAnnotationPresent(Id.class);
            this.fieldName = field.getName();
        }

        @SuppressWarnings("unchecked")
        Object get(Object target) throws Exception {
            Object r = getter.invoke(target);
            return enumClass == null ? r : Enum.valueOf(enumClass, (String) r);
        }

        @SuppressWarnings("unchecked")
        void set(Object target, Object value) throws Exception {
            if (enumClass != null && value != null) {
                value = Enum.valueOf(enumClass, (String) value);
            }
            //BeanUtils.setProperty(target, fieldName, value);
            try {
                if(value != null){
                    setter.invoke(target, setter.getParameterTypes()[0].cast(value));
                 }
          } catch (Exception e) {
             e.printStackTrace();
             /**
              * 出错原因如果是boolean字段、mysql字段类型，设置tinyint(1)
              */
             System.err.println(fieldName + "--" + value);
          }

        }
    }

### 3.3 QueryRuleSqlBuilder[#](https://www.cnblogs.com/gupaoedu-tom/p/15702051.html#33--queryrulesqlbuilder)

QueryRuleSqlBuilder 根据用户构建好的 QueryRule 来自动生成 SQL 语句，代码如下：

    package com.tom.orm.framework;

    import java.util.ArrayList;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    import java.util.regex.Matcher;
    import java.util.regex.Pattern;
    import org.apache.commons.lang.ArrayUtils;
    import com.tom.orm.framework.QueryRule.Rule;
    import javax.core.common.utils.StringUtils;

​  
 /\*\*
_ 根据 QueryRule 自动构建 SQL 语句
_/
public class QueryRuleSqlBuilder {

       private int CURR_INDEX = 0; //记录参数所在的位置
       private List<String> properties; //保存列名列表
       private List<Object> values; //保存参数值列表
       private List<Order> orders; //保存排序规则列表

       private String whereSql = "";
       private String orderSql = "";
       private Object [] valueArr = new Object[]{};
       private Map<Object,Object> valueMap = new HashMap<Object,Object>();

       /**
        * 获得查询条件
        * @return
        */
       public String getWhereSql(){
          return this.whereSql;
       }

       /**
        * 获得排序条件
        * @return
        */
       public String getOrderSql(){
          return this.orderSql;
       }

       /**
        * 获得参数值列表
        * @return
        */
       public Object [] getValues(){
          return this.valueArr;
       }

       /**
        * 获取参数列表
        * @return
        */
       public Map<Object,Object> getValueMap(){
          return this.valueMap;
       }

       /**
        * 创建SQL构造器
        * @param queryRule
        */
       public  QueryRuleSqlBuilder(QueryRule queryRule) {
          CURR_INDEX = 0;
          properties = new ArrayList<String>();
          values = new ArrayList<Object>();
          orders = new ArrayList<Order>();
          for (QueryRule.Rule rule : queryRule.getRuleList()) {
             switch (rule.getType()) {
             case QueryRule.BETWEEN:
                processBetween(rule);
                break;
             case QueryRule.EQ:
                processEqual(rule);
                break;
             case QueryRule.LIKE:
                processLike(rule);
                break;
             case QueryRule.NOTEQ:
                processNotEqual(rule);
                break;
             case QueryRule.GT:
                processGreaterThen(rule);
                break;
             case QueryRule.GE:
                processGreaterEqual(rule);
                break;
             case QueryRule.LT:
                processLessThen(rule);
                break;
             case QueryRule.LE:
                processLessEqual(rule);
                break;
             case QueryRule.IN:
                processIN(rule);
                break;
             case QueryRule.NOTIN:
                processNotIN(rule);
                break;
             case QueryRule.ISNULL:
                processIsNull(rule);
                break;
             case QueryRule.ISNOTNULL:
                processIsNotNull(rule);
                break;
             case QueryRule.ISEMPTY:
                processIsEmpty(rule);
                break;
             case QueryRule.ISNOTEMPTY:
                processIsNotEmpty(rule);
                break;
             case QueryRule.ASC_ORDER:
                processOrder(rule);
                break;
             case QueryRule.DESC_ORDER:
                processOrder(rule);
                break;
             default:
                throw new IllegalArgumentException("type " + rule.getType() + " not supported.");
             }
          }
          //拼装where语句
          appendWhereSql();
          //拼装排序语句
          appendOrderSql();
          //拼装参数值
          appendValues();
       }

       /**
        * 去掉order
        *
        * @param sql
        * @return
        */
       protected String removeOrders(String sql) {
          Pattern p = Pattern.compile("order\\s*by[\\w|\\W|\\s|\\S]*", Pattern.CASE_INSENSITIVE);
          Matcher m = p.matcher(sql);
          StringBuffer sb = new StringBuffer();
          while (m.find()) {
             m.appendReplacement(sb, "");
          }
          m.appendTail(sb);
          return sb.toString();
       }

       /**
        * 去掉select
        *
        * @param sql
        * @return
        */
       protected String removeSelect(String sql) {
          if(sql.toLowerCase().matches("from\\s+")){
             int beginPos = sql.toLowerCase().indexOf("from");
             return sql.substring(beginPos);
          }else{
             return sql;
          }
       }

       /**
        * 处理like
        * @param rule
        */
       private  void processLike(QueryRule.Rule rule) {
          if (ArrayUtils.isEmpty(rule.getValues())) {
             return;
          }
          Object obj = rule.getValues()[0];

          if (obj != null) {
             String value = obj.toString();
             if (!StringUtils.isEmpty(value)) {
                value = value.replace('*', '%');
                obj = value;
             }
          }
          add(rule.getAndOr(),rule.getPropertyName(),"like","%"+rule.getValues()[0]+"%");
       }

       /**
        * 处理between
        * @param rule
        */
       private  void processBetween(QueryRule.Rule rule) {
          if ((ArrayUtils.isEmpty(rule.getValues()))
                || (rule.getValues().length < 2)) {
             return;
          }
          add(rule.getAndOr(),rule.getPropertyName(),"","between",rule.getValues()[0],"and");
          add(0,"","","",rule.getValues()[1],"");
       }

       /**
        * 处理 =
        * @param rule
        */
       private  void processEqual(QueryRule.Rule rule) {
          if (ArrayUtils.isEmpty(rule.getValues())) {
             return;
          }
          add(rule.getAndOr(),rule.getPropertyName(),"=",rule.getValues()[0]);
       }

       /**
        * 处理 <>
        * @param rule
        */
       private  void processNotEqual(QueryRule.Rule rule) {
          if (ArrayUtils.isEmpty(rule.getValues())) {
             return;
          }
          add(rule.getAndOr(),rule.getPropertyName(),"<>",rule.getValues()[0]);
       }

       /**
        * 处理 >
        * @param rule
        */
       private  void processGreaterThen(
             QueryRule.Rule rule) {
          if (ArrayUtils.isEmpty(rule.getValues())) {
             return;
          }
          add(rule.getAndOr(),rule.getPropertyName(),">",rule.getValues()[0]);
       }

       /**
        * 处理>=
        * @param rule
        */
       private  void processGreaterEqual(
             QueryRule.Rule rule) {
          if (ArrayUtils.isEmpty(rule.getValues())) {
             return;
          }
          add(rule.getAndOr(),rule.getPropertyName(),">=",rule.getValues()[0]);
       }

       /**
        * 处理<
        * @param rule
        */
       private  void processLessThen(QueryRule.Rule rule) {
          if (ArrayUtils.isEmpty(rule.getValues())) {
             return;
          }
          add(rule.getAndOr(),rule.getPropertyName(),"<",rule.getValues()[0]);
       }

       /**
        * 处理<=
        * @param rule
        */
       private  void processLessEqual(
             QueryRule.Rule rule) {
          if (ArrayUtils.isEmpty(rule.getValues())) {
             return;
          }
          add(rule.getAndOr(),rule.getPropertyName(),"<=",rule.getValues()[0]);
       }

       /**
        * 处理  is null
        * @param rule
        */
       private  void processIsNull(QueryRule.Rule rule) {
          add(rule.getAndOr(),rule.getPropertyName(),"is null",null);
       }

       /**
        * 处理 is not null
        * @param rule
        */
       private  void processIsNotNull(QueryRule.Rule rule) {
          add(rule.getAndOr(),rule.getPropertyName(),"is not null",null);
       }

       /**
        * 处理  <>''
        * @param rule
        */
       private  void processIsNotEmpty(QueryRule.Rule rule) {
          add(rule.getAndOr(),rule.getPropertyName(),"<>","''");
       }

       /**
        * 处理 =''
        * @param rule
        */
       private  void processIsEmpty(QueryRule.Rule rule) {
          add(rule.getAndOr(),rule.getPropertyName(),"=","''");
       }

​  
 /\*\*
_ 处理 in 和 not in
_ @param rule
_ @param name
_/
private void inAndNotIn(QueryRule.Rule rule,String name){
if (ArrayUtils.isEmpty(rule.getValues())) {
return;
}
if ((rule.getValues().length == 1) && (rule.getValues()[0] != null)
&& (rule.getValues()[0] instanceof List)) {
List<Object> list = (List) rule.getValues()[0];

             if ((list != null) && (list.size() > 0)){
                for (int i = 0; i < list.size(); i++) {
                   if(i == 0 && i == list.size() - 1){
                      add(rule.getAndOr(),rule.getPropertyName(),"",name + " (",list.get(i),")");
                   }else if(i == 0 && i < list.size() - 1){
                      add(rule.getAndOr(),rule.getPropertyName(),"",name + " (",list.get(i),"");
                   }
                   if(i > 0 && i < list.size() - 1){
                      add(0,"",",","",list.get(i),"");
                   }
                   if(i == list.size() - 1 && i != 0){
                      add(0,"",",","",list.get(i),")");
                   }
                }
             }
          } else {
             Object[] list =  rule.getValues();
             for (int i = 0; i < list.length; i++) {
                if(i == 0 && i == list.length - 1){
                   add(rule.getAndOr(),rule.getPropertyName(),"",name + " (",list[i],")");
                }else if(i == 0 && i < list.length - 1){
                   add(rule.getAndOr(),rule.getPropertyName(),"",name + " (",list[i],"");
                }
                if(i > 0 && i < list.length - 1){
                   add(0,"",",","",list[i],"");
                }
                if(i == list.length - 1 && i != 0){
                   add(0,"",",","",list[i],")");
                }
             }
          }
       }

       /**
        * 处理 not in
        * @param rule
        */
       private void processNotIN(QueryRule.Rule rule){
          inAndNotIn(rule,"not in");
       }

       /**
        * 处理 in
        * @param rule
        */
       private  void processIN(QueryRule.Rule rule) {
          inAndNotIn(rule,"in");
       }

       /**
        * 处理 order by
        * @param rule 查询规则
        */
       private void processOrder(Rule rule) {
          switch (rule.getType()) {
          case QueryRule.ASC_ORDER:
             //propertyName非空
             if (!StringUtils.isEmpty(rule.getPropertyName())) {
                orders.add(Order.asc(rule.getPropertyName()));
             }
             break;
          case QueryRule.DESC_ORDER:
             //propertyName非空
             if (!StringUtils.isEmpty(rule.getPropertyName())) {
                orders.add(Order.desc(rule.getPropertyName()));
             }
             break;
          default:
             break;
          }
       }

​  
 /\*\*
_ 加入 SQL 查询规则队列
_ @param andOr and 或者 or
_ @param key 列名
_ @param split 列名与值之间的间隔
_ @param value 值
_/
private void add(int andOr,String key,String split ,Object value){
add(andOr,key,split,"",value,"");
}

       /**
        * 加入SQL查询规则队列
        * @param andOr and 或则 or
        * @param key 列名
        * @param split 列名与值之间的间隔
        * @param prefix 值前缀
        * @param value 值
        * @param suffix 值后缀
        */
       private void add(int andOr,String key,String split,String prefix,Object value,String suffix){
          String andOrStr = (0 == andOr ? "" :(QueryRule.AND == andOr ? " and " : " or "));
          properties.add(CURR_INDEX, andOrStr + key + " " + split + prefix + (null != value ? " ? " : " ") + suffix);
          if(null != value){
             values.add(CURR_INDEX,value);
             CURR_INDEX ++;
          }
       }

​  
 /\*\*
_ 拼装 where 语句
_/
private void appendWhereSql(){
StringBuffer whereSql = new StringBuffer();
for (String p : properties) {
whereSql.append(p);
}
this.whereSql = removeSelect(removeOrders(whereSql.toString()));
}

       /**
        * 拼装排序语句
        */
       private void appendOrderSql(){
          StringBuffer orderSql = new StringBuffer();
          for (int i = 0 ; i < orders.size(); i ++) {
             if(i > 0 && i < orders.size()){
                orderSql.append(",");
             }
             orderSql.append(orders.get(i).toString());
          }
          this.orderSql = removeSelect(removeOrders(orderSql.toString()));
       }

       /**
        * 拼装参数值
        */
       private void appendValues(){
          Object [] val = new Object[values.size()];
          for (int i = 0; i < values.size(); i ++) {
             val[i] = values.get(i);
             valueMap.put(i, values.get(i));
          }
          this.valueArr = val;
       }
    }

### 3.4 BaseDaoSupport[#](https://www.cnblogs.com/gupaoedu-tom/p/15702051.html#34--basedaosupport)

BaseDaoSupport 主要是对 JdbcTemplate 的包装，下面讲一下其重要代码，请“小伙伴们” 关 注 公 众 号 『 Tom 弹架构 』，回复 " Spring " 可下载全部源代码。先看全局定义：

    package com.tom.orm.framework;

    ...

    /**
     * BaseDao 扩展类，主要功能是支持自动拼装SQL语句，必须继承方可使用
     * @author Tom
     */
    public abstract class BaseDaoSupport<T extends Serializable, PK extends Serializable> implements BaseDao<T,PK> {
       private Logger log = Logger.getLogger(BaseDaoSupport.class);

       private String tableName = "";

       private JdbcTemplate jdbcTemplateWrite;
       private JdbcTemplate jdbcTemplateReadOnly;

       private DataSource dataSourceReadOnly;
       private DataSource dataSourceWrite;

       private EntityOperation<T> op;

       @SuppressWarnings("unchecked")
       protected BaseDaoSupport(){
          try{
             Class<T> entityClass = GenericsUtils.getSuperClassGenricType(getClass(), 0);
             op = new EntityOperation<T>(entityClass,this.getPKColumn());
             this.setTableName(op.tableName);
          }catch(Exception e){
             e.printStackTrace();
          }
       }

       protected String getTableName() { return tableName; }
       protected DataSource getDataSourceReadOnly() { return dataSourceReadOnly;  }
       protected DataSource getDataSourceWrite() { return dataSourceWrite;  }

       /**
        * 动态切换表名
        */
       protected void setTableName(String tableName) {
          if(StringUtils.isEmpty(tableName)){
             this.tableName = op.tableName;
          }else{
             this.tableName = tableName;
          }
       }

       protected void setDataSourceWrite(DataSource dataSourceWrite) {
          this.dataSourceWrite = dataSourceWrite;
          jdbcTemplateWrite = new JdbcTemplate(dataSourceWrite);
       }

       protected void setDataSourceReadOnly(DataSource dataSourceReadOnly) {
          this.dataSourceReadOnly = dataSourceReadOnly;
          jdbcTemplateReadOnly = new JdbcTemplate(dataSourceReadOnly);
       }

       private JdbcTemplate jdbcTemplateReadOnly() {
          return this.jdbcTemplateReadOnly;
       }

       private JdbcTemplate jdbcTemplateWrite() {
          return this.jdbcTemplateWrite;
       }

       /**
        * 还原默认表名
        */
       protected void restoreTableName(){ this.setTableName(op.tableName);  }

       /**
        * 获取主键列名称，建议子类重写
        * @return
        */
       protected abstract String getPKColumn();

       protected abstract void setDataSource(DataSource dataSource);

    //此处有省略

    }

​  
 为了照顾程序员的一般使用习惯，查询方法的前缀命名主要有 select、get、load，兼顾 Hibernate 和 MyBatis 的命名风格。

​  
 /\*\*
_ 查询函数，使用查询规则
_ 例如以下代码查询条件为匹配的数据 \*
_ @param queryRule 查询规则
_ @return 查询的结果 List
\*/
public List<T> select(QueryRule queryRule) throws Exception{
QueryRuleSqlBuilder bulider = new QueryRuleSqlBuilder(queryRule);
String ws = removeFirstAnd(bulider.getWhereSql());
String whereSql = ("".equals(ws) ? ws : (" where " + ws));
String sql = "select " + op.allColumn + " from " + getTableName() + whereSql;
Object [] values = bulider.getValues();
String orderSql = bulider.getOrderSql();
orderSql = (StringUtils.isEmpty(orderSql) ? " " : (" order by " + orderSql));
sql += orderSql;
log.debug(sql);
return (List<T>) this.jdbcTemplateReadOnly().query(sql, this.op.rowMapper, values);
}

    ...

       /**
        * 根据SQL语句执行查询，参数为Object数组对象
        * @param sql 查询语句
        * @param args 为Object数组
        * @return 符合条件的所有对象
        */
       public List<Map<String,Object>> selectBySql(String sql,Object... args) throws Exception{
          return this.jdbcTemplateReadOnly().queryForList(sql,args);
       }

    ...

       /**
        * 分页查询函数，使用查询规则<br>
        * 例如以下代码查询条件为匹配的数据
        *
        * @param queryRule 查询规则
        * @param pageNo 页号，从1开始
        * @param pageSize 每页的记录条数
        * @return 查询的结果Page
        */
       public Page<T> select(QueryRule queryRule,final int pageNo, final int pageSize) throws Exception{
          QueryRuleSqlBuilder bulider = new QueryRuleSqlBuilder(queryRule);
          Object [] values = bulider.getValues();
          String ws = removeFirstAnd(bulider.getWhereSql());
          String whereSql = ("".equals(ws) ? ws : (" where " + ws));
          String countSql = "select count(1) from " + getTableName() + whereSql;
          long count = (Long) this.jdbcTemplateReadOnly().queryForMap(countSql, values).get ("count(1)");
          if (count == 0) {
             return new Page<T>();
          }
          long start = (pageNo - 1) * pageSize;
          //在有数据的情况下，继续查询
          String orderSql = bulider.getOrderSql();
          orderSql = (StringUtils.isEmpty(orderSql) ? " " : (" order by " + orderSql));
          String sql = "select " + op.allColumn +" from " + getTableName() + whereSql + orderSql + " limit " + start + "," + pageSize;
          List<T> list = (List<T>) this.jdbcTemplateReadOnly().query(sql, this.op.rowMapper, values);
          log.debug(sql);
          return new Page<T>(start, count, pageSize, list);
       }
    ...

       /**
        * 分页查询特殊SQL语句
        * @param sql 语句
        * @param param  查询条件
        * @param pageNo   页码
        * @param pageSize 每页内容
        * @return
        */
       public Page<Map<String,Object>> selectBySqlToPage(String sql, Object [] param, final int pageNo, final int pageSize) throws Exception {
          String countSql = "select count(1) from (" + sql + ") a";

          long count = (Long) this.jdbcTemplateReadOnly().queryForMap(countSql,param).get("count(1)");
          if (count == 0) {
             return new Page<Map<String,Object>>();
          }
          long start = (pageNo - 1) * pageSize;
          sql = sql + " limit " + start + "," + pageSize;
          List<Map<String,Object>> list = (List<Map<String,Object>>) this.jdbcTemplateReadOnly(). queryForList(sql, param);
          log.debug(sql);
          return new Page<Map<String,Object>>(start, count, pageSize, list);
       }

    /**
        * 获取默认的实例对象
        * @param <T>
        * @param pkValue
        * @param rowMapper
        * @return
        */
       private <T> T doLoad(Object pkValue, RowMapper<T> rowMapper){
          Object obj = this.doLoad(getTableName(), getPKColumn(), pkValue, rowMapper);
          if(obj != null){
             return (T)obj;
          }
          return null;
       }

​  
​  
 插入方法，均以 insert 开头：

​  
 /\*\*
_ 插入并返回 ID
_ @param entity
_ @return
_/
public PK insertAndReturnId(T entity) throws Exception{
return (PK)this.doInsertRuturnKey(parse(entity));
}

       /**
        * 插入一条记录
        * @param entity
        * @return
        */
       public boolean insert(T entity) throws Exception{
          return this.doInsert(parse(entity));
       }
    /**
        * 批量保存对象.<br>
        *
        * @param list 待保存的对象List
        * @throws InvocationTargetException
        * @throws IllegalArgumentException
        * @throws IllegalAccessException
        */
       public int insertAll(List<T> list) throws Exception {
          int count = 0 ,len = list.size(),step = 50000;
          Map<String, PropertyMapping> pm = op.mappings;
          int maxPage = (len % step == 0) ? (len / step) : (len / step + 1);
          for (int i = 1; i <= maxPage; i ++) {
             Page<T> page = pagination(list, i, step);
             String sql = "insert into " + getTableName() + "(" + op.allColumn + ") values ";// (" + valstr.toString() + ")";
             StringBuffer valstr = new StringBuffer();
             Object[] values = new Object[pm.size() * page.getRows().size()];
             for (int j = 0; j < page.getRows().size(); j ++) {
                if(j > 0 && j < page.getRows().size()){ valstr.append(","); }
                valstr.append("(");
                int k = 0;
                for (PropertyMapping p : pm.values()) {
                   values[(j * pm.size()) + k] = p.getter.invoke(page.getRows().get(j));
                   if(k > 0 && k < pm.size()){ valstr.append(","); }
                   valstr.append("?");
                   k ++;
                }
                valstr.append(")");
             }
             int result = jdbcTemplateWrite().update(sql + valstr.toString(), values);
             count += result;
          }

          return count;
       }

    private Serializable doInsertRuturnKey(Map<String,Object> params){
          final List<Object> values = new ArrayList<Object>();
          final String sql = makeSimpleInsertSql(getTableName(),params,values);
          KeyHolder keyHolder = new GeneratedKeyHolder();
          final JdbcTemplate jdbcTemplate = new JdbcTemplate(getDataSourceWrite());
            try {

                 jdbcTemplate.update(new PreparedStatementCreator() {
                public PreparedStatement createPreparedStatement(

                      Connection con) throws SQLException {
                   PreparedStatement ps = con.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);

                   for (int i = 0; i < values.size(); i++) {
                      ps.setObject(i+1, values.get(i)==null?null:values.get(i));

                   }
                   return ps;
                 }

             }, keyHolder);
            } catch (DataAccessException e) {
               log.error("error",e);
            }

​  
​  
 if (keyHolder == null) { return ""; }

​  
 Map<String, Object> keys = keyHolder.getKeys();
if (keys == null || keys.size() == 0 || keys.values().size() == 0) {
return "";
}
Object key = keys.values().toArray()[0];
if (key == null || !(key instanceof Serializable)) {
return "";
}
if (key instanceof Number) {
//Long k = (Long) key;
Class clazz = key.getClass();
// return clazz.cast(key);
return (clazz == int.class || clazz == Integer.class) ? ((Number) key).intValue() : ((Number)key).longValue();

​  
 } else if (key instanceof String) {
return (String) key;
} else {
return (Serializable) key;
}

​  
 }

    /**
        * 插入
        * @param params
        * @return
        */
       private boolean doInsert(Map<String, Object> params) {
          String sql = this.makeSimpleInsertSql(this.getTableName(), params);
          int ret = this.jdbcTemplateWrite().update(sql, params.values().toArray());
          return ret > 0;
       }


    删除方法，均以delete开头：

​  
 /\*\*
_ 删除对象.<br>
_
_ @param entity 待删除的实体对象
_/
public boolean delete(T entity) throws Exception {
return this.doDelete(op.pkField.get(entity)) > 0;
}

       /**
        * 删除对象.<br>
        *
        * @param list 待删除的实体对象列表
        * @throws InvocationTargetException
        * @throws IllegalArgumentException
        * @throws IllegalAccessException
        */
       public int deleteAll(List<T> list) throws Exception {
          String pkName = op.pkField.getName();
          int count = 0 ,len = list.size(),step = 1000;
          Map<String, PropertyMapping> pm = op.mappings;
          int maxPage = (len % step == 0) ? (len / step) : (len / step + 1);
          for (int i = 1; i <= maxPage; i ++) {
             StringBuffer valstr = new StringBuffer();
             Page<T> page = pagination(list, i, step);
             Object[] values = new Object[page.getRows().size()];

             for (int j = 0; j < page.getRows().size(); j ++) {
                if(j > 0 && j < page.getRows().size()){ valstr.append(","); }
                values[j] = pm.get(pkName).getter.invoke(page.getRows().get(j));
                valstr.append("?");
             }

             String sql = "delete from " + getTableName() + " where " + pkName + " in (" + valstr.toString() + ")";
             int result = jdbcTemplateWrite().update(sql, values);
             count += result;
          }
          return count;
       }

       /**
        * 根据id删除对象。如果有记录则删之，没有记录也不报异常<br>
        * 例如：删除主键唯一的记录
        *
        * @param id 序列化id
        */
       protected void deleteByPK(PK id)  throws Exception {
          this.doDelete(id);
       }

    /**
        * 删除实例对象，返回删除记录数
        * @param tableName
        * @param pkName
        * @param pkValue
        * @return
        */
       private int doDelete(String tableName, String pkName, Object pkValue) {
          StringBuffer sb = new StringBuffer();
          sb.append("delete from ").append(tableName).append(" where ").append(pkName).append(" = ?");
          int ret = this.jdbcTemplateWrite().update(sb.toString(), pkValue);
          return ret;
       }

​  
 修改方法，均以 update 开头：

​  
 /\*\*
_ 更新对象.<br>
_
_ @param entity 待更新对象
_ @throws IllegalAccessException
_ @throws IllegalArgumentException
_/
public boolean update(T entity) throws Exception {
return this.doUpdate(op.pkField.get(entity), parse(entity)) > 0;
}

    /**
        * 更新实例对象，返回删除记录数
        * @param pkValue
        * @param params
        * @return
        */
       private int doUpdate(Object pkValue, Map<String, Object> params){
          String sql = this.makeDefaultSimpleUpdateSql(pkValue, params);
          params.put(this.getPKColumn(), pkValue);
          int ret = this.jdbcTemplateWrite().update(sql, params.values().toArray());
          return ret;
       }

至此一个完整的 ORM 框架就横空出世。当然，还有很多优化的地方，请小伙伴可以继续完善。
