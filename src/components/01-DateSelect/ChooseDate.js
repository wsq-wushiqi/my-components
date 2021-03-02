/*
 * @Author: Wushiqi
 * @Descripttion: 快速获取当天、本周、本月、本季、今年
 * @Date: 2020-11-17 16:25:24
 * @LastEditor: Wushiqi
 * @LastEditTime: 2020-11-18 17:17:47
 */

// 日期格式化
// eslint-disable-next-line
Date.prototype.format = function(format) {
  var o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

export default function chooseDate(val) {
  let params = null
  var now = new Date() // 当前日期
  var nowDayOfWeek = now.getDay() - 1 // 获取今天是本周的第几天，通过减1将周一改为本周的第一天
  var nowDay = now.getDate() // 当前日
  var nowMonth = now.getMonth() // 当前月
  var nowYear = now.getFullYear() // 当前年

  // 格式化日期：yyyy-MM-dd
  function formatDate(date) {
    var myYear = date.getFullYear()
    var myMonth = date.getMonth() + 1
    var mmyWeekDay = date.getDate()
    if (myMonth < 10) {
      myMonth = '0' + myMonth
    }
    if (mmyWeekDay < 10) {
      mmyWeekDay = '0' + mmyWeekDay
    }
    return myYear + '-' + myMonth + '-' + mmyWeekDay
  }

  // 计算本月多少天
  function getMonthDays(myMonth) {
    var start = new Date(nowYear, myMonth, 1)
    var end = new Date(nowYear, myMonth + 1, 1)
    var days = (end - start) / (1000 * 60 * 60 * 24)
    return days
  }

  // 获取本季度的开始月份
  function getQuarterStartMonth() {
    var quarterStartMonth = 0
    switch (nowMonth) {
      case 12:
      case 1:
      case 2:
        quarterStartMonth = 0
        break
      case 3:
      case 4:
      case 5:
        quarterStartMonth = 3
        break
      case 6:
      case 7:
      case 8:
        quarterStartMonth = 6
        break
      case 9:
      case 10:
      case 11:
        quarterStartMonth = 9
        break
      default:
        break
    }
    return quarterStartMonth
  }
  switch (val) {
    case 1:
    // 当天
    {
      const star = now.format('yyyy-MM-dd')
      const end = now.format('yyyy-MM-dd')
      params = {
        startTime: star,
        endTime: end
      }
      break
    }
    case 2:
    // 本周
    {
      const weekStart = new Date(
        nowYear,
        nowMonth,
        nowDay - nowDayOfWeek
      )
      const start = formatDate(weekStart)
      const weekEnd = new Date(
        nowYear,
        nowMonth,
        nowDay + (6 - nowDayOfWeek)
      )
      const end = formatDate(weekEnd)
      params = {
        startTime: start,
        endTime: end
      }
      break
    }
    case 3:
      // 本月
      var monthStart = new Date(nowYear, nowMonth, 1)
      var start = formatDate(monthStart)
      var monthEnd = new Date(
        nowYear,
        nowMonth,
        getMonthDays(nowMonth)
      )
      var end = formatDate(monthEnd)
      params = {
        startTime: start,
        endTime: end
      }
      break
    case 4:
    {
      // 本季度
      let quarterStart = new Date(nowYear, getQuarterStartMonth(), 1)
      const start = formatDate(quarterStart)
      const quarterEnd = getQuarterStartMonth() + 2
      quarterStart = new Date(
        nowYear,
        quarterEnd,
        getMonthDays(quarterEnd)
      )
      const end = formatDate(quarterStart)
      params = {
        startTime: start,
        endTime: end
      }
      break
    }
    case 5:
    {
      const start = now.format('yyyy-01-01')
      const end = now.format('yyyy-12-31')
      params = {
        startTime: start,
        endTime: end
      }
      break
    }
    default:
      break
  }
  return params
}
