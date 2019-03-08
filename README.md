# lunar -- 公历转换农历Api

PHP版本：7+ <br>
api入口文件：getLunar.php

## 说明：
### 该api默认不传参的时候返回当前日期所属的公历农历信息。若要传参，以get的形式提交，参数名为date，日期格式为：yyyy-m-d 或 yyyy-mm-dd。
### 返回的是json格式的数据。

## 例：
### get: "getLunar.php?date=2019-03-08"
### 
···
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
···
