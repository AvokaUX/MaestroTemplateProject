define(["app"], function(app) {    
        app.ng.controller("DockingProgressBarController", ["$scope", "$element", "Form", "Resource", "Validation", "Util", "$timeout",
            function($scope, $element, Form, Resource, Validation, Util, $timeout) {    
              Form.getItem($scope, $element).then(function (item) {
				var data = $scope.data;
				$scope.$logo = $('.id-logo .av-image');
				$scope.$header = $('.id-formHeader');
				$scope.$banner = $element.find('.av-progress-bar-banner');
				$scope.$navContainer = $element.find('.av-docking-block');
				$scope.$watch("data.scrollPosition", function(newValue, oldValue) {
				  var lw = $scope.$logo.width();
				  var hh = $scope.$header.outerHeight();
				  var sp = newValue;
				  var dp = Form.getItemProperty("data.dockingController","dockPosition");
				  var ds = (hh - 10) * (1 - sp/dp);
				  var relativeMargin = ($(window).width() * 0.01) + 36;
				  //$scope.$navContainer.css({"width": "calc(100% + " + (lw*(1 - Math.pow(sp/dp, 0.2)) - ((1 - ds/hh) * relativeMargin)) + "px)"});
				  $scope.$navContainer.css({"width": "calc(100% + " + (lw*(1 - Math.pow(sp/dp, 0.2)) - (sp/dp * relativeMargin)) + "px)"});
				  $scope.$navContainer.css({"top": ds + "px"});
				  $scope.$banner.css({"height": (hh - sp) + "px"});
				 });
				data.scrollPosition = 0;
			  });
            }
        ]);
    });
