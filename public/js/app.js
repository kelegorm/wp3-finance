angular.module('myApp', [])

    .run(function (myModel) {
        myModel.update();
    })

    .controller('navigationBarCtrl', function ($scope, myNavigation) {
        $scope.showPurchaseForm = function () {
            myNavigation.showPurchaseForm();
        };
    })

    .controller('dateSelectCtrl', function ($scope, $log, myModel) {
        $scope.dates = [];
        for (var i = 0; i < 7; i++) {
            var date = new Date();
            date.setDate(date.getDate() - i);
            $scope.dates.push(date);
        }

        $scope.selected = function (date) {
            return (daysIsSame(date, $scope.date))?'true':'false';
        };

        $scope.readableDate = getReadableDate;

        $scope.date_click = function (date) {
            myModel.addDay(date);
            $scope.setDate(date);
            //todo scroll to new day
        };
    })

    .controller('purchasePanelCtrl', function($scope, $log, myModel) {
        $scope.newPurchName = '';
        $scope.newPurchPrice = '';
        $scope.newPurchTags = '';

        $scope.date = new Date();

        $scope.setDate = function (date) {
            $scope.date = date;
        };

        $scope.addPurchase = function () {
            var date = $scope.date;
            var tags = $scope.newPurchTags.split(',');
            for (var i = 0; i < tags.length; i++) {
                tags[i] = $.trim(tags[i]);
            }
            var newPurchase = {date: date, name:$scope.newPurchName, price:$scope.newPurchPrice, tags:tags};

            myModel.addPurchase(newPurchase);

            $scope.newPurchName = '';
            $scope.newPurchPrice = '';
            $scope.newPurchTags = '';
        };

        $scope.hideForm = function() {
            $('.input-form').slideUp(300);
            $('body').stop(true, true).animate({paddingTop: '60px'},300);
            $('ul.date-list li').removeClass('selected');
        };

        $scope.showForm = function() {
            $('.input-form').addClass('navbar-fixed-top');
            $('.input-form').slideDown(300);
            $('body').animate({paddingTop: '250px'},300);
        };

        $scope.$on('purchase.form.show', function (event) {
            $scope.showForm();
        });
    })

    .controller('listCtrl', function ($scope, $log, myModel, myNavigation) {
        $scope.$on('model.days.update', function (event) {
            $scope.$apply(function (){});
            $log.log('days updated: ', $scope.days);
        });

        $scope.days = myModel.days;

        $scope.deletePurchase = function (purchase) {
            $log.log('purchasePanelCtrl::deletePurchase: ', purchase);
            myModel.deletePurchase(purchase);
        };

        $scope.showPurchaseForm = function () {
            myNavigation.showPurchaseForm();
        };
    });