define(["app"], function (app) {
    app.ng.controller("avNavButtonsController", ["$scope", "Form", "$element", "Util", "$timeout", "$filter", function ($scope, Form, $element, Util, $timeout, $filter) {
        Form.getItem($scope, $element).then(function (item) {
            var data = $scope.data;
            data.blockNext = "";
            data.pageChangeAnimation = "";
        });
    }]);
});