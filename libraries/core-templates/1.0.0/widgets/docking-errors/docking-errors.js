define(["app"], function(app) {    
        app.ng.controller("DockingErrorsController", ["$scope", "$element", "Form", "Resource", "Validation", "Util", "$timeout",
            function($scope, $element, Form, Resource, Validation, Util, $timeout) {    
              Form.getItem($scope, $element).then(function (item) {
				var data = $scope.data;
				var dockPosition = Form.view.brands[Form.view.selectedBrand].styleVars['av-docking-point'];
				var progressBarHeight = Form.view.brands[Form.view.selectedBrand].styleVars['av-progressbar-height'];
				$scope.dp = parseInt(dockPosition.substr(0, dockPosition.length-2));
				$scope.pbh = parseInt(progressBarHeight.substr(0, progressBarHeight.length-2));
				$scope.$watch("data.scrollPosition", function(newValue, oldValue) {
					if (!data.errorsDockLock) {
                        data.dockErrors = (!($(".av-menu-errors:visible").length > 0) || !data.undocked);
                    }
                    $element.css({"top": $scope.pbh * (1 - newValue/$scope.dp) + "px"});
				 });
			  });
            }
        ]);
    });
