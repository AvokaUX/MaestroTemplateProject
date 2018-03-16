define(["app"], function (app) {
    app.ng.controller("avInterpageDialog", ["$scope", "Form", "$element", "Util", "$timeout", "$filter", function ($scope, Form, $element, Util, $timeout, $filter) {
        Form.getItem($scope, $element).then(function (item) {
            Form.view.dialogs[item.id].properties.interpage = true;
        });
    }]);
});