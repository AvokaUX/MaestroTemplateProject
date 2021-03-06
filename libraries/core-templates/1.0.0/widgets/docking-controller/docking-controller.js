define(["app"], function(app) {    
        app.ng.controller("DockingController", ["$scope", "$element", "Form", "Resource", "Validation", "Util", "$timeout",
            function($scope, $element, Form, Resource, Validation, Util, $timeout) {    
              Form.getItem($scope, $element).then(function (item) {
                  var data = $scope.data;
                  var dockPosition = Form.view.brands[Form.view.selectedBrand].styleVars['av-docking-point'];
                  dockPosition = parseInt(dockPosition.substr(0, dockPosition.length - 2));
                  if (dockPosition > 0) {
				    $(window).scroll(function (event) {
					  var st = $(this).scrollTop();
					  if (st > dockPosition) st = dockPosition;
					  $timeout(5).then(function () {
				  	    data.scrollPosition = st;
						data.docked = (st == dockPosition);
						data.undocked = (st == 0);
					  })
				    });
                  }
			  });
            }
        ]);
    });