if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Lunar
}
function Lunar(date) {
  this.year = this.getDateData().year       //公历年份
  this.month = this.getDateData().month     //公历月份
  this.day = this.getDateData().day         //公历日期
  this.ylYear = 0                           //农历年份
  this.ylMonth = 0                          //农历月份
  this.ylDay = 0                            //农历日期
  this._date = date? date : null
  this._error = "无"
  this._ylDate = 0                          //当前日期是农历年的第多少天
  this._leap = 0                            //代表农历闰几月
  this._leapDays = 0                        //代表农历闰月的天数
  this._difmonth = 0                        //当前时间距离参考时间相差多少月
  this._difDay = 0                          //当前时间距离参考时间相差多少天
  this._leapMonth = false                   //当前农历月份是否为闰月

  this.checkDate()                          //检查传入的日期是否正确，正确的话修改this中的年月日。不正确的话用当前日期计算
  this.init()                               //初始化
}
//生肖数组
Lunar.prototype.animals = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]

//天干地支算法参数
Lunar.prototype.D = 0.2422

//天干地支算法参数
Lunar.prototype.C = [
    3.87, 18.73, 5.63, 20.646, 4.81, 20.1, 5.52, 21.04,
    5.678, 21.37, 7.108, 22.83, 7.5, 23.13, 7.646, 23.042,
    8.318, 23.438, 7.438, 22.36, 7.18, 21.94, 5.4055, 20.12
]

//天干数组
Lunar.prototype.tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]

//年份相关地支数组
Lunar.prototype.yearDiZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]

//月份相关地支数组
Lunar.prototype.monthDiZhi = ["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"]

//1900年-2100年每年的农历月份信息。第一位表示闰月是大月（1）还是小月（0）。第二三四位转换成二进制表示每个月份是大月（1）还是小月（0）。最后一位表示闰月在第几月，为0表示没有闰月。
Lunar.prototype.dateInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,//1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,//1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,//1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,//1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,//1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0,//1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,//1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,//1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,//1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,//1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,//2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,//2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,//2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,//2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,//2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0,//2050-2059
  0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4,//2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0,//2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160,//2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252,//2090-2099
  0x0d520////2100
  ]

//固定节日日期数组
Lunar.prototype.festival = ["0101", "0202", "0210", "0214", "0228", "0301", "0308",
  "0314", "0315", "0317", "0321", "0322", "0323", "0324", "0401", "0402",
  "0407", "0422", "0423", "0424", "0501", "0503", "0505", "0508", "0512",
  "0515", "0517", "0518", "0526", "0531", "0601", "0605", "0617", "0620",
  "0623", "0626", "0630", "0702", "0711", "0726", "0806", "0908", "0914",
  "0916", "0921", "0927", "1002", "1004", "1009", "1014", "1015", "1016",
  "1017", "1022", "1024", "1028", "1031", "1110", "1114", "1117", "1121",
  "1201", "1202", "1203", "1205", "1207", "1210", "1211", "1215", "1221",
  "1225", "1229", "0312", "0504", "0701", "0801", "0910"
]

//固定节日名称数组
Lunar.prototype.festivalName = ["元旦", "世界湿地日", "国际气象节", "情人节", "世界居住条件调查日", "国际海豹日",
  "国际劳动妇女节", "国际警察日", "国际消费者权益日", "国际航海日", "世界林业节", "世界水日", "世界气象日",
  "世界防治结核病日", "国际愚人节", "国际儿童图书日", "世界卫生日", "世界地球日", "世界图书和版权日",
  "世界青年反对殖民主义日", "国际劳动节", "世界哮喘日", "全国碘缺乏病防治日", "世界红十字日", "国际护士节",
  "国际家庭（咨询）日", "世界电信日", "国际博物馆日", "世界向人体条件挑战日", "世界无烟日", "国际儿童节", "世界环境日",
  "世界防止荒漠化和干旱日", "世界难民日", "国际奥林匹克日", "国际禁毒日", "世界青年联欢节", "国际体育记者日", "世界人口日",
  "世界语（言）创立日", "国际电影节", "国际新闻工作者日", "世界清洁地球日", "国际臭氧层保护日", "国际和平日", "世界旅游日",
  "国际和平（与民主自由）斗争日", "世界动物日", "世界邮政日", "世界标准日", "国际盲人节", "世界粮食日", "世界消除贫困日",
  "世界传统医药日", "联合国日", "世界男性健康日", "世界勤俭日", "世界青年节", "世界糖尿病日", "国际学生日",
  "世界电视日", "世界艾滋病日", "废除一切形式奴役世界日", "世界残疾人日", "国际志愿人员日", "国际民航日", "世界人权日",
  "世界防治哮喘日", "世界强化免疫日", "国际篮球日", "圣诞节", "国际生物多样性日", "植树节", "青年节",
  "中国共产党成立纪念日", "建军节", "教师节"
]

