angular.module('myApp')
    .factory('myModel', function ($log, $rootScope) {
        var days = [
        ];

        var update = function () {
            $.getJSON('/purchases', function (data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    item.date = new Date(item.date);

                    pushPurchase(item);
                }

                $rootScope.$broadcast('model.days.update');
            });
        };

        var addPurchase = function (newPurchase) {
//            pushPurchase(date, newPurchase);
            postPurchase(newPurchase, function (error, purchaseId) {
                if (!error) {
                    newPurchase._id = purchaseId;
                    pushPurchase(newPurchase);
                    $rootScope.$broadcast('model.days.update');
                }
            });
        };

        var addDay = function (date) {
            if (!getDayByDate(date)) {
                pushNewDay(new Day(date));
            }
        };

        var pushPurchase = function (newPurchase) {
            var day = getDayByDate(newPurchase.date);
            if (day) {
                day.purchases.push(newPurchase);
            } else {
                day = new Day(newPurchase.date, [newPurchase]);
                pushNewDay(day);
            }
        };

        var postPurchase = function (newPurchase, callback) {
            var purchase = {
                name: newPurchase.name,
                price: newPurchase.price,
                tags: newPurchase.tags || [],
                date: newPurchase.date
            };

            $.post('/purchase', purchase, function (docId) {
                callback(null, docId);
            });
        };

        var deletePurchase = function (purchase) {
            var purchaseId = purchase._id;

            $.ajax({
                url: '/purchase/' + purchaseId,
                type:'DELETE'
            })
                .done(function() {
                    var day = getDayByDate(purchase.date);
                    if (day) {
                        day.deletePurchase(purchase);
                    }

                    $rootScope.$broadcast('model.days.update');
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
            };

            this.deletePurchase = function (purchase) {
                var purchaseIndex = purchases.indexOf(purchase);
                if (purchaseIndex >= 0) {
                    purchases.splice(purchaseIndex, 1);
                }
            };
        }

        return {
            days: days,
            update: update,
            addPurchase: addPurchase,
            addDay: addDay,
            deletePurchase: deletePurchase
        };
    });