// create the controller and inject Angular's $scope
myapp.controller('inputController', function($scope, $http, $location) {

    //submit the login request
    $scope.submit = function() {

        var input = $scope.input;


        if (input) {
            $location.path("/result");
        }



    }

});