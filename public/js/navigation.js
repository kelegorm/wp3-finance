angular.module('myApp')

    .service('myNavigation', function ($rootScope) {
        this.showPurchaseForm = function () {
            $rootScope.$broadcast('purchase.form.show');
        };
    });