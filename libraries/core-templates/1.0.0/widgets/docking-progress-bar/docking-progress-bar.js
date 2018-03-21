define(["app"], function(app) {    
        app.ng.controller("DockingProgressBarController", ["$scope", "$element", "Form", "Resource", "Validation", "Util", "$timeout",
            function($scope, $element, Form, Resource, Validation, Util, $timeout) {    
              Form.getItem($scope, $element).then(function (item) {
				var data = $scope.data;
				$scope.$logo = $('.id-logo .av-image');
				$scope.$header = $('.id-formHeader');
				$scope.$banner = $element.find('.av-progress-bar-banner');
				$scope.$navContainer = $element.find('.av-docking-block');
				var progressBarHeight = Form.view.brands[Form.view.selectedBrand].styleVars['av-progressbar-height'];
				var dockPosition = Form.view.brands[Form.view.selectedBrand].styleVars['av-docking-point'];
				$scope.progressBarHeight = parseInt(progressBarHeight.substr(0, progressBarHeight.length-2));
				$scope.dp = parseInt(dockPosition.substr(0, dockPosition.length-2));
				$('.progress-bar-space').css({"height": ($scope.progressBarHeight + $scope.$header.outerHeight()) + "px"});
				$element.find('.av-form-heading-container').css({"top": -($scope.progressBarHeight + $scope.$header.outerHeight())/2 + "px"});
				$scope.$watch("data.scrollPosition", function(newValue, oldValue) {
                      var lw = $scope.$logo.width();
                      var hh = $scope.$header.outerHeight();
                      var sp = newValue;
                      var dp = $scope.dp;
                      var ds = (hh + $scope.progressBarHeight)/2 * (1 - sp/dp);
                      var relativeMargin = ($(window).width() * 0.01) + 36;
                      if(Form.$Pages.visiblePageCount > 1) {
                          $scope.$navContainer.css({"width": "calc(100% + " + (lw*(1 - Math.pow(sp/dp, 0.2)) - (sp/dp * relativeMargin)) + "px)"});
                          $scope.$navContainer.css({"top": ds + "px"});
                      }
                      $scope.$banner.css({"height": ($scope.progressBarHeight * (1 - sp/dp)) + "px"});
                  });
				data.scrollPosition = 0;
			  });
            }
        ]);
    });