//固定节日日期数组（农历节日）
Lunar.prototype.festivalByLunar = [
    "1.1", "1.15", "2.2", "3.3", "5.5", "7.7", "8.15", "9.9", "10.1", "10.15", "12.8", "12.30"
]

//固定节日名称数组（农历节日）
Lunar.prototype.festivalNameByLunar = [
    "春节", "元宵节", "土地诞（龙抬头）", "上巳节", "端午节", "七夕节", "中秋节", "重阳节", "寒衣节", "下元节", "腊八节", "除夕"
]

// 节气数组
Lunar.prototype.jieqi = [
  "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑",
  "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至", "小寒", "大寒"
]

Lunar.prototype.checkDate = function(){
  let date = this._date
  //判断是否有传值，没有传值默认以当前日期计算
  if (!date) {
    this._error = "无传值"
  }else if(!(/\d{4}-\d{1,2}-\d{1,2}/.test(date))){
    this._error = "格式错误"
  } else {
    date = date.split("-")
    if(parseInt(date[0]) % 4 !== 0 && parseInt(date[0]) % 100 !== 0 && parseInt(date[1]) === 2 && parseInt(date[2]) === 29) {
      this._error = "非闰年，2月份没有29日"
    }else if((parseInt(date[1]) === 1 || parseInt(date[1]) === 3 || parseInt(date[1]) === 5 || parseInt(date[1]) === 7 || parseInt(date[1]) === 8 || parseInt(date[1]) === 10 || parseInt(date[1]) === 12 ) && parseInt(date[2]) > 31) {
      this._error = parseInt(date[1]) + "月份只有31日"
    }else if((parseInt(date[1]) === 4 || parseInt(date[1]) === 6 || parseInt(date[1]) === 9 || parseInt(date[1]) === 11) && parseInt(date[2]) > 30){
      this._error = parseInt(date[1]) + "月份只有30日"
    }else {
      this.year = parseInt(date[0])
      this.month = parseInt(date[1])
      this.day = parseInt(date[2])
    }
  }
}

//初始化（将阳历转换为对应的阴历年份月份和日期）
Lunar.prototype.init = function () {
  let firstDay = "01-31-1900"
  let newDay = this.month + "-" + this.day + "-" + this.year
  let offset = this.getDaysByDateString(firstDay,newDay)
  this._difDay = offset++
  let temp = 0
  for (var i = 1900; i <= 2100 && offset > 0; i++) {
    temp = this.getYearDays(i)//计算i年有多少天
    offset -= temp
    this._difmonth += 12
    //判断该年否存在闰月
    if (this.leapMonth(i) > 0) {
      this._difmonth += 1
    }
  }
  if (offset <= 0) {
    offset += temp
    i--
    this._difmonth -= 12
  }
  if (this.leapMonth(i) > 0) {
    this._difmonth -= 1
  }
  this._ylDays = offset
  //此时offset代表是农历该年的第多少天
  this.ylYear = i//农历哪一年
  //计算月份，依次减去1~12月份的天数，直到offset小于下个月的天数
  let curMonthDays = this.monthDays(this.ylYear, 1)
  //判断是否该年是否存在闰月以及闰月的天数
  this._leap = this.leapMonth(this.ylYear)
  if (this._leap != 0) {
    this._leapDays = this.leapDays(this.ylYear)
  }
  for (var j = 1; j < 13 && curMonthDays < offset; curMonthDays = this.monthDays(this.ylYear, ++j)) {
    if (this._leap == j) { //闰月
      offset -= curMonthDays
      this._difmonth += 1
      this._leapMonth = true
      if (offset > this._leapDays) {
        this._leapMonth = false
        offset -= this._leapDays
        this._difmonth += 1
      } else {
        break
      }
    } else {
      offset -= curMonthDays
      this._difmonth += 1
    }
  }

  this.ylMonth = j
  this.ylDay = offset
}

