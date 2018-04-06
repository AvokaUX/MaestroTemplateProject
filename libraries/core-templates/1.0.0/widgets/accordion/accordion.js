define(["app"], function (app) {
	app.ng.controller("avAccordionController", ["$scope", "Form", "$rootScope", "Util", "Validation", "Resource", "$element", "$timeout", "$filter", function ($scope, Form, $rootScope, Util, Validation, Resource, $element, $timeout, $filter) {
		Form.getItem($scope, $element).then(function (item) {
            $scope.children = Util.children(item);
            $scope.$on("accordionOpening", function(evt, data) {
                $scope.$broadcast("siblingOpening", data);
            });
            $scope.$on("openNext", function(evt, data) {
            	for (var i = 0; i < $scope.children.length; i++) {
            		if (data === $scope.children[i].id) {
                        $scope.$broadcast("openThisOne", $scope.children[i+1].id);
					}
				}
            });
		});
	}]);
});
