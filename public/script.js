/**
 * Created with JetBrains WebStorm.
 * User: Маша
 * Date: 31.10.13
 * Time: 11:34
 * To change this template use File | Settings | File Templates.
 */

var initialRender = function (dayArray) {
    for (var i=0;i<dayArray.length;i++) {
        var day=dayArray[i];
        var dataPerDay=model[day];
        showDayPerDay(dataPerDay);
    }
    dateListTemplate(7);
    slideInputForm();
    hideInputForm();
    addNewData('.input-new-item');
    //todo я вообще сомневаюсь, нужен ли здесь addNewData
    deleteItem();
    editItem();
    viewInputInExistDay();
};
//рисует начальный экран

var showDayPerDay = function (data) {
    var itemes='';
    for (var i=0; i<data.length; i++) {
        itemes+=buyTemplate(data[i]);
    }
//формирует html-элемент, в котором есть все покупки

    var date=data[0].date;
    var total=calculateTotal(data);
    var dayHTML=dayTemplate(date,total,itemes);
    $('#dayList').append(dayHTML);

};
//добавляет данные за день в html-файл

var sortedDateIndex = function (array) {
    var dayArray=[]
    for (var day in array) {
         dayArray.push(day);
    };
    for (var i=0;i<dayArray.length-1;i++){
        for (var k=i+1;k<dayArray.length;k++){
            if(getDateIndex(dayArray[k])>getDateIndex(dayArray[i])) {
                var temp=dayArray[i];
                dayArray[i]=dayArray[k];
                dayArray[k]=temp;
            }
        }
    }
    return dayArray;
}
//возвращает массив отсортированных дат

var sortData = function (allData) {
    var result={};
    for (var i=0;i<allData.length;i++) {
         if (result.hasOwnProperty(allData[i].date)) {
             result[allData[i].date].push(allData[i])
         } else {
             result[allData[i].date]=[];
             result[allData[i].date].push(allData[i])
         }
    }
    return result;
};
//формирует из всех данных объект с ключами в виде дат

/**
 * возвращает массив дат для вывода выбиралки дат (начиная с сегодня, параметр - количество)
 * @param quantityLI - количество дней, которые нужно вернуть
 * @returns {Array} список дней, начиная с сегодня и по убывающей
 */
var daysList =function(quantityLI){
    var today = new Date();
    var dayToday=today.getDate();
    var dayArray=[];
    for (var i=0; i<quantityLI; i++) {
        var someDate = new Date(today);
        someDate.setDate(someDate.getDate() - i);
        var someDay = someDate.getDate();
        var someMonth=someDate.getMonth();
        var someYear=someDate.getFullYear();
        var someDate={day: someDay, month: someMonth, year: someYear};
        dayArray.push(someDate);
    };
    return dayArray;
};

var addNewItemToModel = function (date,newItem){
    if (model.hasOwnProperty(date)) {
        model[date].push(newItem);
    } else {
        model[date]=[];
        model[date].push(newItem);
    }
}
//добавляет новый элемент в модель

var viewNewDay = function (date,item,model) {
    var dateArray=sortedDateIndex(model);
    var dayAfterDayToAdd;
    var viewNewDay=dayTemplate(date,item.price,item.name);
    var i=0;
    if (getDateIndex(dateArray[0])==getDateIndex(date)) {
        $('#dayList').prepend(viewNewDay);
    } else {
        do {
            dayAfterDayToAdd=dateArray[i];
            i++;}
        while (getDateIndex(dateArray[i])>getDateIndex(date));
        $('#dayList').find('[data-id="'+dayAfterDayToAdd+'"]').after(viewNewDay);
    }

    viewInputInExistDay();
}
//рисует новый день (данных за который ещё не было)

