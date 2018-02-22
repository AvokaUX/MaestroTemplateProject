define(["app"], function (app) {
	app.ng.controller("avAccordionController", ["$scope", "Form", "$rootScope", "Util", "Validation", "Resource", "$element", "$timeout", "$filter", function ($scope, Form, $rootScope, Util, Validation, Resource, $element, $timeout, $filter) {
		Form.getItem($scope, $element).then(function (item) {
			$scope.$on("accordionOpening", function(evt, data) {                
                $scope.$broadcast("siblingOpening", data);
            });
		});
	}]);
});
