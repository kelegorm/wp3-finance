angular.module('myApp')
    .service('myModel', function () {
        var days = this.days = [
            new Day(new Date(2014, 2, 8), [
                {name:'Milk', price:10},
                {name:'Beef', price:20}
            ]),
            new Day(new Date(2014, 1, 1), [
                {name:'eggs', price:15},
                {name:'Lay`s', price:35}
            ])
        ];

        this.addPurchase = function (date, newPurchase) {
            var day = getDayByDate(date);
            if (day) {
                day.purchases.push(newPurchase);
            } else {
                day = new Day(date, [newPurchase]);
                this.addNewDay(day);
            }
        };

        this.addNewDay = function (day) {
            var dayIndex = 0;
            for (var i = 0; i < this.days.length; i++) {
                var date = this.days[i].date;
                if (day.date.getTime() < date.getTime()) {
                    dayIndex = i;
                    break;
                }
            }

            this.days.splice(dayIndex, 0, day);
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
    });