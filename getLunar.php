<?php

//允许跨域请求
header('Access-Control-Allow-Origin:*');

require_once('./class/lunar.php');

if(!empty($_GET['date'])){
    $date = $_GET['date'];
    if(preg_match('/\d{4}-\d{1,2}-\d{1,2}/',$date)){
        echo json_encode(getLunar($date));
    }else {
        $date = date('Y').'-'.date('m').'-'.date('d');
        echo json_encode(getLunar($date));
    }
}else {
    $date = date('Y').'-'.date('m').'-'.date('d');
    echo json_encode(getLunar($date));
}

function getLunar($date){
    $lunar = new Lunar($date);
    $date = explode('-',$date);
    return array(
        'remarks' => '声明：该API返回的日期有效区间为1900-1-31到2099-12-31，天干地支纪年月日和节气有效区间为2000-01-01到2099-12-31，调用前请自己检查日期是否有效。日期格式为yyyy-mm-dd或yyyy-m-d。',
        'data' => array(
            'year' => $lunar->getYear(),
            'month' => $lunar->getMonth(),
            'day' => $lunar->getDay(),
            'nyear' => $lunar->getLunarYear(),
            'nmonth' => $lunar->getLunarMonth(),
            'nday' => $lunar->getLunarDay(),
            'ntime' => $lunar->getLunarTime(),
            'animal' => $lunar->getAnimals(),
            'gzyear' => $lunar->getYearGanZhi(),
            'gzmonth' => $lunar->getMonthGanZhi(),
            'gzday' => $lunar->getDayGanZhi(),
            'festival' => $lunar->getFestival(),
            'jieqi' => $lunar->getJieQi(),
            'leapMonth' => $lunar->leapMonth(),
            'queryTime' => date('Y-m-d H:i:s')
        )
    );
}

