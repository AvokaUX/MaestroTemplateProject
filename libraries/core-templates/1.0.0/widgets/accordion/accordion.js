define(["app"], function (app) {
	app.ng.controller("avAccordionController", ["$scope", "Form", "$rootScope", "Util", "Validation", "Resource", "$element", "$timeout", "$filter", function ($scope, Form, $rootScope, Util, Validation, Resource, $element, $timeout, $filter) {
		Form.getItem($scope, $element).then(function (item) {
            var children = Util.children(item);
            $scope.$on("accordionOpening", function(evt, data) {
                $scope.$broadcast("siblingOpening", data);
            });
            $scope.$on("openNext", function(evt, data) {
            	for (var i = 0; i < children.length; i++) {
            		if (data === children[i].id) {
                        $scope.$broadcast("openThisOne", children[i+1].id);
					}
				}
            });
		});
	}]);
});
