define(["app"], function (app) {
    app.ng.controller("avFabMenuController", ["$scope", "Form", "$element", "Util", "$timeout", "$filter", function ($scope, Form, $element, Util, $timeout, $filter) {
        Form.getItem($scope, $element).then(function (item) {

            var resume = +item.properties.functionalButtonResume;
            var share = +item.properties.functionalButtonShare;
            var help = +item.properties.functionalButtonHelp;
            var close = +item.properties.functionalButtonClose;
            var buttonCount = resume + share + help + close;
            $scope.noOfMenuFuncs =  {
                1: "function-items-1",
                2: "function-items-2",
                3: "function-items-3",
                4: "function-items-4"
            }[buttonCount];
        });
    }]);
});