//获取农历某年的总天数
Lunar.prototype.getYearDays = function (year) {
  let sum = 348;//12*29=348,不考虑小月的情况下
  for (let i = 0x8000; i >= 0x10; i >>= 1) {
    sum += (this.dateInfo[year - 1900] & i) ? 1 : 0;
  }
  // console.log(this.leapMonth())
  let result = sum + this.leapDays(year)
  return result
}

//获取农历某年闰月的天数
Lunar.prototype.leapDays = function(year) {
  if (this.leapMonth(year)) {
    return (this.dateInfo[year - 1900] & 0x10000) ? 30 : 29
  } else {
    return (0)
  }
}

//获取农历某年的闰月为几月
Lunar.prototype.leapMonth = function (year) {
  year = year ? year : this.ylYear;
  return (this.dateInfo[year - 1900] & 0xf)
}

//获取农历某年某月的天数
Lunar.prototype.monthDays = function (year,month) {
  return (this.dateInfo[year - 1900] & (0x10000 >> month)) ? 30 : 29
}

//获取阳历对应的阴历文本格式（例：二月初一）
Lunar.prototype.getLunarTime = function () {
  let dateStr = ""
  if (this._leapMonth) { //是闰月
    dateStr += "闰"
  }
  tmp = ["初", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "廿"]
  if (this.ylMonth > 10) {
    let m2 = parseInt(this.ylMonth - 10)//十位
    if (m2 === 1) {
      dateStr += "冬月"
    }
    if (m2 === 2) {
      dateStr += "腊月"
    }
  } else if (this.ylMonth == 1) {
    if (dateStr === "闰") {
      dateStr = "闰一月"
    } else {
      dateStr += "正月"
    }

  } else {
    dateStr += tmp[this.ylMonth] + "月"
  }

  if (this.ylDay < 11) {
    dateStr += "初" + tmp[this.ylDay]
  } else {
    let m1 = parseInt(this.ylDay / 10)
    if (m1 != 3) {
      dateStr += (m1 == 1) ? "十" : "廿"
      m2 = this.ylDay % 10
      if (m2 == 0) {
        dateStr += "十"
      } else {
        dateStr += tmp[m2]
      }
    } else {
      dateStr += "三十"
    }
  }
  return dateStr
}

//获取该年对应的天干地支年
Lunar.prototype.getYearGanZhi = function (ylYear) {
  year = ylYear ? ylYear : this.ylYear
  return this.getYearTianGan(year) + this.getYearDiZhi(year) + "年"
}

//获取该年对应的年天干
Lunar.prototype.getYearTianGan = function (ylYear) {
  year = ylYear ? ylYear : this.ylYear
  return this.tianGan[(year - 4) % 10]
}

//获取该年对应的年地支
Lunar.prototype.getYearDiZhi = function (ylYear) {
  year = ylYear ? ylYear : this.ylYear
  return this.yearDiZhi[(year - 4) % 12]
}

//获取该年对应的天干地支月
Lunar.prototype.getMonthGanZhi = function (ylYear, ylMonth) {
  year = ylYear ? ylYear : this.ylYear
  month = ylMonth ? ylMonth : this.ylMonth
  return this.getMonthTianGan(year) + this.getMonthDiZhi(month)
}

