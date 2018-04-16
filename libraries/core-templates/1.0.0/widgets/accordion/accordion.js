define(["app"], function (app) {
	app.ng.controller("avAccordionController", ["$scope", "Form", "$rootScope", "Util", "Validation", "Resource", "$element", "$timeout", "$filter", function ($scope, Form, $rootScope, Util, Validation, Resource, $element, $timeout, $filter) {
		Form.getItem($scope, $element).then(function (item) {
			var originalAllowOpen = item.properties.allowMultipleOpen;
            $scope.children = Util.children(item);

            $scope.$on("accordionOpening", function(evt, data) {
            	if (!item.properties.allowMultipleOpen) {
                    $scope.$broadcast("siblingOpening", data);
            	}
            });
            $scope.$on("openNext", function(evt, data) {
            	for (var i = 0; i < $scope.children.length; i++) {
            		if (data === $scope.children[i].id) {
                        $scope.$broadcast("openThisOne", $scope.children[i+1].id);
					}
				}
            });
            $scope.openAll = function () {
                item.properties.allowMultipleOpen = true;
				$scope.$broadcast('openAll');
            };
            $scope.$watch(function () {
                var a = false;
                angular.forEach($scope.children, function (item) {
                    if (!item.accordionIsOpen) {
                        a = true;
                    }
                });
                return a;
            }, function (someClose) {
                $scope.someAccordionIsClosed = someClose;
                item.properties.allowMultipleOpen = originalAllowOpen;
            });
        });
	}]);
});
