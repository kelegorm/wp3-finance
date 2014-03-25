/**
 * Created with JetBrains WebStorm.
 * User: Маша
 * Date: 26.11.13
 * Time: 15:37
 * To change this template use File | Settings | File Templates.
 */
var tagsTemplate = function (item) {
    var result='';
    for (var i=0; i<item.tags.length;i++) {
        result+='<span class="label itemTags">'+item.tags[i]+'</span>'
    }
    return result;
}

var buyTemplate = function (item){
    return '<div class="item">' +
                '<span class="itemName">'+item.name+'</span>' +
                '<div class="pull-right">' +
                    tagsTemplate(item)+
                     '<span class="itemPrice">'+item.price+'</span>'  +
                     '<span class="iconToDo icon-remove" data-id='+item.date+' data-purchase-id='+item._id+'></span>'+
                     '<span class="iconToDo icon-pencil" data-id='+item.date+' data-purchase-id='+item._id+'></span>'+
                '</div>' +
           '</div>';
}
//возвращает название, теги и цену одной покупки в виде html-элемента

var markToday = function (date) {
    var result='';
    if (date==getToday()) {
        result+= '<p class="muted">Today</p>'
    }
    return result;
}
//определяет есть ли данные за сегодняшнее число и в зависимости от этого дописывает Today или рисует форму ввода


var slideInputForm = function () {
    $('.btnAddTable').click(function () {
        $('.input-form').addClass('navbar-fixed-top');
        $('.input-form').slideDown(300);
        $('body').animate({paddingTop: '250px'},300);
    })
};
//рисует форму ввода по нажатию на кнопку Add

var inputExistDayTemplate = function (date) {
    var result;
    result='<div class="input-exist-day">' +
        '<form class="input-new-item" id="exist-day" data-date="'+date+'">' +
        '<input class="span4" name="name" size="16" type="text" placeholder="Good" required="true">'+
        '<input class="span2" name="tags" size="16" type="text" placeholder="Tags">' +
        '<input class="span1" name="price" size="16" type="text" placeholder="Price" required="true">'  +
        '<input class="addNewItemExistDay" type="submit">' +
        '</form>' +
        '</div>';

    return result;
}

var dayTemplate =function(date,total,itemes){
    var result;
    result='<div class="day-item row" data-id="'+date+'" id="'+date+'">'+
        '<div class="date-column span2 bold">'+
        date+
        markToday(date)+
        '</div>' +
        '<div class="table-column span7">'+
        itemes+
        '<small><a class="addInExistDay text-info" href="#"> Add one more purchase</a></small>'+
        '</div>' +
        '<div class="total-column span2 bold">'+
        total+
        '</div>' +
        '</div>';

    return result;
};
//возвращает все данные за день в виде html-элемента

var dateListTemplate = function (quantityLI) {
    var today = new Date();
    var monthToday=today.getMonth();
    var yearToday=today.getFullYear();
    var monthArray=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var readableMonth=monthArray[monthToday];
    var dayArray=daysList(quantityLI);
    var dateArray=[];
    var result = '<ul class="date-list">'
    for (var i=0;i<dayArray.length;i++){
        dateArray[i]='';
        dayToAdd=lessTenAddZero(dayArray[i].day);
        monthtoAdd=lessTenAddZero(dayArray[i].month+1);
        dateArray[i]='<span>'+dayToAdd+'</span>'+' '+'<small>'+ monthArray[dayArray[i].month]+'</small>';

        if (i===0){dateArray[i]+='<div class="muted pull-right">Today</div>';}

        result+='<li data-id='+dayToAdd+'/'+monthtoAdd+'/'+dayArray[i].year+'><a href="#'+dayToAdd+'/'+monthtoAdd+'/'+dayArray[i].year+'">'+dateArray[i]+'</a></li>';
    }
    result+='</ul>';
    $('.day-choose').prepend(result);
};
//формирует html-список дат с помощью daysList

var editInputTemplate = function (item) {
    var result;
    result='<div class="edit-item">' +
        '<form class="edit-item-form" id="'+item._id+'" data-date="'+item.date+'">' +
        '<input class="span4" name="name" size="16" type="text" value="'+item.name+'">'+
        '<input class="span2" name="tags" size="16" type="text" value="'+item.tags+'">' +
        '<input class="span1" name="price" size="16" type="text" value="'+item.price+'">'  +
        '<input class="addNewItemExistDay" type="submit">' +
        '</form>' +
        '</div>';

    return result;
}