//获取该年对应的月天干
Lunar.prototype.getMonthTianGan = function (ylYear) {
  year = ylYear ? ylYear : this.ylYear
  let jieQi = []
  let yearTianGan = this.getYearTianGan(year)
  let monthFirstTianGan = "", monthTianGan = ""
  let offset = 0
  switch (yearTianGan) {
    case '甲':
    case '己':
      monthFirstTianGan = '丙'
      break
    case '乙':
    case '庚':
      monthFirstTianGan = '戊'
      break
    case '丙':
    case '辛':
      monthFirstTianGan = '庚'
      break
    case '丁':
    case '壬':
      monthFirstTianGan = '壬'
      break
    case '戊':
    case '癸':
      monthFirstTianGan = '甲'
      break
  }
  for (let i = 1; i < 13; i++) {
    jieQi.push(this.getJieQi(null, i))
  }
  jieQi.push(this.getJieQi(this.year + 1, 1))
  switch (true) {
    case (this.month == 1 && this.day >= jieQi[0]['小寒']):
      offset = -1
      break
    case (this.month == 1 && this.day < jieQi[0]['小寒']):
      offset = -2;
      break;
    case (this.month == 2 && this.day >= jieQi[1]['立春']):
      offset = 0;
      break;
    case (this.month == 2 && this.day < jieQi[1]['立春']):
      offset = -1;
      break;
    case (this.month == 3 && this.day >= jieQi[2]['惊蛰']):
      offset = 1;
      break;
    case (this.month == 3 && this.day < jieQi[2]['惊蛰']):
      offset = 0;
      break;
    case (this.month == 4 && this.day >= jieQi[3]['清明']):
      offset = 2;
      break;
    case (this.month == 4 && this.day < jieQi[3]['清明']):
      offset = 1;
      break;
    case (this.month == 5 && this.day >= jieQi[4]['立夏']):
      offset = 3;
      break;
    case (this.month == 5 && this.day < jieQi[4]['立夏']):
      offset = 2;
      break;
    case (this.month == 6 && this.day >= jieQi[5]['芒种']):
      offset = 4;
      break;
    case (this.month == 6 && this.day < jieQi[5]['芒种']):
      offset = 3;
      break;
    case (this.month == 7 && this.day >= jieQi[6]['小暑']):
      offset = 5;
      break;
    case (this.month == 7 && this.day < jieQi[6]['小暑']):
      offset = 4;
      break;
    case (this.month == 8 && this.day >= jieQi[7]['立秋']):
      offset = 6;
      break;
    case (this.month == 8 && this.day < jieQi[7]['立秋']):
      offset = 5;
      break;
    case (this.month == 9 && this.day >= jieQi[8]['白露']):
      offset = 7;
      break;
    case (this.month == 9 && this.day < jieQi[8]['白露']):
      offset = 6;
      break;
    case (this.month == 10 && this.day >= jieQi[9]['寒露']):
      offset = 8;
      break;
    case (this.month == 10 && this.day < jieQi[9]['寒露']):
      offset = 7;
      break;
    case (this.month == 11 && this.day >= jieQi[10]['立冬']):
      offset = 9;
      break;
    case (this.month == 11 && this.day < jieQi[10]['立冬']):
      offset = 8;
      break;
    case (this.month == 12 && this.day >= jieQi[11]['大雪']):
      offset = 10;
      break;
    case (this.month == 12 && this.day < jieQi[11]['大雪']):
      offset = 9;
      break;
  }
  if (offset + this.tianGan.indexOf(monthFirstTianGan) > 9) {
    monthTianGan = this.tianGan[offset + this.tianGan.indexOf(monthFirstTianGan) - 10]
  } else {
    monthTianGan = this.tianGan[offset + this.tianGan.indexOf(monthFirstTianGan)]
  }
  return monthTianGan
}

Lunar.prototype.getMonthDiZhi = function (ylMonth) {
  month = ylMonth ? ylMonth : this.ylMonth
  return this.monthDiZhi[month - 1]
}

//获取该年对应的天干地支日
Lunar.prototype.getDayGanZhi = function () {
  return this.tianGan[this._difDay % 10] + this.yearDiZhi[(this._difDay + 4) % 12] + '日'
}

//获取该年的生肖
Lunar.prototype.getAnimals = function () {
  return this.animals[(this.ylYear - 1900) % 12]
}

//获取当天的节日
Lunar.prototype.getFestival = function () {

  let date = (this.month >= 10? this.month : "0" + this.month)  + (this.day >= 10? this.day : "0" + this.day)
  temp = []
  for (let i = 0; i < this.festival.length; i++) {
    if (this.festival[i] === date) {
      temp.push(this.festivalName[i])
    }
  }
  let lunarDate = this.ylMonth + '.' + this.ylDay
  for (let i = 0; i < this.festivalByLunar.length; i++) {
    if (this.festivalByLunar[i] === lunarDate) {
      temp.push(this.festivalNameByLunar[i])
    }
  }
  let qingming = parseInt(this.getJieQi(null, 4)['清明'])
  if (this.day === qingming && this.month === 4) {
    temp.push("清明节")
  }
  return temp
}