var viewNewItem = function (date,item) {
    var itemForAdd=buyTemplate(item);

    var total=calculateTotal(model[date]);
    $('#dayList').find('[data-id="'+date+'"]').children('.table-column').prepend(itemForAdd);
    $('#dayList').find('[data-id="'+date+'"]').children('.total-column').html(total);
    deleteItem();
    editItem();
}
//рисует новую покупку (день уже был в модели)

var getDataForm = function (array) {
    var result={};
    for (var i=0;i<array.length;i++){
        result[array[i].name]='';
        result[array[i].name]=array[i].value;
    }
    return result;
}

var getNewItemFromForm = function (formElement) {

    var thisId=$(formElement).attr("id");
    var date;

    if (thisId==='new-day') {
       date=$('li.selected').data('id');
    }  else {
       date=$(formElement).closest('.day-item').data('id');
    }

    var inputData=$(formElement).serializeArray();
    var newItem=getDataForm(inputData);
    newItem['date']=date;
    newItem.price=Number(newItem.price);

    newItem.tags=newItem.tags.split(',');
    for (var i=0; i<newItem.tags.length;i++) {
        newItem.tags[i]= $.trim(newItem.tags[i]);
    }
    //очищаем введенные теги от пробелов в начале и в конце

    console.log(newItem);

    return newItem;
}

var addNewData = function (form){
    $(form).submit(function(event){
        event.preventDefault();

        console.log ('I work!');

        var newItem=getNewItemFromForm(this);
        $(this)[0].reset();
//        очищаем формы ввода

        model[newItem.date].push(newItem);
        postNewPurchase(newItem);
        viewNewItem(newItem.date,newItem);
    });
};
//добавляет по нажатию на кнопку новые данные и очищает формы ввода

var changeElement = function (elementToHide, elementToView) {
    $(elementToHide).css('display','none');
    $(elementToView).css('display','inline');
}
//изменяет свойство display элементов. Один становится скрыт, а второй отображается

var viewInputInExistDay = function () {
    $('.addInExistDay').click(function() {
        var date=$(this).closest('.day-item').data('id');

        changeElement('.input-exist-day','.addInExistDay');
        //скрывает формы, открытые в других днях и отображает на их месте ссылку для открытия формы

        $(this).closest('.table-column').append(inputExistDayTemplate(date));

        addNewData('[data-date="'+date+'"]');

        $(this).css('display','none');
        //скрывает ссылку, по которой была открыта форма
    })
}

var dateSelect = function (){
    $('.date-list li').click(function(){
        $('ul.date-list li').removeClass('selected');
        $(this).addClass('selected');
        var newDate=$('li.selected').data('id');
        var newItem={
            name: '',
            price: 0,
            tags: 'no tags',
            date: newDate
        };

        if (!model.hasOwnProperty(newDate)){
            addNewItemToModel(newDate,newItem);
            viewNewDay(newDate,newItem,model)
            console.log (model);
        }
    })
};
//подсвечивает выбранное число (к выбранному элементу списка добавляется класс selected)

var hideInputForm = function (){
    $('.btnHide').click(function (){
//        $('.input-form').removeClass('navbar-fixed-top');
        $('.input-form').slideUp(300);
        $('body').stop(true, true).animate({paddingTop: '60px'},300);

        $('ul.date-list li').removeClass('selected');
        //отменяем выбор даты, если закрываем панель ввода
    })
};

//var getItemToDelete = function (element) {
//   var result={};
//   var commonParent=$(element).closest('.item');
//   var name=commonParent.children('.itemName').text();
//   var price=commonParent.children('.pull-right').children('.itemPrice').text();
//   var date=commonParent.parent('.table-column').closest('.date-column').text();
//
//   var tags=[];
//   var tagsQuantity=commonParent.children('.pull-right').children('.itemPrice').siblings('.label').size();
//    for (i=0;i<tagsQuantity;i++) {
//       tags[i]=commonParent.children('.pull-right').find('.label:nth-of-type('+(i+1)+')').text();
//   }
//
//    result['name']=name;
//    result['price']=Number(price);
//    result['tags']=tags;
//    result['date']=date;
//
//    return result;
//};

