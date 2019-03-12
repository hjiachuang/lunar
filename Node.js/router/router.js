//路由
let express = require("express")
let router = express.Router()
let Lunar = require("../dist/class")

router.get("/api/lunar",function(req,res){
  var date
  if(req.query.hasOwnProperty("date")){
    date = req.query.date
  }
  var lunar = new Lunar(date)
  var newDate = lunar.getDateData()
  res.send(JSON.stringify({
    "remarks": "声明：该API返回的日期有效区间为1900-1-31到2099-12-31，天干地支纪年月日和节气有效区间为2000-01-01到2099-12-31，调用前请自己检查日期是否有效。日期格式为yyyy-mm-dd或yyyy-m-d。",
    "error": lunar._error,
    "data": {
      "year": lunar.year,
      "month": lunar.month,
      "day": lunar.day,
      "nyear": lunar.ylYear,
      "nmonth": lunar.ylMonth,
      "nday": lunar.ylDay,
      "ntime": lunar.getLunarTime(),
      "animal": lunar.getAnimals(),
      "gzyear": lunar.getYearGanZhi(),
      "gzmonth": lunar.getMonthGanZhi(),
      "gzday": lunar.getDayGanZhi(),
      "festival": lunar.getFestival(),
      "jieqi": lunar.getJieQi(),
      "leapMonth": lunar.leapMonth(),
      "queryTime": newDate.year + "-" + newDate.month + "-" + newDate.day + " " + newDate.hour + ":" +newDate.min + ":" + newDate.sec
    }
  }))
})

module.exports = router


