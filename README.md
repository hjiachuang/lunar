# lunar -- 公历转换农历Api

## 测试Url：（php服务器）
  https://api.aidioute.cn/lunar/getLunar.php

## 更新：

### 2019/03/12
JavaScript版本
####
添加JavaScript版本，支持node.js环境和浏览器环境
```
//node.js
let Lunar = require("class.js")
let lunar = new Lunar()     //括号中可以接受传参，数据类型为字符串，格式为：yyyy-m-d 或 yyyy-mm-dd

//属性和方法
lunar.year                  //当前公历年份
lunar.month                 //当前公历月份
lunar.day                   //当前公历日期
lunar.ylYear                //当前农历年份
lunar.ylMonth               //当前农历月份
lunar.ylDay                 //当前农历日期
lunar.getLunarTime()        //获取农历中文格式（例：二月初二）
lunar.getAnimals()          //获取该年生肖
lunar.getYearGanZhi()       //获取天干地支纪年
lunar.getMonthGanZhi()      //获取天干地支纪月
lunar.getDayGanZhi()        //获取天干地支纪日
lunar.getFestival()         //获取该天节日
lunar.getJieQi()            //获取该月节气
lunar.leapMonth()           //获取该年是否有闰月，有返回月数，没有返回0
```

```
//script src直接引用dist中的class.js文件，然后创建lunar实例对象即可。
```
如果当前已安装node运行环境，可以直接命令行cd到Node.js文件夹中,然后运行
```
npm install
```
等待安装完之后运行
```
npm run run
```
即可运行简单的HTTP服务器，访问的url地址为
```
http://localhost:8000/api/lunar
```
**可以接受传参，传参跟php版本一致，见下文。


### 2019/03/08
PHP版本：5+ <br>
####
原php文件引用的是new DateTime对象中的 $obj->format('U')来获取当前日期相对于1900-1-31日的秒数差再除以86400（一天的秒数）的差值。
由于是小值减大值，结果是负数且带小数的，在向上取整的过程中，出现了1901-12-14和1901-12-15这两天的差值为2的情况。
意思就是
```
1900-01-31到1901-12-14的差值是682，
1900-01-31到1901-12-15的差值是684
```
貌似是PHP版本问题。在PHP7.0+的环境中运行正常，在PHP5.5版本中运行就会出现差值。
现在改成date_create()和date_diff()。问题解决。


~PHP版本：7+ <br>~
api入口文件：getLunar.php <br>


## 说明：
#### 该api默认不传参的时候返回当前日期所属的公历农历信息。若要传参，以get的形式提交，参数名为date，日期格式为：yyyy-m-d 或 yyyy-mm-dd。
#### 返回的是json格式的数据。

## 特别注意：
#### 该api中只包含了 1900-1-31 到 2099-12-31 期间的所有农历月份信息。天干地支和二十四节气计算方法来源于*互联网*，节气算法中的_C参数_只添加了_21世纪_的值，所以_20世纪_的节气计算中_可能会有差错_。而天干地支中的天干地支_月份_需要用到节气来计算，所以20世纪的天干地支_月_数据可能不准确。

## 例：
#### get: "getLunar.php?date=2019-03-08"
#### 
```
{
  "remarks": "声明：该API返回的日期有效区间为1900-1-31到2099-12-31，天干地支纪年月日和节气有效区间为2000-01-01到2099-12-31，调用前请自己检查日期是否有效。日期格式为yyyy-mm-dd或yyyy-m-d。",
  "data": {
    "year": 2019,
    "month": 3,
    "day": 8,
    "nyear": 2019,
    "nmonth": 2,
    "nday": 2,
    "ntime": "二月初二",
    "animal": "猪",
    "gzyear": "己亥年",
    "gzmonth": "丁卯月",
    "gzday": "甲辰日",
    "festival": [
      "国际劳动妇女节",
      "土地诞（龙抬头）"
    ],
    "jieqi": {
      "惊蛰": 6,
      "春分": 21
    },
    "leapMonth": 0,
    "queryTime": "2019-03-08 15:42:35"
   }
}
```