var getIDItem = function (element) {
   var IDItem=$(element).data('purchase-id');
   return IDItem;
}

var removeItemFromModel = function (element) {
    var itemID=getIDItem(element);
    for (var day in model) {
        for (var i=0; i<model[day].length; i++) {
            if (model[day][i]._id==itemID) {
               model[day].splice (i,1);
            }
            if (model[day].length<1){
                delete model[day];
                break;
            }
        }
    }
};

var removeViewItem = function(iconRemove) {
    var itemToRemove = $(iconRemove).closest('.pull-right').parent('div');
    var dayToRemove = itemToRemove.closest('.day-item');
    var quantityItems = dayToRemove.children('.table-column').children('.item').size();
    if (quantityItems>1){
    itemToRemove.remove();
    } else {
    dayToRemove.remove();
    }

    var date=$(iconRemove).data('id');
    var newTotal=calculateTotal(model[date]);
    dayToRemove.find('.total-column').html(newTotal);
};
//удаляет покупку и обновляет сумму или удаляет весь день (если покупка всего одна)

var deleteItem = function () {
    $('.icon-remove').click(function () {
        removeItemFromModel(this);
        removeViewItem(this);

        postDeletePurchase(getIDItem(this));
    });
};

var getItemById = function (itemID) {
    var item;
    for (var day in model) {
        for (var i=0; i<model[day].length; i++) {
            if (model[day][i]._id==itemID) {
                item=model[day][i];
            }
        }
    }
    return item;
}

var editItem = function () {
    $('.icon-pencil').click(function () {
        var itemID=getIDItem(this);
        var item=getItemById(itemID);
        var itemToEdit=$(this).closest('.item');
        var editForm=editInputTemplate(item);

        itemToEdit.after(editForm);
        itemToEdit.css ('display','none');

        $('.edit-item-form').submit(function(event){
            event.preventDefault();

            var newItem=getNewItemFromForm(this);
            item.name=newItem.name;
            item.price=newItem.price;
            item.tags=newItem.tags;

            var newTotal=calculateTotal(model[item.date]);

            itemToEdit.css ('display','inline');
            itemToEdit.html(buyTemplate(item));
            itemToEdit.parents('.day-item').children('.total-column').html(newTotal);

            console.log (model);
            this.remove();
        });

    })
}

var model={};

/**
 * Эта функция обновляет всю страницу
 * @param allData - это массив покупок
 */
var onUpdated = function (allData) {
    model=sortData(allData);

    //todo массив дней равен сортировке о индексу? Не очевидные названия
    var dayArray=sortedDateIndex(model);

    // todo кстати, наверное на стороне браузера нам вообще не нужно хранить модель как список покупок.
    // Нам важен только список, сгрупированный по дням. Если я ничего не забыл.

    initialRender(dayArray);
    dateSelect();

    // Стоит объеденить все создания слушателей событий в одну функцию
    deleteItem();
    console.log(dayArray);
};

/**
 * Эта функция запрашивает с сервера список покупок
 */
var update = function () {
    $.getJSON('/purchases', function (data) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var date = new Date(item.date);
            item.date = ((date.getDate()<10)?'0':'') + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        }
        console.log("This is a result from server: ", data);
        onUpdated(data);
    });
};
/**
 * Сохраняет покупку на сервере
 * @param data
 */
var postNewPurchase = function (data) {
    var dateParts = data.date.split('/');

    var date = new Date(dateParts[2], dateParts[1]-1, dateParts[0]);

    var purchase = {
        name: data.name,
        price: data.price,
        tags: data.tags,
        date: date
    };

    $.post('/purchase', purchase, function () {

    });
};

var postDeletePurchase = function (idItemToDelete) {
    $.ajax({
        url: '/purchase/' + idItemToDelete,
        type:'DELETE'
    });
};

$(document).ready (function (){
    update();
});


