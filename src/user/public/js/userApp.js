var app = angular.module("userApp", ['ngResource']);

app.factory('loginService', ['$resource', function($resource) {
    return $resource('/rest/v1/login');
}]);

app.factory('registerService', ['$resource', function($resource) {
    return $resource('/rest/v1/register');
}]);


app.controller('loginCtl', ['$scope', 'loginService', function($scope, loginService) {
    $scope.login=function(){
        loginService.save($scope.loginForm, function(res){
            console.log(res.user);
        });
    }
}]);

app.controller('registerCtl', ['$scope', 'registerService', function($scope, loginService) {
    $scope.register=function(){
        loginService.save($scope.registerForm, function(res){
            console.log(res.user);
        });
    }
}]);



/*Directive to compare 2 feilds are same*/
app.directive('confirm-value', ['$scope', function ($scope) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.confirmValue) {
                console.error('confirmValue expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.confirmValue, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('confirmValue', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('confirmValue', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.confirmValue);
                model.$setValidity('confirmValue', isValid);
                return isValid ? value : undefined;
            });
        }
    };
}]);



