define(["app"], function (app) {
    app.ng.controller("avAccordionSectionController", ["$scope", "$q", "Form", "$rootScope", "Util", "Validation", "Resource", "$element", "$timeout", "$filter", "Scroll", function ($scope, $q, Form, $rootScope, Util, Validation, Resource, $element, $timeout, $filter, Scroll) {
        Form.getItem($scope, $element).then(function (item) {

            var $thisAccordion = $element.find(".panel-collapse");
            var $allAccordions = $element.parent().parent().find(".panel-collapse");
            var allAccordionClosed = true;
            var firstAccordionId = $scope.children[0].id;
            var transDuration = item.$$parent.properties.transitionDuration/1000;
            var focusedErrorId = "";
            var aboveAccordionId = "";
            var belowAccordionIndex = 0;
            item.properties.isDependant = false;//place holder
            $scope.accordionIsValid = true;
            $scope.lastAccordion = item.id === $scope.children[$scope.children.length - 1].id;

            if (Form.data[item.id] === 'close') {
                item.properties.defaultCollapse = false;
            }

            for ( var i = 1; i < $scope.children.length; i++) {
                if ( item.id === $scope.children[i].id ) aboveAccordionId = $scope.children[i-1].id;
            }
            for ( var i = 0; i < $scope.children.length - 1; i++) {
                if ( item.id === $scope.children[i].id ) belowAccordionIndex = i+1;
            }

            item.accordionIsOpen = $scope.accordionOpen = item.properties.defaultCollapse || Form.data[item.id] === "open";
            /**
             *
             * @param errors
             */
            function validateAccordion(errors) {
                $scope.validationErrors = errors;
                $scope.accordionIsValid = false;
            }

            /**
             *
             * @param isOpen
             */
            function setAccordionHeadIcon(isOpen) {
                if (isOpen) {
                    $scope.accordionHeaderIcon = item.$$parent.properties.showLessIcon;
                } else {
                    $scope.accordionHeaderIcon = item.$$parent.properties.showMoreIcon;
                }
            }

            /**
             *
             * @param noDelay
             */
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

            /**
             *
             * @param noDelay
             */
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

            /**
             * Open this accordion and let siblings know
             */
            var openThisAccordion = function () {
                $scope.$emit("accordionOpening", item);
                $timeout(function () {
                    $thisAccordion.removeClass("av-hidden");
                }, 0).then(function () {
                    animateSlideIn(true);
                });
            };
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
                        item.accordionIsOpen = $scope.accordionOpen = hidden;
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

                $scope.$watch(
                    function () {
                        return $allAccordions[belowAccordionIndex].className.indexOf('av-hidden') === -1;
                    },
                    function (belowIsOpen) {
                        $scope.nextAccordionIsOpen = belowIsOpen;
                    }
                );

                $scope.$on("siblingOpening", function (evt, data) {
                    if (item.id !== data.id && $scope.accordionOpen) {
                        animateSlideOut(true);
                    }
                });
                $scope.$on("openThisOne", function (evt, data) {
                    if (item.id == data && !$scope.accordionOpen) {
                        $scope.toggleCollapse();
                    }
                });
                $scope.$on("openAll", function (evt, data) {
                    if (!$scope.accordionOpen) {
                        openThisAccordion();
                    }
                });
                $scope.openNext = function () {
                    $scope.$emit('openNext', item.id);
                };

                $scope.toggleCollapse = function () {
                    if (!$scope.accordionOpen) {
                        if (!item.$$parent.properties.allowMultipleOpen) {
                            if (item.properties.isDependant && aboveAccordionId) {
                                Form.validate(aboveAccordionId).then(function (result) {
                                    if(result.valid) {
                                        openThisAccordion();
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                openThisAccordion();
                            }

                        } else {
                            openThisAccordion();
                        }

                    } else {
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
                    Form.data[item.id] = 'open';
                } else {
                    Form.data[item.id] = 'close';
                }
            })
        });
    }]);
});
