angular.module('myApp', [])

    .controller('navigationBarCtrl', function ($scope, myNavigation) {
        $scope.showPurchaseForm = function () {
            myNavigation.showPurchaseForm();
        };
    })

    .controller('purchasePanelCtrl', function($scope, myModel) {
        $scope.addPurchase = function () {
            var date = new Date();
            var newPurchase = {name:$scope.newPurchName, price:$scope.newPurchPrice};

            myModel.addPurchase(date, newPurchase);

            $scope.newPurchName = '';
            $scope.newPurchPrice = '';
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

    .controller('listCtrl', function ($scope, myModel, myNavigation) {
        $scope.days = myModel.days;

        $scope.showPurchaseForm = function () {
            myNavigation.showPurchaseForm();
        };
    });