//获取相近的节气
Lunar.prototype.getJieQi = function (year,month) {
  let min = 0, max = 0
  //获取年份的后两位数
  year = year ? year % 100 : this.year % 100
  //获取月份
  month = month ? month : this.month
  //月份不为1的时候
  if (month > 1) {
    min = 2 * month - 4;
    max = 2 * month - 3;
  } else { //月份为1的时候
    min = 22;
    max = 23;
  }
  let temp = {}
  //匹配意外的日期
  if ((this.year === 1911 && month === 5) || (this.year === 1902 && month === 6) || ((this.year === 1925 || this.year === 2016) && month === 7) || (this.year === 1982 && month === 1) || (this.year === 2002 && month === 8) || (this.year === 1927 && month === 9) || (this.year === 2089 && month === 11) || (this.year === 1954 && month === 12)) {
    temp[this.jieqi[min]] = parseInt(year * this.D + this.C[min]) - Math.floor((year - 1) / 4) + 1
    temp[this.jieqi[max]] = parseInt(year * this.D + this.C[max]) - Math.floor((year - 1) / 4)
    return temp
  }
  if ((this.year === 2084 && month === 3) || (this.year === 2008 && month === 5) || (this.year === 1928 && month === 6) || (this.year === 1922 && month === 7) || (this.year === 1994 && month === 1) || (this.year === 2082 && month === 1) || (this.year === 1942 && month === 9) || (this.year === 2089 && month === 10) || (this.year === 1978 && month === 11)) {
    temp[this.jieqi[min]] = parseInt(year * this.D + this.C[min]) - Math.floor((year - 1) / 4)
    temp[this.jieqi[max]] = parseInt(year * this.D + this.C[max]) - Math.floor((year - 1) / 4) + 1
    return temp
  }
  if ((this.year === 2026 && month === 2) || (this.year === 1918 || this.year === 2021) && month === 7) {
    temp[this.jieqi[min]] = parseInt(year * this.D + this.C[min]) - Math.floor((year - 1) / 4)
    temp[this.jieqi[max]] = parseInt(year * this.D + this.C[max]) - Math.floor((year - 1) / 4) - 1
    return temp
  }
  if (this.year === 2019 && month === 1) {
    temp[this.jieqi[min]] = parseInt(year * this.D + this.C[min]) - Math.floor((year - 1) / 4) - 1
    temp[this.jieqi[max]] = parseInt(year * this.D + this.C[max]) - Math.floor((year - 1) / 4)
    return temp
  }

  //无意外的时候返回正常的数据
  temp[this.jieqi[min]] = parseInt(year * this.D + this.C[min]) - Math.floor((year - 1) / 4)
  temp[this.jieqi[max]] = parseInt(year * this.D + this.C[max]) - Math.floor((year - 1) / 4)
  return temp
}

//获取两个日期相差的天数
Lunar.prototype.getDaysByDateString = function(dt1,dt2) {
  let startDate = Date.parse(dt1.replace("/-/g","/"))
  let endDate = Date.parse(dt2.replace("/-/g","/"))
  let diffDate = Math.abs(endDate - startDate)
  return Math.floor(diffDate / (1 * 24 * 60 * 60 * 1000))
}

//获取当前日期
Lunar.prototype.getDateData = function() {
  let date = new Date()
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours() >= 10? date.getHours() : "0" + date.getHours(),
    min: date.getMinutes() >= 10? date.getMinutes() : "0" + date.getMinutes(),
    sec: date.getSeconds() >= 10? date.getMinutes() : "0" + date.getMinutes(),
    wek: this.getWeek(date.getDay())
  }
}

//获取当前周
Lunar.prototype.getWeek = function(data) {
    if (data === null || data < 0 || data > 6) {
      var date = new Date().getDay()
    } else {
      var date = data
    }
    switch (date) {
      case 0:
        return "日"
      case 1:
        return "一"
      case 2:
        return "二"
      case 3:
        return "三"
      case 4:
        return "四"
      case 5:
        return "五"
      case 6:
        return "六"
    }
  }