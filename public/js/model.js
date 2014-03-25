angular.module('myApp')
    .factory('myModel', function ($log, $rootScope) {
        var days = [
        ];

        var update = function () {
            $.getJSON('/purchases', function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var date = new Date(item.date);

                    $log.log(date, " ", item);
                    pushPurchase(date, item);
                }

                $rootScope.$broadcast('model.days.update');
            });
        };

        var addPurchase = function (date, newPurchase) {
            pushPurchase(date, newPurchase);
            postPurchase(date, newPurchase);
        };

        var addDay = function (date) {
            if (!getDayByDate(date)) {
                pushNewDay(new Day(date));
            }
        };

        var pushPurchase = function (date, newPurchase) {
            var day = getDayByDate(date);
            if (day) {
                day.purchases.push(newPurchase);
            } else {
                day = new Day(date, [newPurchase]);
                pushNewDay(day);
            }
        };

        var postPurchase = function (date, newPurchase) {
            var purchase = {
                name: newPurchase.name,
                price: newPurchase.price,
                tags: newPurchase.tags || [],
                date: date
            };

            $.post('/purchase', purchase, function () {
            });
        };

        var pushNewDay = function (day) {
            var dayIndex = 0;
            for (var i = 0; i < days.length; i++) {
                var date = days[i].date;
                if (day.date.getTime() < date.getTime()) {
                    dayIndex = i;
                    break;
                }
            }

            days.splice(dayIndex, 0, day);
        };

        var getDayByDate = function (date) {
            for (var i = 0; i < days.length; i++) {
                var day = days[i];
                if (daysIsSame(date, day.date)) {
                    return day;
                }
            }

            return null;
        };

        function Day (date, purchases) {
            this.date = date;
            this.purchases = (purchases)?purchases:[];

            this.getDate = function () {
                return getReadableDate(this.date);
            };

            this.getTotal = function () {
                var total = 0;
                for (var i=0; i< this.purchases.length; i++) {
                    total += this.purchases[i].price;

                }
                return total;
            };

            this.getToday = function () {
                return isToday(this.date);
            }
        }

        return {
            days: days,
            update: update,
            addPurchase: addPurchase,
            addDay: addDay
        };
    });