define(["app"], function (app) {
    app.ng.controller("avAccordionSectionController", ["$scope", "$q", "Form", "$rootScope", "Util", "Validation", "Resource", "$element", "$timeout", "$filter", "Scroll", function ($scope, $q, Form, $rootScope, Util, Validation, Resource, $element, $timeout, $filter, Scroll) {
        Form.getItem($scope, $element).then(function (item) {
            $scope.accordionIsValid = true;
            $scope.accordionOpen = item.properties.defaultCollapse || Form.data[item.id];
            var $thisAccordion = $element.find(".panel-collapse");
            var $allAccordions = $element.parent().parent().find(".panel-collapse");
            var allAccordionClosed = true;
            var firstAccordionId = $scope.children[0].id;
            var transDuration = item.$$parent.properties.transitionDuration/1000;
            var focusedErrorId = "";
            var aboveAccordionId = "";
            $scope.lastAccordion = item.id === $scope.children[$scope.children.length - 1].id;
            for ( var i = 1; i < $scope.children.length; i++) {
                if ( item.id === $scope.children[i].id ) aboveAccordionId = $scope.children[i-1].id;
            }

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
                var someOpen = ($scope.children.length - closedOnes) > 1;
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
                            if(!item.$$parent.properties.allowMultipleOpen && someOpen && item.id !== firstAccordionId) {
                                if (!focusedErrorId) {
                                    Scroll.scrollTo(firstAccordionId, false, 10);
                                } else {
                                    Scroll.scrollTo(focusedErrorId, false, 50)
                                        .then(function () {
                                            focusedErrorId = "";
                                        });
                                }
                            }
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

            if (!Util.isReceipt && !Resource.design) {
                if (!$scope.accordionOpen) {
                        $thisAccordion.addClass("av-hidden");
                    }
                $element.find("input, textarea, select").focus(function (e) {
                        if ((!$scope.accordionOpen)) {
                            focusedErrorId = e.currentTarget.id;
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
                        animateSlideOut(true);
                    }
                });
                $scope.$on("openThisOne", function (evt, data) {
                    if (item.id == data) {
                        $scope.toggleCollapse();
                    }
                });
                $scope.openNext = function () {
                    Form.validate(item).then(function (result) {
                        if(result.valid) {
                            $scope.$emit('openNext', item.id);
                        } else {
                            return;
                        }
                    });
                };

                $scope.toggleCollapse = function () {
                    if (!$scope.accordionOpen && !item.$$parent.properties.allowMultipleOpen) {
                        if (item.properties.isDependant && aboveAccordionId) {
                            Form.validate(aboveAccordionId).then(function (result) {
                                if(result.valid) {
                                    $scope.$emit("accordionOpening", item);
                                    $timeout(function () {
                                        $thisAccordion.removeClass("av-hidden");
                                    },0).then(function () {
                                        animateSlideIn(true);
                                    });
                                } else {
                                    return;
                                }
                            });
                        } else {
                            $scope.$emit("accordionOpening", item);
                            $timeout(function () {
                                $thisAccordion.removeClass("av-hidden");
                            },0).then(function () {
                                animateSlideIn(true);
                            });
                        }
                    }
                    if ($scope.accordionOpen) {
                        animateSlideOut(true);
                    }
                };
            }
            if (Util.isReceipt) {
                $element.find('.wdg-accordion-panel').css("border-style", "none");
                $element.find('.av-accordion-body').css({
                    "border-style": "none",
                    "padding-left": "0"
                });
                $element.find('.panel-heading').css("padding-left", "0");
                $element.find('.panel-collapse').css("margin-left", "0");
            }
            $scope.$on("$destroy", function () {
                if($scope.accordionOpen) {
                    Form.data[item.id] = true;
                } else {
                    Form.data[item.id] = false;
                }
            })
        });
    }]);
});
