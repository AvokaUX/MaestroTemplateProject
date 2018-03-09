define(["app"], function(app) {    
        app.ng.controller("DockingErrorsController", ["$scope", "$element", "Form", "Resource", "Validation", "Util", "$timeout",
            function($scope, $element, Form, Resource, Validation, Util, $timeout) {    
              Form.getItem($scope, $element).then(function (item) {
				var data = $scope.data;
				$scope.dp = Form.getItemProperty("data.dockingController","dockPosition");
				$scope.pbh = Form.getItemProperty("data.dockingProgressBar","progressBarHeight");
				$scope.$watch("data.scrollPosition", function(newValue, oldValue) {
					if (!data.errorsDockLock) {
                        data.dockErrors = (!($(".av-menu-errors:visible").length > 0) || !data.undocked);
                    }
					//$element.css({"top": item.properties.progressBarHeight * (1 - newValue/$scope.dp) + "px"});
                    $element.css({"top": $scope.pbh * (1 - newValue/$scope.dp) + "px"});
				 });
			  });
            }
        ]);
    });
