define(["app"], function (app) {
    app.ng.controller("ProgressBarController", ["$scope", "$element", "Form", "$timeout",
        function ($scope, $element, Form, $timeout) {
            Form.getItem($scope, $element).then(function (item) {
                /**
                 * ini page group property
                 */
                function iniGroupIconsPos() {
                    Form.$Pages.flatPages.forEach(function (p) {
                        p.isLastInGroup = false;
                        p.isFirstInGroup = false;
                    });
                }

                /**
                 * set page group property
                 */
                function setGroupIconsPos() {
                    if (Form.$Pages.groups.length) {
                        Form.$Pages.groups.forEach(function (group) {
                            if (group.$navPages.length) {
                                var keyOfLastPageInGroup = group.$navPages[group.$navPages.length - 1].$$hashKey;
                                var keyOfFirstPageInGroup = group.$navPages[0].$$hashKey;
                                if (Form.$Pages.flatPages.length) {
                                    Form.$Pages.flatPages.forEach(function (page) {
                                        if (page.$$hashKey === keyOfLastPageInGroup) {
                                            page.isLastInGroup = true;
                                        }
                                        if (page.$$hashKey === keyOfFirstPageInGroup) {
                                            page.isFirstInGroup = true;
                                        }
                                    })
                                }
                            }
                        });
                    }
                }
                $scope.$on('new tooltip pinning', function (evt, data) {
                    $scope.$broadcast('some pinning', data);
                });
                $scope.visiblePageFilter = function (p) {
                    return p.$navVisible && !p.properties.offMenu;
                };
                $timeout(function () {
                    iniGroupIconsPos();
                    setGroupIconsPos();
                }, 0)
            });
        }
    ]);

    app.ng.directive("avTooltip", ["$timeout", "Form", "$compile", function ($timeout, Form, $compile) {
        return {
            scope: {
                tooltipContent: "@avTooltip"
            },
            link: function (scope, $el, $attr) {
                Form.getItem(scope, $el).then(function (item) {
                    scope.tooltipClickedOn = false;

                    /**
                     * clean tooltip attached to the element
                     */
                    function cleanTooltip() {
                        if (!$el.find('.av-popover-help').length) return;
                        $el.find('.av-popover-help').removeClass('ready active');
                        $timeout(function () {
                            $el.find('.av-popover-help').remove();
                        }, 250);
                    }
                    function adjustTooltipPos() {
                        var viewWidth = $(window).innerWidth();
                        var spaceRequired = 0.5 * $el.find('.popover-tooltip').innerWidth();
                        var elementWidth = $el.innerWidth();
                        var availableWidthR = viewWidth - $el.offset().left - 0.5 * elementWidth;
                        var availableWidthL = 0.5 * elementWidth + $el.offset().left;
                        if (availableWidthR < spaceRequired) {
                            $el.find('.av-popover-help').css({
                                        'margin-left':  availableWidthR - spaceRequired + 'px'
                                    });
                            $el.find('.av-popover-help .arrow').css({
                                'margin-left':  spaceRequired - availableWidthR - 8 + 'px'
                            });
                        } else if (availableWidthL < spaceRequired) {
                            $el.find('.av-popover-help').css({
                                'margin-left': spaceRequired - availableWidthL + 'px'
                            });
                            $el.find('.av-popover-help .arrow').css({
                                'margin-left':  availableWidthL - spaceRequired - 8 + 'px'
                            });
                        }
                    }
                    /**
                     * remove tooltip when click anywhere else
                     * @param event
                     */
                    var clickAnywhereHandler = function (event) {
                        var inside = ($el[0] === event.target) ||
                            $(event.target).parents().index($el) !== -1;
                        if (!inside) {
                            scope.tooltipClickedOn = false;
                            cleanTooltip();
                        }
                    };
                    /**
                     * mouse over event handler - add tooltip
                     * @param e
                     */
                    var addTooltip = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if ($el.find('.popover-tooltip').length > 0) return;
                        var tooltipHtml = "<span class='av-popover-help'>";
                        tooltipHtml += "<div class='popover-tooltip' role='alert'>";
                        tooltipHtml += "<div class='arrow'></div>";
                        tooltipHtml += "<div class='content'>"
                            + scope.tooltipContent
                            + "</div></div>";
                        tooltipHtml += "</span>";
                        $el.append($compile(tooltipHtml)(scope));
                        $el.find('.av-popover-help').addClass('ready active');
                        adjustTooltipPos();
                    };
                    /**
                     * mouse leave event handler - remove tooltip
                     * @param e
                     */
                    var removeTooltip = function (e) {
                        e.stopPropagation();
                        if (scope.tooltipClickedOn) return;
                        cleanTooltip();
                    };
                    /**
                     * element click event handler - toggle tooltip on/off
                     * @param e
                     */
                    var toggleTooltip = function (e) {
                        scope.tooltipClickedOn = !scope.tooltipClickedOn;
                        if (scope.tooltipClickedOn) {
                            scope.$emit('new tooltip pinning', scope.tooltipContent);
                            addTooltip(e);
                        } else {
                            removeTooltip(e);
                        }
                    };
                    scope.$on('some pinning', function (evt,data) {
                        if(data !== scope.tooltipContent) {
                            scope.tooltipClickedOn = false;
                            cleanTooltip();
                        }
                    });

                    $el.on('click', toggleTooltip);
                    $el.on('mouseover', addTooltip);
                    $el.on('mouseleave', removeTooltip);
                    $(document).on('click', clickAnywhereHandler);
                    $(window).on('resize', cleanTooltip);
                });

                    scope.$on('$destroy', function () {
                        $(window).off('resize', cleanTooltip);
                        $(document).off('click', clickAnywhereHandler);
                        $el.off('click', toggleTooltip);
                        $el.off('mouseover', addTooltip);
                        $el.off('mouseleave', removeTooltip);
                    });

            }
        }
    }]);
});