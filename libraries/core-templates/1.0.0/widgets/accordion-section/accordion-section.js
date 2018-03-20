define(["app"], function (app) {
    app.ng.controller("avAccordionSectionController", ["$scope", "$q", "Form", "$rootScope", "Util", "Validation", "Resource", "$element", "$timeout", "$filter", "Scroll", function ($scope, $q, Form, $rootScope, Util, Validation, Resource, $element, $timeout, $filter, Scroll) {
        Form.getItem($scope, $element).then(function (item) {
            $scope.accordionIsValid = true;
            $scope.accordionOpen = false;
            var $thisAccordion = $element.find(".panel-collapse");
            var $allAccordions = $element.parent().parent().find(".panel-collapse");
            var allAccordionClosed = true;
            var firstAccordionId = $element.parent().parent().find('.panel-group')[0].id;
            var transDuration = 0.3;
            $scope.lastAccordion = item.id === $element.parent().parent().find('.panel-group')[$allAccordions.length - 1].id;
            function validateAccordion(errors) {
                $scope.validationErrors = errors;
                $scope.accordionIsValid = false;
            }

            function setAccordionHeadIcon(isOpen) {
                if (isOpen) {
                    $scope.accordionHeaderIcon = item.$$parent.properties.showLessIcon;
                } else {
                    $scope.accordionHeaderIcon = item.$$parent.properties.showMoreIcon;
                }
            }

            function animateSlideIn(noDelay) {
                var accordionTransition = "";
                var td = 0;
                var bodyHeight = $thisAccordion[0].offsetHeight;
                var closedOnes = $element.parent().parent().find(".panel-collapse.av-hidden").length;
                var someOpen = ($allAccordions.length - closedOnes) > 1;
                if (noDelay) {
                    accordionTransition = "all " + transDuration + "s" + " ease-in-out";
                    td = transDuration * 1000;
                } else {
                    accordionTransition = "all " + transDuration + "s" + " ease-in-out " + transDuration + "s";
                    td = 2 * transDuration * 1000;
                }
                $element.parent().css({
                    'margin-bottom': '-5px'
                });
                $thisAccordion.css({
                    "max-height": "0px",
                    "opacity": 0,
                    "overflow": "hidden"
                });

                $timeout(function () {
                    $thisAccordion.css({
                        "max-height": bodyHeight,
                        "opacity": 1,
                        "transition": accordionTransition
                    });
                    $timeout(function () {
                        $thisAccordion.css({
                            "max-height": "",
                            "opacity": "",
                            "overflow": "",
                            "transition": ""
                        });
                        $element.parent().css({
                            'margin-bottom': ''
                        });
                    }, td, false)
                        .then(function () {
                            var accPos = $element.parent().parent().find('#'+item.id).offset().top - $(window).scrollTop();
                            var windowHeight = window.innerHeight;
                            if(!item.$$parent.properties.allowMultipleOpen && someOpen && item.id !== firstAccordionId) {
                                if (accPos < 80 || accPos > windowHeight * 0.6) Scroll.scrollTo(80,false);
                            }
                            $scope.$apply();
                        });
                }, 25, false);
            }

            function animateSlideOut(noDelay) {
                var accordionTransition = "";
                var td = 0;
                var bodyHeight = $thisAccordion[0].offsetHeight;
                if (noDelay) {
                    accordionTransition = "all " + transDuration + "s" + " ease-in-out";
                    td = transDuration * 1000;
                } else {
                    accordionTransition = "all " + transDuration + "s" + " ease-in-out " + transDuration + "s";
                    td = 2 * transDuration * 1000;
                }
                $element.parent().css({
                    'margin-bottom': '-5px'
                });
                $thisAccordion.css({
                    "max-height": bodyHeight,
                    "opacity": 1,
                    "overflow": "hidden"
                });
                $timeout(function () {
                    $thisAccordion.css({
                        "max-height": "0px",
                        "opacity": 0,
                        "transition": accordionTransition
                    });
                    $timeout(function () {
                        $thisAccordion.css({
                            "max-height": "",
                            "opacity": "",
                            "overflow": "",
                            "transition": ""
                        });
                        $element.parent().css({
                            'margin-bottom': ''
                        });
                        $thisAccordion.addClass("av-hidden");
                        $scope.$apply();
                    }, td, false);
                }, 25, false);
            }

            if (!Util.isReceipt) {
                if (!item.properties.defaultCollapse) {
                    $thisAccordion.addClass("av-hidden");
                } else {
                    $scope.accordionOpen = true;
                }
                $element.find("input, textarea, select").focus(function () {
                        if ((!$scope.accordionOpen)) {
                            $scope.toggleCollapse();
                        }
                });
                setAccordionHeadIcon(!item.properties.defaultCollapse);
                $scope.$watch("accordionOpen", function (val) {
                    setAccordionHeadIcon(val);
                });
                $scope.$watch(
                    function () {
                        return $element.find('.err-msg').length;
                    },
                    function (errors) {
                        if (errors && errors > 0) validateAccordion(errors);
                        else $scope.accordionIsValid = true;
                    }
                );
                $scope.$watch(
                    function () {
                        return !$thisAccordion.hasClass("av-hidden");
                    },
                    function (hidden) {
                        $scope.accordionOpen = hidden;
                    }
                );

                $scope.$watch(
                    function () {
                        var ac = true;
                        for (var i = 0; i < $allAccordions.length; i++) {
                            if ($allAccordions[i].className.indexOf('av-hidden') === -1 ) {
                                ac = false;
                            }
                        }
                        return ac
                    },
                    function (allclosed) {
                        allAccordionClosed = allclosed;
                    }
                );

                $scope.$on("siblingOpening", function (evt, data) {
                    if (item.id !== data.id && $scope.accordionOpen) {
                        animateSlideOut(false);
                    }
                });
                $scope.$on("openThisOne", function (evt, data) {
                    if (item.id == data) {
                        $scope.toggleCollapse();
                    }
                });
                $scope.openNext = function () {
                    $scope.$emit('openNext', item.id);
                };

                $scope.toggleCollapse = function () {
                    if (!$scope.accordionOpen && !item.$$parent.properties.allowMultipleOpen) {
                        $scope.$emit("accordionOpening", item);
                    }
                    if ($scope.accordionOpen) {
                        animateSlideOut(true);
                    } else {
                        $timeout(function () {
                            $thisAccordion.removeClass("av-hidden");
                        },0).then(function () {
                            if(item.$$parent.properties.allowMultipleOpen) {
                                animateSlideIn(true);
                            }
                            else {
                                animateSlideIn(true);
                            }
                        });
                    }
                };
            } else {
                $element.find('.wdg-accordion-panel').css("border-style", "none");
                $element.find('.av-accordion-body').css({
                    "border-style": "none",
                    "padding-left": "0"
                });
                $element.find('.panel-heading').css("padding-left", "0");
                $element.find('.panel-collapse').css("margin-left", "0");
            }
        });
    }]);
});
