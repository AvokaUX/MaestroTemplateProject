define(["app"], function (app) {
    app.ng.controller("avMenuButtonController", ["$scope", "Form", "$element", "Util", "$timeout", "$filter", function ($scope, Form, $element, Util, $timeout, $filter) {
        Form.getItem($scope, $element).then(function (item) {
            var data = $scope.data;
            var children = Util.children(item.$$parent);
            data[children[0].id] = checkOnlyOneVisible() === "function-items-1";

            function checkOnlyOneVisible() {
                var resume = +item.$$parent.properties.functionalButtonResume;
                var share = +item.$$parent.properties.functionalButtonShare;
                var help = +item.$$parent.properties.functionalButtonHelp;
                var close = +item.$$parent.properties.functionalButtonClose;
                var buttonCount = resume + share + help + close;
                return {
                    0: "function-items-0",
                    1: "function-items-1",
                    2: "function-items-2",
                    3: "function-items-3",
                    4: "function-items-4"
                }[buttonCount]
            }

            var notOneButton = checkOnlyOneVisible() !== "function-items-1";
            $scope.showBackground = notOneButton && data[children[0].id];

            if (!notOneButton) $element.find('.id-' + children[0].id).hide();

            $scope.clickBackground = function () {
                Form.fireRule("click", children[0].id, data);
            };

            $scope.$watch(
                function () {
                    return data[children[0].id]
                },
                function (newValue) {
                    $scope.showBackground = notOneButton && newValue;
                });

            $scope.$watch(
                function () {
                    return $element.find('.id-' + children[1].id + ' button').length;
                },
                function (exit) {
                    if (exit) {
                        $element.find('.id-' + children[1].id + ' button').click(function () {
                            if (notOneButton) {
                                Form.fireRule("click", children[0].id, data);
                            }
                            Form.showDialog("cancelconfirm");
                        });
                    }

                });
            $scope.$watch(
                function () {
                    return $element.find('.id-' + children[2].id + ' button').length;
                },
                function (resume) {
                    if (resume) {
                        $element.find('.id-' + children[2].id + ' button').click(function () {

                            if (notOneButton) {
                                Form.fireRule("click", children[0].id, data);
                            }
                            Form.showDialog("savechallenge");
                        });
                    }
                });
            $scope.$watch(
                function () {
                    return $element.find('.id-' + children[3].id + ' button').length;
                },
                function (help) {
                    if (help) {
                        $element.find('.id-' + children[3].id + ' button').click(function () {

                            if (notOneButton) {
                                Form.fireRule("click", children[0].id, data);
                            }
                            Form.showDialog("formhelp");
                        });
                    }
                });
            $scope.$watch(
                function () {
                    return $element.find('.id-' + children[4].id + ' button').length;
                },
                function (share) {
                    if (share) {
                        $element.find('.id-' + children[4].id + ' button').click(function () {

                            if (notOneButton) {
                                Form.fireRule("click", children[0].id, data);
                            }
                            Form.showDialog("shareconfirm");
                        });
                    }
                });
            var clickAnywhereHandler = function (event) {
                if (!notOneButton) return;
                var inside = ($element[0] === event.target) ||
                    $(event.target).parents().index($element) !== -1;
                if (!inside) {
                    if(data[children[0].id]) {
                        data[children[0].id] = false;
                        $scope.$apply();
                    }
                }
            };
            $(document).on('click', clickAnywhereHandler);
            $scope.$on('$destroy', function () {
                $(document).off('click', clickAnywhereHandler);
            });
        });
    }]);
});