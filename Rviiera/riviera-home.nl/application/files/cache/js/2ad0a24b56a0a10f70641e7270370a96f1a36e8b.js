/* Dutch (UTF-8) initialisation for the jQuery UI date picker plugin. */
jQuery(function ($) {
    $.datepicker.regional['nl'] = {
        clearText: 'Wissen', clearStatus: 'Wis de huidige datum',
        closeText: 'Sluiten', closeStatus: 'Sluit zonder verandering',
        prevText: '&lt;Terug', prevStatus: 'Laat de voorgaande maand zien',
        nextText: 'Volgende&gt;', nextStatus: 'Laat de volgende maand zien',
        currentText: 'Vandaag', currentStatus: 'Laat de huidige maand zien',
        monthNames: ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
            'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun',
            'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        monthStatus: 'Laat een andere maand zien', yearStatus: 'Laat een ander jaar zien',
        weekHeader: 'Wk', weekStatus: 'Week van het jaar',
        dayNames: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
        dayNamesShort: ['Zon', 'Maa', 'Din', 'Woe', 'Don', 'Vri', 'Zat'],
        dayNamesMin: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
        dayStatus: 'DD', dateStatus: 'D, M d',
        dateFormat: 'dd.mm.yy', firstDay: 1,
        initStatus: 'Kies een datum', isRTL: false
    };
    $.datepicker.setDefaults($.datepicker.regional['nl']);
});

+function ($) {
    'use strict'; var Affix = function (element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options)
        this.$window = $(window).on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this)).on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))
        this.$element = $(element)
        this.affixed = this.unpin = this.pinnedOffset = null
        this.checkPosition()
    }
    Affix.RESET = 'affix affix-top affix-bottom'
    Affix.DEFAULTS = { offset: 0 }
    Affix.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset
        this.$element.removeClass(Affix.RESET).addClass('affix')
        var scrollTop = this.$window.scrollTop()
        var position = this.$element.offset()
        return (this.pinnedOffset = position.top - scrollTop)
    }
    Affix.prototype.checkPositionWithEventLoop = function () { setTimeout($.proxy(this.checkPosition, this), 1) }
    Affix.prototype.checkPosition = function () {
        if (!this.$element.is(':visible')) return
        var scrollHeight = $(document).height()
        var scrollTop = this.$window.scrollTop()
        var position = this.$element.offset()
        var offset = this.options.offset
        var offsetTop = offset.top
        var offsetBottom = offset.bottom
        if (this.affixed == 'top') position.top += scrollTop
        if (typeof offset != 'object') offsetBottom = offsetTop = offset
        if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
        if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)
        var affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ? false : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' : offsetTop != null && (scrollTop <= offsetTop) ? 'top' : false
        if (this.affixed === affix) return
        if (this.unpin) this.$element.css('top', '')
        var affixType = 'affix' + (affix ? '-' + affix : '')
        var e = $.Event(affixType + '.bs.affix')
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        this.affixed = affix
        this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null
        this.$element.removeClass(Affix.RESET).addClass(affixType).trigger($.Event(affixType.replace('affix', 'affixed')))
        if (affix == 'bottom') { this.$element.offset({ top: scrollHeight - offsetBottom - this.$element.height() }) }
    }
    var old = $.fn.affix
    $.fn.affix = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.affix')
            var options = typeof option == 'object' && option
            if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.affix.Constructor = Affix
    $.fn.affix.noConflict = function () {
        $.fn.affix = old
        return this
    }
    $(window).on('load', function () {
        $('[data-spy="affix"]').each(function () {
            var $spy = $(this)
            var data = $spy.data()
            data.offset = data.offset || {}
            if (data.offsetBottom) data.offset.bottom = data.offsetBottom
            if (data.offsetTop) data.offset.top = data.offsetTop
            $spy.affix(data)
        })
    })
}(jQuery);

+function ($) {
    'use strict'; var Carousel = function (element, options) {
        this.$element = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options = options
        this.paused = this.sliding = this.interval = this.$active = this.$items = null
        this.options.pause == 'hover' && this.$element.on('mouseenter', $.proxy(this.pause, this)).on('mouseleave', $.proxy(this.cycle, this))
    }
    Carousel.DEFAULTS = { interval: 5000, pause: 'hover', wrap: true }
    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)
        this.interval && clearInterval(this.interval)
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
        return this
    }
    Carousel.prototype.getActiveIndex = function () {
        this.$active = this.$element.find('.item.active')
        this.$items = this.$active.parent().children()
        return this.$items.index(this.$active)
    }
    Carousel.prototype.to = function (pos) {
        var that = this
        var activeIndex = this.getActiveIndex()
        if (pos > (this.$items.length - 1) || pos < 0) return
        if (this.sliding) return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
        if (activeIndex == pos) return this.pause().cycle()
        return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
    }
    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)
        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }
        this.interval = clearInterval(this.interval)
        return this
    }
    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }
    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }
    Carousel.prototype.slide = function (type, next) {
        var $active = this.$element.find('.item.active')
        var $next = next || $active[type]()
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var fallback = type == 'next' ? 'first' : 'last'
        var that = this
        if (!$next.length) {
            if (!this.options.wrap) return
            $next = this.$element.find('.item')[fallback]()
        }
        if ($next.hasClass('active')) return this.sliding = false
        var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        this.sliding = true
        isCycling && this.pause()
        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            this.$element.one('slid.bs.carousel', function () {
                var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
                $nextIndicator && $nextIndicator.addClass('active')
            })
        }
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth
            $active.addClass(direction)
            $next.addClass(direction)
            $active.one($.support.transition.end, function () {
                $next.removeClass([type, direction].join(' ')).addClass('active')
                $active.removeClass(['active', direction].join(' '))
                that.sliding = false
                setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
            }).emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger('slid.bs.carousel')
        }
        isCycling && this.cycle()
        return this
    }
    var old = $.fn.carousel
    $.fn.carousel = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action = typeof option == 'string' ? option : options.slide
            if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
    }
    $.fn.carousel.Constructor = Carousel
    $.fn.carousel.noConflict = function () {
        $.fn.carousel = old
        return this
    }
    $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
        var $this = $(this), href
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''))
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false
        $target.carousel(options)
        if (slideIndex = $this.attr('data-slide-to')) { $target.data('bs.carousel').to(slideIndex) }
        e.preventDefault()
    })
    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            $carousel.carousel($carousel.data())
        })
    })
}(jQuery);

+function ($) {
    'use strict'; var Collapse = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.transitioning = null
        if (this.options.parent) this.$parent = $(this.options.parent)
        if (this.options.toggle) this.toggle()
    }
    Collapse.DEFAULTS = { toggle: true }
    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }
    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return
        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return
        var actives = this.$parent && this.$parent.find('> .panel > .in')
        if (actives && actives.length) {
            var hasData = actives.data('bs.collapse')
            if (hasData && hasData.transitioning) return
            actives.collapse('hide')
            hasData || actives.data('bs.collapse', null)
        }
        var dimension = this.dimension()
        this.$element.removeClass('collapse').addClass('collapsing')
        [dimension](0)
        this.transitioning = 1
        var complete = function () {
            this.$element.removeClass('collapsing').addClass('collapse in')
            [dimension]('auto')
            this.transitioning = 0
            this.$element.trigger('shown.bs.collapse')
        }
        if (!$.support.transition) return complete.call(this)
        var scrollSize = $.camelCase(['scroll', dimension].join('-'))
        this.$element.one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350)
        [dimension](this.$element[0][scrollSize])
    }
    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return
        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return
        var dimension = this.dimension()
        this.$element
        [dimension](this.$element[dimension]())
        [0].offsetHeight
        this.$element.addClass('collapsing').removeClass('collapse').removeClass('in')
        this.transitioning = 1
        var complete = function () {
            this.transitioning = 0
            this.$element.trigger('hidden.bs.collapse').removeClass('collapsing').addClass('collapse')
        }
        if (!$.support.transition) return complete.call(this)
        this.$element
        [dimension](0).one($.support.transition.end, $.proxy(complete, this)).emulateTransitionEnd(350)
    }
    Collapse.prototype.toggle = function () { this[this.$element.hasClass('in') ? 'hide' : 'show']() }
    var old = $.fn.collapse
    $.fn.collapse = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data && options.toggle && option == 'show') option = !option
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.collapse.Constructor = Collapse
    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }
    $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
        var $this = $(this), href
        var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')
        var $target = $(target)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()
        var parent = $this.attr('data-parent')
        var $parent = parent && $(parent)
        if (!data || !data.transitioning) {
            if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
            $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
        }
        $target.collapse(option)
    })
}(jQuery);

+function ($) {
    'use strict'; var Modal = function (element, options) {
        this.options = options
        this.$element = $(element)
        this.$backdrop = this.isShown = null
        if (this.options.remote) { this.$element.find('.modal-content').load(this.options.remote, $.proxy(function () { this.$element.trigger('loaded.bs.modal') }, this)) }
    }
    Modal.DEFAULTS = { backdrop: true, keyboard: true, show: true }
    Modal.prototype.toggle = function (_relatedTarget) { return this[!this.isShown ? 'show' : 'hide'](_relatedTarget) }
    Modal.prototype.show = function (_relatedTarget) {
        var that = this
        var e = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })
        this.$element.trigger(e)
        if (this.isShown || e.isDefaultPrevented()) return
        this.isShown = true
        this.escape()
        this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
        this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')
            if (!that.$element.parent().length) { that.$element.appendTo(document.body) }
            that.$element.show().scrollTop(0)
            if (transition) { that.$element[0].offsetWidth }
            that.$element.addClass('in').attr('aria-hidden', false)
            that.enforceFocus()
            var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })
            transition ? that.$element.find('.modal-dialog').one($.support.transition.end, function () { that.$element.focus().trigger(e) }).emulateTransitionEnd(300) : that.$element.focus().trigger(e)
        })
    }
    Modal.prototype.hide = function (e) {
        if (e) e.preventDefault()
        e = $.Event('hide.bs.modal')
        this.$element.trigger(e)
        if (!this.isShown || e.isDefaultPrevented()) return
        this.isShown = false
        this.escape()
        $(document).off('focusin.bs.modal')
        this.$element.removeClass('in').attr('aria-hidden', true).off('click.dismiss.bs.modal')
        $.support.transition && this.$element.hasClass('fade') ? this.$element.one($.support.transition.end, $.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal()
    }
    Modal.prototype.enforceFocus = function () { $(document).off('focusin.bs.modal').on('focusin.bs.modal', $.proxy(function (e) { if (this.$element[0] !== e.target && !this.$element.has(e.target).length) { this.$element.focus() } }, this)) }
    Modal.prototype.escape = function () { if (this.isShown && this.options.keyboard) { this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) { e.which == 27 && this.hide() }, this)) } else if (!this.isShown) { this.$element.off('keyup.dismiss.bs.modal') } }
    Modal.prototype.hideModal = function () {
        var that = this
        this.$element.hide()
        this.backdrop(function () {
            that.removeBackdrop()
            that.$element.trigger('hidden.bs.modal')
        })
    }
    Modal.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove()
        this.$backdrop = null
    }
    Modal.prototype.backdrop = function (callback) {
        var animate = this.$element.hasClass('fade') ? 'fade' : ''
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate
            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(document.body)
            this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
                if (e.target !== e.currentTarget) return
                this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
            }, this))
            if (doAnimate) this.$backdrop[0].offsetWidth
            this.$backdrop.addClass('in')
            if (!callback) return
            doAnimate ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')
            $.support.transition && this.$element.hasClass('fade') ? this.$backdrop.one($.support.transition.end, callback).emulateTransitionEnd(150) : callback()
        } else if (callback) { callback() }
    }
    var old = $.fn.modal
    $.fn.modal = function (option, _relatedTarget) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.modal')
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
            if (typeof option == 'string') data[option](_relatedTarget)
            else if (options.show) data.show(_relatedTarget)
        })
    }
    $.fn.modal.Constructor = Modal
    $.fn.modal.noConflict = function () {
        $.fn.modal = old
        return this
    }
    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
        var $this = $(this)
        var href = $this.attr('href')
        var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')))
        var option = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())
        if ($this.is('a')) e.preventDefault()
        $target.modal(option, this).one('hide', function () { $this.is(':visible') && $this.focus() })
    })
    $(document).on('show.bs.modal', '.modal', function () { $(document.body).addClass('modal-open') }).on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })
}(jQuery);

+function ($) {
    'use strict'; var Tab = function (element) { this.element = $(element) }
    Tab.prototype.show = function () {
        var $this = this.element
        var $ul = $this.closest('ul:not(.dropdown-menu)')
        var selector = $this.data('target')
        if (!selector) {
            selector = $this.attr('href')
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '')
        }
        if ($this.parent('li').hasClass('active')) return
        var previous = $ul.find('.active:last a')[0]
        var e = $.Event('show.bs.tab', { relatedTarget: previous })
        $this.trigger(e)
        if (e.isDefaultPrevented()) return
        var $target = $(selector)
        this.activate($this.parent('li'), $ul)
        this.activate($target, $target.parent(), function () { $this.trigger({ type: 'shown.bs.tab', relatedTarget: previous }) })
    }
    Tab.prototype.activate = function (element, container, callback) {
        var $active = container.find('> .active')
        var transition = callback && $.support.transition && $active.hasClass('fade')
        function next() {
            $active.removeClass('active').find('> .dropdown-menu > .active').removeClass('active')
            element.addClass('active')
            if (transition) {
                element[0].offsetWidth
                element.addClass('in')
            } else { element.removeClass('fade') }
            if (element.parent('.dropdown-menu')) { element.closest('li.dropdown').addClass('active') }
            callback && callback()
        }
        transition ? $active.one($.support.transition.end, next).emulateTransitionEnd(150) : next()
        $active.removeClass('in')
    }
    var old = $.fn.tab
    $.fn.tab = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.tab')
            if (!data) $this.data('bs.tab', (data = new Tab(this)))
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.tab.Constructor = Tab
    $.fn.tab.noConflict = function () {
        $.fn.tab = old
        return this
    }
    $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
        e.preventDefault()
        $(this).tab('show')
    })
}(jQuery);

+function (a) { "use strict"; var b = function (a, b) { this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", a, b) }; b.DEFAULTS = { animation: !0, placement: "top", selector: !1, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover focus", title: "", delay: 0, html: !1, container: !1 }, b.prototype.init = function (b, c, d) { this.enabled = !0, this.type = b, this.$element = a(c), this.options = this.getOptions(d); for (var e = this.options.trigger.split(" "), f = e.length; f--;) { var g = e[f]; if ("click" == g) this.$element.on("click." + this.type, this.options.selector, a.proxy(this.toggle, this)); else if ("manual" != g) { var h = "hover" == g ? "mouseenter" : "focusin", i = "hover" == g ? "mouseleave" : "focusout"; this.$element.on(h + "." + this.type, this.options.selector, a.proxy(this.enter, this)), this.$element.on(i + "." + this.type, this.options.selector, a.proxy(this.leave, this)) } } this.options.selector ? this._options = a.extend({}, this.options, { trigger: "manual", selector: "" }) : this.fixTitle() }, b.prototype.getDefaults = function () { return b.DEFAULTS }, b.prototype.getOptions = function (b) { return b = a.extend({}, this.getDefaults(), this.$element.data(), b), b.delay && "number" == typeof b.delay && (b.delay = { show: b.delay, hide: b.delay }), b }, b.prototype.getDelegateOptions = function () { var b = {}, c = this.getDefaults(); return this._options && a.each(this._options, function (a, d) { c[a] != d && (b[a] = d) }), b }, b.prototype.enter = function (b) { var c = b instanceof this.constructor ? b : a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type); return clearTimeout(c.timeout), c.hoverState = "in", c.options.delay && c.options.delay.show ? void (c.timeout = setTimeout(function () { "in" == c.hoverState && c.show() }, c.options.delay.show)) : c.show() }, b.prototype.leave = function (b) { var c = b instanceof this.constructor ? b : a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type); return clearTimeout(c.timeout), c.hoverState = "out", c.options.delay && c.options.delay.hide ? void (c.timeout = setTimeout(function () { "out" == c.hoverState && c.hide() }, c.options.delay.hide)) : c.hide() }, b.prototype.show = function () { var b = a.Event("show.bs." + this.type); if (this.hasContent() && this.enabled) { if (this.$element.trigger(b), b.isDefaultPrevented()) return; var c = this, d = this.tip(); this.setContent(), this.options.animation && d.addClass("fade"); var e = "function" == typeof this.options.placement ? this.options.placement.call(this, d[0], this.$element[0]) : this.options.placement, f = /\s?auto?\s?/i, g = f.test(e); g && (e = e.replace(f, "") || "top"), d.detach().css({ top: 0, left: 0, display: "block" }).addClass(e), this.options.container ? d.appendTo(this.options.container) : d.insertAfter(this.$element); var h = this.getPosition(), i = d[0].offsetWidth, j = d[0].offsetHeight; if (g) { var k = this.$element.parent(), l = e, m = document.documentElement.scrollTop || document.body.scrollTop, n = "body" == this.options.container ? window.innerWidth : k.outerWidth(), o = "body" == this.options.container ? window.innerHeight : k.outerHeight(), p = "body" == this.options.container ? 0 : k.offset().left; e = "bottom" == e && h.top + h.height + j - m > o ? "top" : "top" == e && h.top - m - j < 0 ? "bottom" : "right" == e && h.right + i > n ? "left" : "left" == e && h.left - i < p ? "right" : e, d.removeClass(l).addClass(e) } var q = this.getCalculatedOffset(e, h, i, j); this.applyPlacement(q, e), this.hoverState = null; var r = function () { c.$element.trigger("shown.bs." + c.type) }; a.support.transition && this.$tip.hasClass("fade") ? d.one(a.support.transition.end, r).emulateTransitionEnd(150) : r() } }, b.prototype.applyPlacement = function (b, c) { var d, e = this.tip(), f = e[0].offsetWidth, g = e[0].offsetHeight, h = parseInt(e.css("margin-top"), 10), i = parseInt(e.css("margin-left"), 10); isNaN(h) && (h = 0), isNaN(i) && (i = 0), b.top = b.top + h, b.left = b.left + i, a.offset.setOffset(e[0], a.extend({ using: function (a) { e.css({ top: Math.round(a.top), left: Math.round(a.left) }) } }, b), 0), e.addClass("in"); var j = e[0].offsetWidth, k = e[0].offsetHeight; if ("top" == c && k != g && (d = !0, b.top = b.top + g - k), /bottom|top/.test(c)) { var l = 0; b.left < 0 && (l = -2 * b.left, b.left = 0, e.offset(b), j = e[0].offsetWidth, k = e[0].offsetHeight), this.replaceArrow(l - f + j, j, "left") } else this.replaceArrow(k - g, k, "top"); d && e.offset(b) }, b.prototype.replaceArrow = function (a, b, c) { this.arrow().css(c, a ? 50 * (1 - a / b) + "%" : "") }, b.prototype.setContent = function () { var a = this.tip(), b = this.getTitle(); a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b), a.removeClass("fade in top bottom left right") }, b.prototype.hide = function () { function b() { "in" != c.hoverState && d.detach(), c.$element.trigger("hidden.bs." + c.type) } var c = this, d = this.tip(), e = a.Event("hide.bs." + this.type); return this.$element.trigger(e), e.isDefaultPrevented() ? void 0 : (d.removeClass("in"), a.support.transition && this.$tip.hasClass("fade") ? d.one(a.support.transition.end, b).emulateTransitionEnd(150) : b(), this.hoverState = null, this) }, b.prototype.fixTitle = function () { var a = this.$element; (a.attr("title") || "string" != typeof a.attr("data-original-title")) && a.attr("data-original-title", a.attr("title") || "").attr("title", "") }, b.prototype.hasContent = function () { return this.getTitle() }, b.prototype.getPosition = function () { var b = this.$element[0]; return a.extend({}, "function" == typeof b.getBoundingClientRect ? b.getBoundingClientRect() : { width: b.offsetWidth, height: b.offsetHeight }, this.$element.offset()) }, b.prototype.getCalculatedOffset = function (a, b, c, d) { return "bottom" == a ? { top: b.top + b.height, left: b.left + b.width / 2 - c / 2 } : "top" == a ? { top: b.top - d, left: b.left + b.width / 2 - c / 2 } : "left" == a ? { top: b.top + b.height / 2 - d / 2, left: b.left - c } : { top: b.top + b.height / 2 - d / 2, left: b.left + b.width } }, b.prototype.getTitle = function () { var a, b = this.$element, c = this.options; return a = b.attr("data-original-title") || ("function" == typeof c.title ? c.title.call(b[0]) : c.title) }, b.prototype.tip = function () { return this.$tip = this.$tip || a(this.options.template) }, b.prototype.arrow = function () { return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow") }, b.prototype.validate = function () { this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null) }, b.prototype.enable = function () { this.enabled = !0 }, b.prototype.disable = function () { this.enabled = !1 }, b.prototype.toggleEnabled = function () { this.enabled = !this.enabled }, b.prototype.toggle = function (b) { var c = b ? a(b.currentTarget)[this.type](this.getDelegateOptions()).data("bs." + this.type) : this; c.tip().hasClass("in") ? c.leave(c) : c.enter(c) }, b.prototype.destroy = function () { clearTimeout(this.timeout), this.hide().$element.off("." + this.type).removeData("bs." + this.type) }; var c = a.fn.tooltip; a.fn.tooltip = function (c) { return this.each(function () { var d = a(this), e = d.data("bs.tooltip"), f = "object" == typeof c && c; (e || "destroy" != c) && (e || d.data("bs.tooltip", e = new b(this, f)), "string" == typeof c && e[c]()) }) }, a.fn.tooltip.Constructor = b, a.fn.tooltip.noConflict = function () { return a.fn.tooltip = c, this } }(jQuery);

+function (a) { "use strict"; var b = function (a, b) { this.init("popover", a, b) }; if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js"); b.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, { placement: "right", trigger: "click", content: "", template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>' }), b.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype), b.prototype.constructor = b, b.prototype.getDefaults = function () { return b.DEFAULTS }, b.prototype.setContent = function () { var a = this.tip(), b = this.getTitle(), c = this.getContent(); a.find(".popover-title")[this.options.html ? "html" : "text"](b), a.find(".popover-content")[this.options.html ? "string" == typeof c ? "html" : "append" : "text"](c), a.removeClass("fade top bottom left right in"), a.find(".popover-title").html() || a.find(".popover-title").hide() }, b.prototype.hasContent = function () { return this.getTitle() || this.getContent() }, b.prototype.getContent = function () { var a = this.$element, b = this.options; return a.attr("data-content") || ("function" == typeof b.content ? b.content.call(a[0]) : b.content) }, b.prototype.arrow = function () { return this.$arrow = this.$arrow || this.tip().find(".arrow") }, b.prototype.tip = function () { return this.$tip || (this.$tip = a(this.options.template)), this.$tip }; var c = a.fn.popover; a.fn.popover = function (c) { return this.each(function () { var d = a(this), e = d.data("bs.popover"), f = "object" == typeof c && c; (e || "destroy" != c) && (e || d.data("bs.popover", e = new b(this, f)), "string" == typeof c && e[c]()) }) }, a.fn.popover.Constructor = b, a.fn.popover.noConflict = function () { return a.fn.popover = c, this } }(jQuery);

+function ($) {
    'use strict'; function ScrollSpy(element, options) {
        var href
        var process = $.proxy(this.process, this)
        this.$element = $(element).is('body') ? $(window) : $(element)
        this.$body = $('body')
        this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
        this.selector = (this.options.target || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) || '') + ' .nav li > a'
        this.offsets = $([])
        this.targets = $([])
        this.activeTarget = null
        this.refresh()
        this.process()
    }
    ScrollSpy.DEFAULTS = { offset: 10 }
    ScrollSpy.prototype.refresh = function () {
        var offsetMethod = this.$element[0] == window ? 'offset' : 'position'
        this.offsets = $([])
        this.targets = $([])
        var self = this
        var $targets = this.$body.find(this.selector).map(function () {
            var $el = $(this)
            var href = $el.data('target') || $el.attr('href')
            var $href = /^#./.test(href) && $(href)
            return ($href && $href.length && $href.is(':visible') && [[$href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href]]) || null
        }).sort(function (a, b) { return a[0] - b[0] }).each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
        })
    }
    ScrollSpy.prototype.process = function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
        var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
        var maxScroll = scrollHeight - this.$scrollElement.height()
        var offsets = this.offsets
        var targets = this.targets
        var activeTarget = this.activeTarget
        var i
        if (scrollTop >= maxScroll) { return activeTarget != (i = targets.last()[0]) && this.activate(i) }
        if (activeTarget && scrollTop <= offsets[0]) { return activeTarget != (i = targets[0]) && this.activate(i) }
        for (i = offsets.length; i--;) { activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i]) }
    }
    ScrollSpy.prototype.activate = function (target) {
        this.activeTarget = target
        $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active')
        var selector = this.selector + '[data-target="' + target + '"],' +
            this.selector + '[href="' + target + '"]'
        var active = $(selector).parents('li').addClass('active')
        if (active.parent('.dropdown-menu').length) { active = active.closest('li.dropdown').addClass('active') }
        active.trigger('activate.bs.scrollspy')
    }
    var old = $.fn.scrollspy
    $.fn.scrollspy = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.scrollspy')
            var options = typeof option == 'object' && option
            if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }
    $.fn.scrollspy.Constructor = ScrollSpy
    $.fn.scrollspy.noConflict = function () {
        $.fn.scrollspy = old
        return this
    }
    $(window).on('load', function () {
        $('[data-spy="scroll"]').each(function () {
            var $spy = $(this)
            $spy.scrollspy($spy.data())
        })
    })
}(jQuery);

+function (a) { "use strict"; function b(b) { a(d).remove(), a(e).each(function () { var d = c(a(this)), e = { relatedTarget: this }; d.hasClass("open") && (d.trigger(b = a.Event("hide.bs.dropdown", e)), b.isDefaultPrevented() || d.removeClass("open").trigger("hidden.bs.dropdown", e)) }) } function c(b) { var c = b.attr("data-target"); c || (c = b.attr("href"), c = c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, "")); var d = c && a(c); return d && d.length ? d : b.parent() } var d = ".dropdown-backdrop", e = "[data-toggle=dropdown]", f = function (b) { a(b).on("click.bs.dropdown", this.toggle) }; f.prototype.toggle = function (d) { var e = a(this); if (!e.is(".disabled, :disabled")) { var f = c(e), g = f.hasClass("open"); if (b(), !g) { "ontouchstart" in document.documentElement && !f.closest(".navbar-nav").length && a('<div class="dropdown-backdrop"/>').insertAfter(a(this)).on("click", b); var h = { relatedTarget: this }; if (f.trigger(d = a.Event("show.bs.dropdown", h)), d.isDefaultPrevented()) return; f.toggleClass("open").trigger("shown.bs.dropdown", h), e.focus() } return !1 } }, f.prototype.keydown = function (b) { if (/(38|40|27)/.test(b.keyCode)) { var d = a(this); if (b.preventDefault(), b.stopPropagation(), !d.is(".disabled, :disabled")) { var f = c(d), g = f.hasClass("open"); if (!g || g && 27 == b.keyCode) return 27 == b.which && f.find(e).focus(), d.click(); var h = " li:not(.divider):visible a", i = f.find("[role=menu]" + h + ", [role=listbox]" + h); if (i.length) { var j = i.index(i.filter(":focus")); 38 == b.keyCode && j > 0 && j--, 40 == b.keyCode && j < i.length - 1 && j++, ~j || (j = 0), i.eq(j).focus() } } } }; var g = a.fn.dropdown; a.fn.dropdown = function (b) { return this.each(function () { var c = a(this), d = c.data("bs.dropdown"); d || c.data("bs.dropdown", d = new f(this)), "string" == typeof b && d[b].call(c) }) }, a.fn.dropdown.Constructor = f, a.fn.dropdown.noConflict = function () { return a.fn.dropdown = g, this }, a(document).on("click.bs.dropdown.data-api", b).on("click.bs.dropdown.data-api", ".dropdown form", function (a) { a.stopPropagation() }).on("click.bs.dropdown.data-api", e, f.prototype.toggle).on("keydown.bs.dropdown.data-api", e + ", [role=menu], [role=listbox]", f.prototype.keydown) }(jQuery);

+function (a) { "use strict"; var b = '[data-dismiss="alert"]', c = function (c) { a(c).on("click", b, this.close) }; c.prototype.close = function (b) { function c() { f.trigger("closed.bs.alert").remove() } var d = a(this), e = d.attr("data-target"); e || (e = d.attr("href"), e = e && e.replace(/.*(?=#[^\s]*$)/, "")); var f = a(e); b && b.preventDefault(), f.length || (f = d.hasClass("alert") ? d : d.parent()), f.trigger(b = a.Event("close.bs.alert")), b.isDefaultPrevented() || (f.removeClass("in"), a.support.transition && f.hasClass("fade") ? f.one(a.support.transition.end, c).emulateTransitionEnd(150) : c()) }; var d = a.fn.alert; a.fn.alert = function (b) { return this.each(function () { var d = a(this), e = d.data("bs.alert"); e || d.data("bs.alert", e = new c(this)), "string" == typeof b && e[b].call(d) }) }, a.fn.alert.Constructor = c, a.fn.alert.noConflict = function () { return a.fn.alert = d, this }, a(document).on("click.bs.alert.data-api", b, c.prototype.close) }(jQuery);

+function (a) { "use strict"; var b = function (c, d) { this.$element = a(c), this.options = a.extend({}, b.DEFAULTS, d), this.isLoading = !1 }; b.DEFAULTS = { loadingText: "loading..." }, b.prototype.setState = function (b) { var c = "disabled", d = this.$element, e = d.is("input") ? "val" : "html", f = d.data(); b += "Text", f.resetText || d.data("resetText", d[e]()), d[e](f[b] || this.options[b]), setTimeout(a.proxy(function () { "loadingText" == b ? (this.isLoading = !0, d.addClass(c).attr(c, c)) : this.isLoading && (this.isLoading = !1, d.removeClass(c).removeAttr(c)) }, this), 0) }, b.prototype.toggle = function () { var a = !0, b = this.$element.closest('[data-toggle="buttons"]'); if (b.length) { var c = this.$element.find("input"); "radio" == c.prop("type") && (c.prop("checked") && this.$element.hasClass("active") ? a = !1 : b.find(".active").removeClass("active")), a && c.prop("checked", !this.$element.hasClass("active")).trigger("change") } a && this.$element.toggleClass("active") }; var c = a.fn.button; a.fn.button = function (c) { return this.each(function () { var d = a(this), e = d.data("bs.button"), f = "object" == typeof c && c; e || d.data("bs.button", e = new b(this, f)), "toggle" == c ? e.toggle() : c && e.setState(c) }) }, a.fn.button.Constructor = b, a.fn.button.noConflict = function () { return a.fn.button = c, this }, a(document).on("click.bs.button.data-api", "[data-toggle^=button]", function (b) { var c = a(b.target); c.hasClass("btn") || (c = c.closest(".btn")), c.button("toggle"), b.preventDefault() }) }(jQuery);

+function (a) { "use strict"; function b() { var a = document.createElement("bootstrap"), b = { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd otransitionend", transition: "transitionend" }; for (var c in b) if (void 0 !== a.style[c]) return { end: b[c] }; return !1 } a.fn.emulateTransitionEnd = function (b) { var c = !1, d = this; a(this).one(a.support.transition.end, function () { c = !0 }); var e = function () { c || a(d).trigger(a.support.transition.end) }; return setTimeout(e, b), this }, a(function () { a.support.transition = b() }) }(jQuery);

+function ($) {
    "use strict"; var isIE = window.navigator.appName == 'Microsoft Internet Explorer'
    var Fileinput = function (element, options) {
        this.$element = $(element)
        this.$input = this.$element.find(':file')
        if (this.$input.length === 0) return
        this.name = this.$input.attr('name') || options.name
        this.$hidden = this.$element.find('input[type=hidden][name="' + this.name + '"]')
        if (this.$hidden.length === 0) { this.$hidden = $('<input type="hidden">').insertBefore(this.$input) }
        this.$preview = this.$element.find('.fileinput-preview')
        var height = this.$preview.css('height')
        if (this.$preview.css('display') !== 'inline' && height !== '0px' && height !== 'none') { this.$preview.css('line-height', height) }
        this.original = { exists: this.$element.hasClass('fileinput-exists'), preview: this.$preview.html(), hiddenVal: this.$hidden.val() }
        this.listen()
    }
    Fileinput.prototype.listen = function () {
        this.$input.on('change.bs.fileinput', $.proxy(this.change, this))
        $(this.$input[0].form).on('reset.bs.fileinput', $.proxy(this.reset, this))
        this.$element.find('[data-trigger="fileinput"]').on('click.bs.fileinput', $.proxy(this.trigger, this))
        this.$element.find('[data-dismiss="fileinput"]').on('click.bs.fileinput', $.proxy(this.clear, this))
    }, Fileinput.prototype.change = function (e) {
        var files = e.target.files === undefined ? (e.target && e.target.value ? [{ name: e.target.value.replace(/^.+\\/, '') }] : []) : e.target.files
        e.stopPropagation()
        if (files.length === 0) {
            this.clear()
            return
        }
        this.$hidden.val('')
        this.$hidden.attr('name', '')
        this.$input.attr('name', this.name)
        var file = files[0]
        if (this.$preview.length > 0 && (typeof file.type !== "undefined" ? file.type.match(/^image\/(gif|png|jpeg)$/) : file.name.match(/\.(gif|png|jpe?g)$/i)) && typeof FileReader !== "undefined") {
            var reader = new FileReader()
            var preview = this.$preview
            var element = this.$element
            reader.onload = function (re) {
                var $img = $('<img>')
                $img[0].src = re.target.result
                files[0].result = re.target.result
                element.find('.fileinput-filename').text(file.name)
                if (preview.css('max-height') != 'none') $img.css('max-height', parseInt(preview.css('max-height'), 10) - parseInt(preview.css('padding-top'), 10) - parseInt(preview.css('padding-bottom'), 10) - parseInt(preview.css('border-top'), 10) - parseInt(preview.css('border-bottom'), 10))
                preview.html($img)
                element.addClass('fileinput-exists').removeClass('fileinput-new')
                element.trigger('change.bs.fileinput', files)
            }
            reader.readAsDataURL(file)
        } else {
            this.$element.find('.fileinput-filename').text(file.name)
            this.$preview.text(file.name)
            this.$element.addClass('fileinput-exists').removeClass('fileinput-new')
            this.$element.trigger('change.bs.fileinput')
        }
    }, Fileinput.prototype.clear = function (e) {
        if (e) e.preventDefault()
        this.$hidden.val('')
        this.$hidden.attr('name', this.name)
        this.$input.attr('name', '')
        if (isIE) { var inputClone = this.$input.clone(true); this.$input.after(inputClone); this.$input.remove(); this.$input = inputClone; } else { this.$input.val('') }
        this.$preview.html('')
        this.$element.find('.fileinput-filename').text('')
        this.$element.addClass('fileinput-new').removeClass('fileinput-exists')
        if (e !== undefined) {
            this.$input.trigger('change')
            this.$element.trigger('clear.bs.fileinput')
        }
    }, Fileinput.prototype.reset = function () {
        this.clear()
        this.$hidden.val(this.original.hiddenVal)
        this.$preview.html(this.original.preview)
        this.$element.find('.fileinput-filename').text('')
        if (this.original.exists) this.$element.addClass('fileinput-exists').removeClass('fileinput-new')
        else this.$element.addClass('fileinput-new').removeClass('fileinput-exists')
        this.$element.trigger('reset.bs.fileinput')
    }, Fileinput.prototype.trigger = function (e) {
        this.$input.trigger('click')
        e.preventDefault()
    }
    var old = $.fn.fileinput
    $.fn.fileinput = function (options) {
        return this.each(function () {
            var $this = $(this), data = $this.data('bs.fileinput')
            if (!data) $this.data('bs.fileinput', (data = new Fileinput(this, options)))
            if (typeof options == 'string') data[options]()
        })
    }
    $.fn.fileinput.Constructor = Fileinput
    $.fn.fileinput.noConflict = function () {
        $.fn.fileinput = old
        return this
    }
    $(document).on('click.fileinput.data-api', '[data-provides="fileinput"]', function (e) {
        var $this = $(this)
        if ($this.data('bs.fileinput')) return
        $this.fileinput($this.data())
        var $target = $(e.target).closest('[data-dismiss="fileinput"],[data-trigger="fileinput"]'); if ($target.length > 0) {
            e.preventDefault()
            $target.trigger('click.bs.fileinput')
        }
    })
}(window.jQuery);

+function ($) {
    "use strict"; var isIphone = (window.orientation !== undefined)
    var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1
    var isIE = window.navigator.appName == 'Microsoft Internet Explorer'
    var Inputmask = function (element, options) {
        if (isAndroid) return
        this.$element = $(element)
        this.options = $.extend({}, Inputmask.DEFAULTS, options)
        this.mask = String(this.options.mask)
        this.init()
        this.listen()
        this.checkVal()
    }
    Inputmask.DEFAULTS = { mask: "", placeholder: "_", definitions: { '9': "[0-9]", 'a': "[A-Za-z]", 'w': "[A-Za-z0-9]", '*': "." } }
    Inputmask.prototype.init = function () {
        var defs = this.options.definitions
        var len = this.mask.length
        this.tests = []
        this.partialPosition = this.mask.length
        this.firstNonMaskPos = null
        $.each(this.mask.split(""), $.proxy(function (i, c) {
            if (c == '?') {
                len--
                this.partialPosition = i
            } else if (defs[c]) {
                this.tests.push(new RegExp(defs[c]))
                if (this.firstNonMaskPos === null)
                    this.firstNonMaskPos = this.tests.length - 1
            } else { this.tests.push(null) }
        }, this))
        this.buffer = $.map(this.mask.split(""), $.proxy(function (c, i) { if (c != '?') return defs[c] ? this.options.placeholder : c }, this))
        this.focusText = this.$element.val()
        this.$element.data("rawMaskFn", $.proxy(function () { return $.map(this.buffer, function (c, i) { return this.tests[i] && c != this.options.placeholder ? c : null }).join('') }, this))
    }
    Inputmask.prototype.listen = function () {
        if (this.$element.attr("readonly")) return
        var pasteEventName = (isIE ? 'paste' : 'input') + ".mask"
        this.$element.on("unmask.bs.inputmask", $.proxy(this.unmask, this)).on("focus.bs.inputmask", $.proxy(this.focusEvent, this)).on("blur.bs.inputmask", $.proxy(this.blurEvent, this)).on("keydown.bs.inputmask", $.proxy(this.keydownEvent, this)).on("keypress.bs.inputmask", $.proxy(this.keypressEvent, this)).on(pasteEventName, $.proxy(this.pasteEvent, this))
    }
    Inputmask.prototype.caret = function (begin, end) {
        if (this.$element.length === 0) return
        if (typeof begin == 'number') {
            end = (typeof end == 'number') ? end : begin
            return this.$element.each(function () {
                if (this.setSelectionRange) { this.setSelectionRange(begin, end) } else if (this.createTextRange) {
                    var range = this.createTextRange()
                    range.collapse(true)
                    range.moveEnd('character', end)
                    range.moveStart('character', begin)
                    range.select()
                }
            })
        } else {
            if (this.$element[0].setSelectionRange) {
                begin = this.$element[0].selectionStart
                end = this.$element[0].selectionEnd
            } else if (document.selection && document.selection.createRange) {
                var range = document.selection.createRange()
                begin = 0 - range.duplicate().moveStart('character', -100000)
                end = begin + range.text.length
            }
            return { begin: begin, end: end }
        }
    }
    Inputmask.prototype.seekNext = function (pos) {
        var len = this.mask.length
        while (++pos <= len && !this.tests[pos]); return pos
    }
    Inputmask.prototype.seekPrev = function (pos) { while (--pos >= 0 && !this.tests[pos]); return pos }
    Inputmask.prototype.shiftL = function (begin, end) {
        var len = this.mask.length
        if (begin < 0) return
        for (var i = begin, j = this.seekNext(end); i < len; i++) {
            if (this.tests[i]) {
                if (j < len && this.tests[i].test(this.buffer[j])) {
                    this.buffer[i] = this.buffer[j]
                    this.buffer[j] = this.options.placeholder
                } else
                    break
                j = this.seekNext(j)
            }
        }
        this.writeBuffer()
        this.caret(Math.max(this.firstNonMaskPos, begin))
    }
    Inputmask.prototype.shiftR = function (pos) {
        var len = this.mask.length
        for (var i = pos, c = this.options.placeholder; i < len; i++) {
            if (this.tests[i]) {
                var j = this.seekNext(i)
                var t = this.buffer[i]
                this.buffer[i] = c
                if (j < len && this.tests[j].test(t))
                    c = t
                else
                    break
            }
        }
    }, Inputmask.prototype.unmask = function () { this.$element.unbind(".mask").removeData("inputmask") }
    Inputmask.prototype.focusEvent = function () {
        this.focusText = this.$element.val()
        var len = this.mask.length
        var pos = this.checkVal()
        this.writeBuffer()
        var that = this
        var moveCaret = function () {
            if (pos == len)
                that.caret(0, pos)
            else
                that.caret(pos)
        }
        moveCaret()
        setTimeout(moveCaret, 50)
    }
    Inputmask.prototype.blurEvent = function () {
        this.checkVal()
        if (this.$element.val() !== this.focusText)
            this.$element.trigger('change')
    }
    Inputmask.prototype.keydownEvent = function (e) {
        var k = e.which
        if (k == 8 || k == 46 || (isIphone && k == 127)) {
            var pos = this.caret(), begin = pos.begin, end = pos.end
            if (end - begin === 0) {
                begin = k != 46 ? this.seekPrev(begin) : (end = this.seekNext(begin - 1))
                end = k == 46 ? this.seekNext(end) : end
            }
            this.clearBuffer(begin, end)
            this.shiftL(begin, end - 1)
            return false
        } else if (k == 27) {
            this.$element.val(this.focusText)
            this.caret(0, this.checkVal())
            return false
        }
    }
    Inputmask.prototype.keypressEvent = function (e) {
        var len = this.mask.length
        var k = e.which, pos = this.caret()
        if (e.ctrlKey || e.altKey || e.metaKey || k < 32) { return true } else if (k) {
            if (pos.end - pos.begin !== 0) {
                this.clearBuffer(pos.begin, pos.end)
                this.shiftL(pos.begin, pos.end - 1)
            }
            var p = this.seekNext(pos.begin - 1)
            if (p < len) {
                var c = String.fromCharCode(k)
                if (this.tests[p].test(c)) {
                    this.shiftR(p)
                    this.buffer[p] = c
                    this.writeBuffer()
                    var next = this.seekNext(p)
                    this.caret(next)
                }
            }
            return false
        }
    }
    Inputmask.prototype.pasteEvent = function () {
        var that = this
        setTimeout(function () { that.caret(that.checkVal(true)) }, 0)
    }
    Inputmask.prototype.clearBuffer = function (start, end) {
        var len = this.mask.length
        for (var i = start; i < end && i < len; i++) {
            if (this.tests[i])
                this.buffer[i] = this.options.placeholder
        }
    }
    Inputmask.prototype.writeBuffer = function () { return this.$element.val(this.buffer.join('')).val() }
    Inputmask.prototype.checkVal = function (allow) {
        var len = this.mask.length
        var test = this.$element.val()
        var lastMatch = -1
        for (var i = 0, pos = 0; i < len; i++) {
            if (this.tests[i]) {
                this.buffer[i] = this.options.placeholder
                while (pos++ < test.length) {
                    var c = test.charAt(pos - 1)
                    if (this.tests[i].test(c)) {
                        this.buffer[i] = c
                        lastMatch = i
                        break
                    }
                }
                if (pos > test.length)
                    break
            } else if (this.buffer[i] == test.charAt(pos) && i != this.partialPosition) {
                pos++
                lastMatch = i
            }
        }
        if (!allow && lastMatch + 1 < this.partialPosition) {
            this.$element.val("")
            this.clearBuffer(0, len)
        } else if (allow || lastMatch + 1 >= this.partialPosition) {
            this.writeBuffer()
            if (!allow) this.$element.val(this.$element.val().substring(0, lastMatch + 1))
        }
        return (this.partialPosition ? i : this.firstNonMaskPos)
    }
    var old = $.fn.inputmask
    $.fn.inputmask = function (options) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.inputmask')
            if (!data) $this.data('bs.inputmask', (data = new Inputmask(this, options)))
        })
    }
    $.fn.inputmask.Constructor = Inputmask
    $.fn.inputmask.noConflict = function () {
        $.fn.inputmask = old
        return this
    }
    $(document).on('focus.bs.inputmask.data-api', '[data-mask]', function (e) {
        var $this = $(this)
        if ($this.data('bs.inputmask')) return
        $this.inputmask($this.data())
    })
}(window.jQuery);

+function ($) {
    "use strict"; var OffCanvas = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, OffCanvas.DEFAULTS, options)
        this.state = null
        this.placement = null
        if (this.options.recalc) {
            this.calcClone()
            $(window).on('resize', $.proxy(this.recalc, this))
        }
        if (this.options.autohide)
            $(document).on('click', $.proxy(this.autohide, this))
        if (this.options.toggle) this.toggle()
        if (this.options.disablescrolling) {
            this.options.disableScrolling = this.options.disablescrolling
            delete this.options.disablescrolling
        }
    }
    OffCanvas.DEFAULTS = { toggle: true, placement: 'auto', autohide: true, recalc: true, disableScrolling: true }
    OffCanvas.prototype.offset = function () {
        switch (this.placement) {
            case 'left': case 'right': return this.$element.outerWidth()
            case 'top': case 'bottom': return this.$element.outerHeight()
        }
    }
    OffCanvas.prototype.calcPlacement = function () {
        if (this.options.placement !== 'auto') {
            this.placement = this.options.placement
            return
        }
        if (!this.$element.hasClass('in')) { this.$element.css('visiblity', 'hidden !important').addClass('in') }
        var horizontal = $(window).width() / this.$element.width()
        var vertical = $(window).height() / this.$element.height()
        var element = this.$element
        function ab(a, b) {
            if (element.css(b) === 'auto') return a
            if (element.css(a) === 'auto') return b
            var size_a = parseInt(element.css(a), 10)
            var size_b = parseInt(element.css(b), 10)
            return size_a > size_b ? b : a
        }
        this.placement = horizontal >= vertical ? ab('left', 'right') : ab('top', 'bottom')
        if (this.$element.css('visibility') === 'hidden !important') { this.$element.removeClass('in').css('visiblity', '') }
    }
    OffCanvas.prototype.opposite = function (placement) {
        switch (placement) {
            case 'top': return 'bottom'
            case 'left': return 'right'
            case 'bottom': return 'top'
            case 'right': return 'left'
        }
    }
    OffCanvas.prototype.getCanvasElements = function () {
        var canvas = this.options.canvas ? $(this.options.canvas) : this.$element
        var fixed_elements = canvas.find('*').filter(function () { return $(this).css('position') === 'fixed' }).not(this.options.exclude)
        return canvas.add(fixed_elements)
    }
    OffCanvas.prototype.slide = function (elements, offset, callback) {
        if (!$.support.transition) {
            var anim = {}
            anim[this.placement] = "+=" + offset
            return elements.animate(anim, 350, callback)
        }
        var placement = this.placement
        var opposite = this.opposite(placement)
        elements.each(function () {
            if ($(this).css(placement) !== 'auto')
                $(this).css(placement, (parseInt($(this).css(placement), 10) || 0) + offset)
            if ($(this).css(opposite) !== 'auto')
                $(this).css(opposite, (parseInt($(this).css(opposite), 10) || 0) - offset)
        })
        this.$element.one($.support.transition.end, callback).emulateTransitionEnd(350)
    }
    OffCanvas.prototype.disableScrolling = function () {
        var bodyWidth = $('body').width()
        var prop = 'padding-' + this.opposite(this.placement)
        if ($('body').data('offcanvas-style') === undefined) { $('body').data('offcanvas-style', $('body').attr('style') || '') }
        $('body').css('overflow', 'hidden')
        if ($('body').width() > bodyWidth) {
            var padding = parseInt($('body').css(prop), 10) + $('body').width() - bodyWidth
            setTimeout(function () { $('body').css(prop, padding) }, 1)
        }
    }
    OffCanvas.prototype.show = function () {
        if (this.state) return
        var startEvent = $.Event('show.bs.offcanvas')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return
        this.state = 'slide-in'
        this.calcPlacement(); var elements = this.getCanvasElements()
        var placement = this.placement
        var opposite = this.opposite(placement)
        var offset = this.offset()
        if (elements.index(this.$element) !== -1) {
            $(this.$element).data('offcanvas-style', $(this.$element).attr('style') || '')
            this.$element.css(placement, -1 * offset)
            this.$element.css(placement);
        }
        elements.addClass('canvas-sliding').each(function () {
            if ($(this).data('offcanvas-style') === undefined) $(this).data('offcanvas-style', $(this).attr('style') || '')
            if ($(this).css('position') === 'static') $(this).css('position', 'relative')
            if (($(this).css(placement) === 'auto' || $(this).css(placement) === '0px') && ($(this).css(opposite) === 'auto' || $(this).css(opposite) === '0px')) { $(this).css(placement, 0) }
        })
        if (this.options.disableScrolling) this.disableScrolling()
        var complete = function () {
            if (this.state != 'slide-in') return
            this.state = 'slid'
            elements.removeClass('canvas-sliding').addClass('canvas-slid')
            this.$element.trigger('shown.bs.offcanvas')
        }
        setTimeout($.proxy(function () {
            this.$element.addClass('in')
            this.slide(elements, offset, $.proxy(complete, this))
        }, this), 1)
    }
    OffCanvas.prototype.hide = function (fast) {
        if (this.state !== 'slid') return
        var startEvent = $.Event('hide.bs.offcanvas')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return
        this.state = 'slide-out'
        var elements = $('.canvas-slid')
        var placement = this.placement
        var offset = -1 * this.offset()
        var complete = function () {
            if (this.state != 'slide-out') return
            this.state = null
            this.placement = null
            this.$element.removeClass('in')
            elements.removeClass('canvas-sliding')
            elements.add(this.$element).add('body').each(function () { $(this).attr('style', $(this).data('offcanvas-style')).removeData('offcanvas-style') })
            this.$element.trigger('hidden.bs.offcanvas')
        }
        elements.removeClass('canvas-slid').addClass('canvas-sliding')
        setTimeout($.proxy(function () { this.slide(elements, offset, $.proxy(complete, this)) }, this), 1)
    }
    OffCanvas.prototype.toggle = function () {
        if (this.state === 'slide-in' || this.state === 'slide-out') return
        this[this.state === 'slid' ? 'hide' : 'show']()
    }
    OffCanvas.prototype.calcClone = function () { this.$calcClone = this.$element.clone().html('').addClass('offcanvas-clone').removeClass('in').appendTo($('body')) }
    OffCanvas.prototype.recalc = function () {
        if (this.$calcClone.css('display') === 'none' || (this.state !== 'slid' && this.state !== 'slide-in')) return
        this.state = null
        this.placement = null
        var elements = this.getCanvasElements()
        this.$element.removeClass('in')
        elements.removeClass('canvas-slid')
        elements.add(this.$element).add('body').each(function () { $(this).attr('style', $(this).data('offcanvas-style')).removeData('offcanvas-style') })
    }
    OffCanvas.prototype.autohide = function (e) { if ($(e.target).closest(this.$element).length === 0) this.hide() }
    var old = $.fn.offcanvas
    $.fn.offcanvas = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.offcanvas')
            var options = $.extend({}, OffCanvas.DEFAULTS, $this.data(), typeof option === 'object' && option)
            if (!data) $this.data('bs.offcanvas', (data = new OffCanvas(this, options)))
            if (typeof option === 'string') data[option]()
        })
    }
    $.fn.offcanvas.Constructor = OffCanvas
    $.fn.offcanvas.noConflict = function () {
        $.fn.offcanvas = old
        return this
    }
    $(document).on('click.bs.offcanvas.data-api', '[data-toggle=offcanvas]', function (e) {
        var $this = $(this), href
        var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')
        var $canvas = $(target)
        var data = $canvas.data('bs.offcanvas')
        var option = data ? 'toggle' : $this.data()
        e.stopPropagation()
        if (data) data.toggle()
        else $canvas.offcanvas(option)
    })
}(window.jQuery);

+function ($) {
    "use strict"; var Rowlink = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Rowlink.DEFAULTS, options)
        this.$element.on('click.bs.rowlink', 'td:not(.rowlink-skip)', $.proxy(this.click, this))
    }
    Rowlink.DEFAULTS = { target: "a" }
    Rowlink.prototype.click = function (e) {
        var target = $(e.currentTarget).closest('tr').find(this.options.target)[0]
        if ($(e.target)[0] === target) return
        e.preventDefault(); if (target.click) { target.click() } else if (document.createEvent) { var evt = document.createEvent("MouseEvents"); evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null); target.dispatchEvent(evt); }
    }
    var old = $.fn.rowlink
    $.fn.rowlink = function (options) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.rowlink')
            if (!data) $this.data('bs.rowlink', (data = new Rowlink(this, options)))
        })
    }
    $.fn.rowlink.Constructor = Rowlink
    $.fn.rowlink.noConflict = function () {
        $.fn.rowlink = old
        return this
    }
    $(document).on('click.bs.rowlink.data-api', '[data-link="row"]', function (e) {
        if ($(e.target).closest('.rowlink-skip').length !== 0) return
        var $this = $(this)
        if ($this.data('bs.rowlink')) return
        $this.rowlink($this.data())
        $(e.target).trigger('click.bs.rowlink')
    })
}(window.jQuery);

/*!
 * jQuery Form Plugin
 * version: 3.51.0-2014.06.20
 * Requires jQuery v1.5 or later
 * Copyright (c) 2014 M. Alsup
 * Examples and documentation at: http://malsup.com/jquery/form/
 * Project repository: https://github.com/malsup/form
 * Dual licensed under the MIT and GPL licenses.
 * https://github.com/malsup/form#copyright-and-license
 */
!function (e) { "use strict"; "function" == typeof define && define.amd ? define(["jquery"], e) : e("undefined" != typeof jQuery ? jQuery : window.Zepto) }(function (e) { "use strict"; function t(t) { var r = t.data; t.isDefaultPrevented() || (t.preventDefault(), e(t.target).ajaxSubmit(r)) } function r(t) { var r = t.target, a = e(r); if (!a.is("[type=submit],[type=image]")) { var n = a.closest("[type=submit]"); if (0 === n.length) return; r = n[0] } var i = this; if (i.clk = r, "image" == r.type) if (void 0 !== t.offsetX) i.clk_x = t.offsetX, i.clk_y = t.offsetY; else if ("function" == typeof e.fn.offset) { var o = a.offset(); i.clk_x = t.pageX - o.left, i.clk_y = t.pageY - o.top } else i.clk_x = t.pageX - r.offsetLeft, i.clk_y = t.pageY - r.offsetTop; setTimeout(function () { i.clk = i.clk_x = i.clk_y = null }, 100) } function a() { if (e.fn.ajaxSubmit.debug) { var t = "[jquery.form] " + Array.prototype.join.call(arguments, ""); window.console && window.console.log ? window.console.log(t) : window.opera && window.opera.postError && window.opera.postError(t) } } var n = {}; n.fileapi = void 0 !== e("<input type='file'/>").get(0).files, n.formdata = void 0 !== window.FormData; var i = !!e.fn.prop; e.fn.attr2 = function () { if (!i) return this.attr.apply(this, arguments); var e = this.prop.apply(this, arguments); return e && e.jquery || "string" == typeof e ? e : this.attr.apply(this, arguments) }, e.fn.ajaxSubmit = function (t) { function r(r) { var a, n, i = e.param(r, t.traditional).split("&"), o = i.length, s = []; for (a = 0; o > a; a++)i[a] = i[a].replace(/\+/g, " "), n = i[a].split("="), s.push([decodeURIComponent(n[0]), decodeURIComponent(n[1])]); return s } function o(a) { for (var n = new FormData, i = 0; i < a.length; i++)n.append(a[i].name, a[i].value); if (t.extraData) { var o = r(t.extraData); for (i = 0; i < o.length; i++)o[i] && n.append(o[i][0], o[i][1]) } t.data = null; var s = e.extend(!0, {}, e.ajaxSettings, t, { contentType: !1, processData: !1, cache: !1, type: u || "POST" }); t.uploadProgress && (s.xhr = function () { var r = e.ajaxSettings.xhr(); return r.upload && r.upload.addEventListener("progress", function (e) { var r = 0, a = e.loaded || e.position, n = e.total; e.lengthComputable && (r = Math.ceil(a / n * 100)), t.uploadProgress(e, a, n, r) }, !1), r }), s.data = null; var c = s.beforeSend; return s.beforeSend = function (e, r) { r.data = t.formData ? t.formData : n, c && c.call(this, e, r) }, e.ajax(s) } function s(r) { function n(e) { var t = null; try { e.contentWindow && (t = e.contentWindow.document) } catch (r) { a("cannot get iframe.contentWindow document: " + r) } if (t) return t; try { t = e.contentDocument ? e.contentDocument : e.document } catch (r) { a("cannot get iframe.contentDocument: " + r), t = e.document } return t } function o() { function t() { try { var e = n(g).readyState; a("state = " + e), e && "uninitialized" == e.toLowerCase() && setTimeout(t, 50) } catch (r) { a("Server abort: ", r, " (", r.name, ")"), s(k), j && clearTimeout(j), j = void 0 } } var r = f.attr2("target"), i = f.attr2("action"), o = "multipart/form-data", c = f.attr("enctype") || f.attr("encoding") || o; w.setAttribute("target", p), (!u || /post/i.test(u)) && w.setAttribute("method", "POST"), i != m.url && w.setAttribute("action", m.url), m.skipEncodingOverride || u && !/post/i.test(u) || f.attr({ encoding: "multipart/form-data", enctype: "multipart/form-data" }), m.timeout && (j = setTimeout(function () { T = !0, s(D) }, m.timeout)); var l = []; try { if (m.extraData) for (var d in m.extraData) m.extraData.hasOwnProperty(d) && l.push(e.isPlainObject(m.extraData[d]) && m.extraData[d].hasOwnProperty("name") && m.extraData[d].hasOwnProperty("value") ? e('<input type="hidden" name="' + m.extraData[d].name + '">').val(m.extraData[d].value).appendTo(w)[0] : e('<input type="hidden" name="' + d + '">').val(m.extraData[d]).appendTo(w)[0]); m.iframeTarget || v.appendTo("body"), g.attachEvent ? g.attachEvent("onload", s) : g.addEventListener("load", s, !1), setTimeout(t, 15); try { w.submit() } catch (h) { var x = document.createElement("form").submit; x.apply(w) } } finally { w.setAttribute("action", i), w.setAttribute("enctype", c), r ? w.setAttribute("target", r) : f.removeAttr("target"), e(l).remove() } } function s(t) { if (!x.aborted && !F) { if (M = n(g), M || (a("cannot access response document"), t = k), t === D && x) return x.abort("timeout"), void S.reject(x, "timeout"); if (t == k && x) return x.abort("server abort"), void S.reject(x, "error", "server abort"); if (M && M.location.href != m.iframeSrc || T) { g.detachEvent ? g.detachEvent("onload", s) : g.removeEventListener("load", s, !1); var r, i = "success"; try { if (T) throw "timeout"; var o = "xml" == m.dataType || M.XMLDocument || e.isXMLDoc(M); if (a("isXml=" + o), !o && window.opera && (null === M.body || !M.body.innerHTML) && --O) return a("requeing onLoad callback, DOM not available"), void setTimeout(s, 250); var u = M.body ? M.body : M.documentElement; x.responseText = u ? u.innerHTML : null, x.responseXML = M.XMLDocument ? M.XMLDocument : M, o && (m.dataType = "xml"), x.getResponseHeader = function (e) { var t = { "content-type": m.dataType }; return t[e.toLowerCase()] }, u && (x.status = Number(u.getAttribute("status")) || x.status, x.statusText = u.getAttribute("statusText") || x.statusText); var c = (m.dataType || "").toLowerCase(), l = /(json|script|text)/.test(c); if (l || m.textarea) { var f = M.getElementsByTagName("textarea")[0]; if (f) x.responseText = f.value, x.status = Number(f.getAttribute("status")) || x.status, x.statusText = f.getAttribute("statusText") || x.statusText; else if (l) { var p = M.getElementsByTagName("pre")[0], h = M.getElementsByTagName("body")[0]; p ? x.responseText = p.textContent ? p.textContent : p.innerText : h && (x.responseText = h.textContent ? h.textContent : h.innerText) } } else "xml" == c && !x.responseXML && x.responseText && (x.responseXML = X(x.responseText)); try { E = _(x, c, m) } catch (y) { i = "parsererror", x.error = r = y || i } } catch (y) { a("error caught: ", y), i = "error", x.error = r = y || i } x.aborted && (a("upload aborted"), i = null), x.status && (i = x.status >= 200 && x.status < 300 || 304 === x.status ? "success" : "error"), "success" === i ? (m.success && m.success.call(m.context, E, "success", x), S.resolve(x.responseText, "success", x), d && e.event.trigger("ajaxSuccess", [x, m])) : i && (void 0 === r && (r = x.statusText), m.error && m.error.call(m.context, x, i, r), S.reject(x, "error", r), d && e.event.trigger("ajaxError", [x, m, r])), d && e.event.trigger("ajaxComplete", [x, m]), d && !--e.active && e.event.trigger("ajaxStop"), m.complete && m.complete.call(m.context, x, i), F = !0, m.timeout && clearTimeout(j), setTimeout(function () { m.iframeTarget ? v.attr("src", m.iframeSrc) : v.remove(), x.responseXML = null }, 100) } } } var c, l, m, d, p, v, g, x, y, b, T, j, w = f[0], S = e.Deferred(); if (S.abort = function (e) { x.abort(e) }, r) for (l = 0; l < h.length; l++)c = e(h[l]), i ? c.prop("disabled", !1) : c.removeAttr("disabled"); if (m = e.extend(!0, {}, e.ajaxSettings, t), m.context = m.context || m, p = "jqFormIO" + (new Date).getTime(), m.iframeTarget ? (v = e(m.iframeTarget), b = v.attr2("name"), b ? p = b : v.attr2("name", p)) : (v = e('<iframe name="' + p + '" src="' + m.iframeSrc + '" />'), v.css({ position: "absolute", top: "-1000px", left: "-1000px" })), g = v[0], x = { aborted: 0, responseText: null, responseXML: null, status: 0, statusText: "n/a", getAllResponseHeaders: function () { }, getResponseHeader: function () { }, setRequestHeader: function () { }, abort: function (t) { var r = "timeout" === t ? "timeout" : "aborted"; a("aborting upload... " + r), this.aborted = 1; try { g.contentWindow.document.execCommand && g.contentWindow.document.execCommand("Stop") } catch (n) { } v.attr("src", m.iframeSrc), x.error = r, m.error && m.error.call(m.context, x, r, t), d && e.event.trigger("ajaxError", [x, m, r]), m.complete && m.complete.call(m.context, x, r) } }, d = m.global, d && 0 === e.active++ && e.event.trigger("ajaxStart"), d && e.event.trigger("ajaxSend", [x, m]), m.beforeSend && m.beforeSend.call(m.context, x, m) === !1) return m.global && e.active--, S.reject(), S; if (x.aborted) return S.reject(), S; y = w.clk, y && (b = y.name, b && !y.disabled && (m.extraData = m.extraData || {}, m.extraData[b] = y.value, "image" == y.type && (m.extraData[b + ".x"] = w.clk_x, m.extraData[b + ".y"] = w.clk_y))); var D = 1, k = 2, A = e("meta[name=csrf-token]").attr("content"), L = e("meta[name=csrf-param]").attr("content"); L && A && (m.extraData = m.extraData || {}, m.extraData[L] = A), m.forceSync ? o() : setTimeout(o, 10); var E, M, F, O = 50, X = e.parseXML || function (e, t) { return window.ActiveXObject ? (t = new ActiveXObject("Microsoft.XMLDOM"), t.async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && "parsererror" != t.documentElement.nodeName ? t : null }, C = e.parseJSON || function (e) { return window.eval("(" + e + ")") }, _ = function (t, r, a) { var n = t.getResponseHeader("content-type") || "", i = "xml" === r || !r && n.indexOf("xml") >= 0, o = i ? t.responseXML : t.responseText; return i && "parsererror" === o.documentElement.nodeName && e.error && e.error("parsererror"), a && a.dataFilter && (o = a.dataFilter(o, r)), "string" == typeof o && ("json" === r || !r && n.indexOf("json") >= 0 ? o = C(o) : ("script" === r || !r && n.indexOf("javascript") >= 0) && e.globalEval(o)), o }; return S } if (!this.length) return a("ajaxSubmit: skipping submit process - no element selected"), this; var u, c, l, f = this; "function" == typeof t ? t = { success: t } : void 0 === t && (t = {}), u = t.type || this.attr2("method"), c = t.url || this.attr2("action"), l = "string" == typeof c ? e.trim(c) : "", l = l || window.location.href || "", l && (l = (l.match(/^([^#]+)/) || [])[1]), t = e.extend(!0, { url: l, success: e.ajaxSettings.success, type: u || e.ajaxSettings.type, iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank" }, t); var m = {}; if (this.trigger("form-pre-serialize", [this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this; if (t.beforeSerialize && t.beforeSerialize(this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSerialize callback"), this; var d = t.traditional; void 0 === d && (d = e.ajaxSettings.traditional); var p, h = [], v = this.formToArray(t.semantic, h); if (t.data && (t.extraData = t.data, p = e.param(t.data, d)), t.beforeSubmit && t.beforeSubmit(v, this, t) === !1) return a("ajaxSubmit: submit aborted via beforeSubmit callback"), this; if (this.trigger("form-submit-validate", [v, this, t, m]), m.veto) return a("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this; var g = e.param(v, d); p && (g = g ? g + "&" + p : p), "GET" == t.type.toUpperCase() ? (t.url += (t.url.indexOf("?") >= 0 ? "&" : "?") + g, t.data = null) : t.data = g; var x = []; if (t.resetForm && x.push(function () { f.resetForm() }), t.clearForm && x.push(function () { f.clearForm(t.includeHidden) }), !t.dataType && t.target) { var y = t.success || function () { }; x.push(function (r) { var a = t.replaceTarget ? "replaceWith" : "html"; e(t.target)[a](r).each(y, arguments) }) } else t.success && x.push(t.success); if (t.success = function (e, r, a) { for (var n = t.context || this, i = 0, o = x.length; o > i; i++)x[i].apply(n, [e, r, a || f, f]) }, t.error) { var b = t.error; t.error = function (e, r, a) { var n = t.context || this; b.apply(n, [e, r, a, f]) } } if (t.complete) { var T = t.complete; t.complete = function (e, r) { var a = t.context || this; T.apply(a, [e, r, f]) } } var j = e("input[type=file]:enabled", this).filter(function () { return "" !== e(this).val() }), w = j.length > 0, S = "multipart/form-data", D = f.attr("enctype") == S || f.attr("encoding") == S, k = n.fileapi && n.formdata; a("fileAPI :" + k); var A, L = (w || D) && !k; t.iframe !== !1 && (t.iframe || L) ? t.closeKeepAlive ? e.get(t.closeKeepAlive, function () { A = s(v) }) : A = s(v) : A = (w || D) && k ? o(v) : e.ajax(t), f.removeData("jqxhr").data("jqxhr", A); for (var E = 0; E < h.length; E++)h[E] = null; return this.trigger("form-submit-notify", [this, t]), this }, e.fn.ajaxForm = function (n) { if (n = n || {}, n.delegation = n.delegation && e.isFunction(e.fn.on), !n.delegation && 0 === this.length) { var i = { s: this.selector, c: this.context }; return !e.isReady && i.s ? (a("DOM not ready, queuing ajaxForm"), e(function () { e(i.s, i.c).ajaxForm(n) }), this) : (a("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)")), this) } return n.delegation ? (e(document).off("submit.form-plugin", this.selector, t).off("click.form-plugin", this.selector, r).on("submit.form-plugin", this.selector, n, t).on("click.form-plugin", this.selector, n, r), this) : this.ajaxFormUnbind().bind("submit.form-plugin", n, t).bind("click.form-plugin", n, r) }, e.fn.ajaxFormUnbind = function () { return this.unbind("submit.form-plugin click.form-plugin") }, e.fn.formToArray = function (t, r) { var a = []; if (0 === this.length) return a; var i, o = this[0], s = this.attr("id"), u = t ? o.getElementsByTagName("*") : o.elements; if (u && !/MSIE [678]/.test(navigator.userAgent) && (u = e(u).get()), s && (i = e(':input[form="' + s + '"]').get(), i.length && (u = (u || []).concat(i))), !u || !u.length) return a; var c, l, f, m, d, p, h; for (c = 0, p = u.length; p > c; c++)if (d = u[c], f = d.name, f && !d.disabled) if (t && o.clk && "image" == d.type) o.clk == d && (a.push({ name: f, value: e(d).val(), type: d.type }), a.push({ name: f + ".x", value: o.clk_x }, { name: f + ".y", value: o.clk_y })); else if (m = e.fieldValue(d, !0), m && m.constructor == Array) for (r && r.push(d), l = 0, h = m.length; h > l; l++)a.push({ name: f, value: m[l] }); else if (n.fileapi && "file" == d.type) { r && r.push(d); var v = d.files; if (v.length) for (l = 0; l < v.length; l++)a.push({ name: f, value: v[l], type: d.type }); else a.push({ name: f, value: "", type: d.type }) } else null !== m && "undefined" != typeof m && (r && r.push(d), a.push({ name: f, value: m, type: d.type, required: d.required })); if (!t && o.clk) { var g = e(o.clk), x = g[0]; f = x.name, f && !x.disabled && "image" == x.type && (a.push({ name: f, value: g.val() }), a.push({ name: f + ".x", value: o.clk_x }, { name: f + ".y", value: o.clk_y })) } return a }, e.fn.formSerialize = function (t) { return e.param(this.formToArray(t)) }, e.fn.fieldSerialize = function (t) { var r = []; return this.each(function () { var a = this.name; if (a) { var n = e.fieldValue(this, t); if (n && n.constructor == Array) for (var i = 0, o = n.length; o > i; i++)r.push({ name: a, value: n[i] }); else null !== n && "undefined" != typeof n && r.push({ name: this.name, value: n }) } }), e.param(r) }, e.fn.fieldValue = function (t) { for (var r = [], a = 0, n = this.length; n > a; a++) { var i = this[a], o = e.fieldValue(i, t); null === o || "undefined" == typeof o || o.constructor == Array && !o.length || (o.constructor == Array ? e.merge(r, o) : r.push(o)) } return r }, e.fieldValue = function (t, r) { var a = t.name, n = t.type, i = t.tagName.toLowerCase(); if (void 0 === r && (r = !0), r && (!a || t.disabled || "reset" == n || "button" == n || ("checkbox" == n || "radio" == n) && !t.checked || ("submit" == n || "image" == n) && t.form && t.form.clk != t || "select" == i && -1 == t.selectedIndex)) return null; if ("select" == i) { var o = t.selectedIndex; if (0 > o) return null; for (var s = [], u = t.options, c = "select-one" == n, l = c ? o + 1 : u.length, f = c ? o : 0; l > f; f++) { var m = u[f]; if (m.selected) { var d = m.value; if (d || (d = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), c) return d; s.push(d) } } return s } return e(t).val() }, e.fn.clearForm = function (t) { return this.each(function () { e("input,select,textarea", this).clearFields(t) }) }, e.fn.clearFields = e.fn.clearInputs = function (t) { var r = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i; return this.each(function () { var a = this.type, n = this.tagName.toLowerCase(); r.test(a) || "textarea" == n ? this.value = "" : "checkbox" == a || "radio" == a ? this.checked = !1 : "select" == n ? this.selectedIndex = -1 : "file" == a ? /MSIE/.test(navigator.userAgent) ? e(this).replaceWith(e(this).clone(!0)) : e(this).val("") : t && (t === !0 && /hidden/.test(a) || "string" == typeof t && e(this).is(t)) && (this.value = "") }) }, e.fn.resetForm = function () { return this.each(function () { ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset() }) }, e.fn.enable = function (e) { return void 0 === e && (e = !0), this.each(function () { this.disabled = !e }) }, e.fn.selected = function (t) { return void 0 === t && (t = !0), this.each(function () { var r = this.type; if ("checkbox" == r || "radio" == r) this.checked = t; else if ("option" == this.tagName.toLowerCase()) { var a = e(this).parent("select"); t && a[0] && "select-one" == a[0].type && a.find("option").selected(!1), this.selected = t } }) }, e.fn.ajaxSubmit.debug = !1 });

CoreJs = {};

CoreJs.apply = function (o, c, defaults) {
    // no "this" reference for friendly out of scope calls
    if (defaults) {
        CoreJs.CoreJs(o, defaults);
    }
    if (o && c && typeof c == 'object') {
        for (var p in c) {
            o[p] = c[p];
        }
    }
    return o;
};

(function () {

    var toString = Object.prototype.toString,
        ua = navigator.userAgent.toLowerCase(),
        check = function (r) {
            return r.test(ua);
        },
        DOC = document,
        docMode = DOC.documentMode,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && (check(/msie 7/) || docMode == 7),
        isIE8 = isIE && (check(/msie 8/) && docMode != 7),
        isIE9 = isIE && check(/msie 9/),
        isIE6 = isIE && !isIE7 && !isIE8 && !isIE9,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol),
        noArgs = [],
        nonEnumerables = [],
        emptyFn = CoreJs.emptyFn,
        t = CoreJs.apply({}, {
            constructor: emptyFn,
            toString: emptyFn,
            valueOf: emptyFn
        }),
        callOverrideParent = function () {
            var method = callOverrideParent.caller.caller; // skip callParent (our caller)
            return method.$owner.prototype[method.$name].apply(this, arguments);
        };

    function Base() {
        //
    }

    CoreJs.apply(Base, {
        $isClass: true,

        callParent: function (args) {
            var method;

            // This code is intentionally inlined for the least number of debugger stepping
            return (method = this.callParent.caller) && (method.$previous ||
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name])).apply(this, args || noArgs);
        }
    });

    Base.prototype = {
        constructor: function () {
        },
        callParent: function (args) {
            // NOTE: this code is deliberately as few expressions (and no function calls)
            // as possible so that a debugger can skip over this noise with the minimum number
            // of steps. Basically, just hit Step Into until you are where you really wanted
            // to be.
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]));

            return superMethod.apply(this, args || noArgs);
        }
    };

    CoreJs.apply(Base, {
        $isClass: true,

        callParent: function (args) {
            var method;

            // This code is intentionally inlined for the least number of debugger stepping
            return (method = this.callParent.caller) && (method.$previous ||
                ((method = method.$owner ? method : method.caller) &&
                    method.$owner.superclass.self[method.$name])).apply(this, args || noArgs);
        }
    });

    Base.prototype = {
        constructor: function () {
        },
        callParent: function (args) {
            // NOTE: this code is deliberately as few expressions (and no function calls)
            // as possible so that a debugger can skip over this noise with the minimum number
            // of steps. Basically, just hit Step Into until you are where you really wanted
            // to be.
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                    ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass[method.$name]));

            return superMethod.apply(this, args || noArgs);
        }
    };

    CoreJs.apply(CoreJs, {
        isNumber: function (v) {
            return typeof v === 'number' && isFinite(v);
        },
        isString: function (v) {
            return typeof v === 'string';
        },
        isBoolean: function (v) {
            return typeof v === 'boolean';
        },
        isPrimitive: function (v) {
            return CoreJs.isString(v) || CoreJs.isNumber(v) || CoreJs.isBoolean(v);
        },
        isArray: function (v) {
            return toString.apply(v) === '[object Array]';
        },
        isObject: function (v) {
            return !!v && Object.prototype.toString.call(v) === '[object Object]';
        },
        isEmpty: function (v, allowBlank) {
            return v === null || v === undefined || ((CoreJs.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
        },
        isIterable: function (v) {
            //check for array or arguments
            if (CoreJs.isArray(v) || v.callee) {
                return true;
            }
            //check for node list type
            if (/NodeList|HTMLCollection/.test(toString.call(v))) {
                return true;
            }
            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((typeof v.nextNode != 'undefined' || v.item) && CoreJs.isNumber(v.length));
        },
        isDefined: function (v) {
            return typeof v !== 'undefined';
        },
        value: function (v, defaultValue, allowBlank) {
            return CoreJs.isEmpty(v, allowBlank) ? defaultValue : v;
        },
        applyIf: function (o, c) {
            if (o) {
                for (var p in c) {
                    if (!CoreJs.isDefined(o[p])) {
                        o[p] = c[p];
                    }
                }
            }
            return o;
        },
        each: function (array, fn, scope) {
            if (CoreJs.isEmpty(array, true)) {
                return;
            }
            if (!CoreJs.isIterable(array) || CoreJs.isPrimitive(array)) {
                array = [array];
            }
            for (var i = 0, len = array.length; i < len; i++) {
                if (fn.call(scope || array[i], array[i], i, array) === false) {
                    return i;
                };
            }
        },

        iterate: function (obj, fn, scope) {
            if (CoreJs.isEmpty(obj)) {
                return;
            }
            if (CoreJs.isIterable(obj)) {
                CoreJs.each(obj, fn, scope);
                return;
            } else if (typeof obj == 'object') {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (fn.call(scope || obj, prop, obj[prop], obj) === false) {
                            return;
                        };
                    }
                }
            }
        },

        addMembers: function (cls, target, members, handleNonEnumerables) {
            var i, name, member;

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function') {
                        member.$owner = cls;
                        member.$name = name;
                    }

                    target[name] = member;
                }
            }

            if (handleNonEnumerables && nonEnumerables) {
                for (i = nonEnumerables.length; i-- > 0;) {
                    name = nonEnumerables[i];
                    if (members.hasOwnProperty(name)) {
                        member = members[name];
                        if (typeof member == 'function') {
                            member.$owner = cls;
                            member.$name = name;
                        }

                        target[name] = member;
                    }
                }
            }
        },

        extend: function () {
            // inline overrides
            var io = function (o) {
                for (var m in o) {
                    this[m] = o[m];
                }
            };
            var oc = Object.prototype.constructor;

            return function (sb, sp, overrides) {
                if (typeof sp == 'object') {
                    overrides = sp;
                    sp = sb;
                    sb = overrides.constructor != oc ? overrides.constructor : function () { sp.apply(this, arguments); };
                }
                var F = function () { },
                    sbp,
                    spp = sp.prototype;

                F.prototype = spp;
                sbp = sb.prototype = new F();
                sbp.constructor = sb;
                sb.superclass = spp;
                if (spp.constructor == oc) {
                    spp.constructor = sp;
                }
                sb.override = function (o) {
                    CoreJs.override(sb, o);
                };
                sbp.superclass = sbp.supr = (function () {
                    return spp;
                });
                sbp.override = io;
                CoreJs.override(sb, overrides);
                sb.extend = function (o) { return CoreJs.extend(sb, o); };
                return sb;
            };
        }(),

        override: function (target, overrides) {
            var proto, statics;

            if (overrides) {
                if (target.$isClass) {
                    statics = overrides.statics;
                    if (statics) {
                        delete overrides.statics;
                    }

                    CoreJs.addMembers(target, target.prototype, overrides, true);
                    if (statics) {
                        CoreJs.addMembers(target, target, statics);
                    }
                } else if (typeof target == 'function') {
                    proto = target.prototype;
                    CoreJs.apply(proto, overrides);
                    if (CoreJs.isIE && overrides.hasOwnProperty('toString')) {
                        proto.toString = overrides.toString;
                    }
                } else {
                    var owner = target.self,
                        name, value;

                    if (owner && owner.$isClass) {
                        for (name in overrides) {
                            if (overrides.hasOwnProperty(name)) {
                                value = overrides[name];

                                if (typeof value == 'function') {
                                    //<debug>
                                    if (owner.$className) {
                                        value.displayName = owner.$className + '#' + name;
                                    }
                                    //</debug>

                                    value.$name = name;
                                    value.$owner = owner;
                                    value.$previous = target.hasOwnProperty(name)
                                        ? target[name] // already hooked, so call previous hook
                                        : callOverrideParent; // calls by name on prototype
                                }

                                target[name] = value;
                            }
                        }
                    } else {
                        CoreJs.apply(target, overrides);

                        if (!target.constructor.$isClass) {
                            target.constructor.prototype.callParent = Base.prototype.callParent;
                            target.constructor.callParent = Base.callParent;
                        }
                    }
                }
            }
        },

        formatNumber: function (nStr, decimals, __decimalSeparator, __thousandsSeparator) {
            if (!__decimalSeparator)
                __decimalSeparator = '.';

            if (!__thousandsSeparator)
                __thousandsSeparator = ',';

            if (!nStr && nStr !== 0)
                nStr = 0;

            nStr = parseFloat(nStr);

            nStr = nStr.toFixed(decimals);

            var x = nStr.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? __decimalSeparator + x[1] : '';

            if (x1.length > 3) {
                var rgx = /(\d+)(\d{3})/;
                while (rgx.test(x1)) {
                    x1 = x1.replace(rgx, '$1' + __thousandsSeparator + '$2');
                }
            }

            if (x2.length > 3) {
                var rgx = /(\d{3})(\d+)/;
                while (rgx.test(x2)) {
                    x2 = x2.replace(rgx, '$1' + __thousandsSeparator + '$2');
                }
            }

            return x1 + x2;
        },

        /**
        * Parses the "text" and creates HTML links if necessary. Uses "linkText" for link names if it's supplied.
        * 
        * @param text
        * @param linkText
        */
        linkify: function (text, linkText) {
            // http://, https://, ftp://
            var urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

            // www. sans http:// or https://
            var pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

            // Email addresses
            var emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

            return text
                .replace(urlPattern, '<a href="$&">' + (linkText ? linkText : '$&') + '</a>')
                .replace(pseudoUrlPattern, '$1<a href="http://$2">' + (linkText ? linkText : '$2') + '</a>')
                .replace(emailAddressPattern, '<a href="mailto:$&">' + (linkText ? linkText : '$&') + '</a>');
        }
    });

})();

CoreJs.Observable = function () {
    var me = this, e = me.events;
    if (me.listeners) {
        me.on(me.listeners);
        delete me.listeners;
    }
    me.events = e || {};
};

var TRUE = true,
    FALSE = false
    ;

CoreJs.Observable.prototype = {
    fireEvent: function () {
        var a = Array.prototype.slice.call(arguments, 0),
            ename = a[0].toLowerCase(),
            me = this;

        arguments[0] = this;

        if (this.listeners && this.listeners[ename] && this.listeners[ename].fn) {
            this.listeners[ename].fn.apply(this.listeners[ename].scope || this, Array.prototype.slice.call(arguments, 0));
            //this.listeners[ename].fn.call( this.listeners[ename].scope || this, this, Array.prototype.slice.call(arguments, 1) );
        }

    }
};

CoreJs.Grid = function (config) {
    config = config || {};
    if (config.initialConfig) {
        if (config.isAction) {           // actions
            this.baseAction = config;
        }
        config = config.initialConfig; // component cloning / action set up
    } else if (config.tagName || config.dom || CoreJs.isString(config)) { // element object
        config = { applyTo: config, id: config.id || config };
    }

    /**
     * This Component's initial configuration specification. Read-only.
     * @type Object
     * @property initialConfig
     */
    this.initialConfig = config;

    CoreJs.apply(this, config);

    this.initComponent();

    if (this.renderTo)
        this.render(this.renderTo);
};

/**
* Basic Remote Grid (supports: remote loading, sorting, pagination, custom columns)
* 
* Usage example:
new CoreJs.Grid({
    renderTo: 'grid',
    autoLoad: true,
    url: processURL + '?task=loadData',
    columns: [
        { header: '#', index: 'id', width: 50 },
        { header: 'Name', index: 'name' },
        { header: 'Email', index: 'email' },
        { header: '', sortable: false, type: 'action', buttons: [
            { text: 'Add', handler: function(cmp, rIndex, cIndex, data ){
                console.log( cmp, rIndex, cIndex, data );
                
            } },
            { text: 'Edit' }
        ] }
    ],
    sort: {
        sort: 'id',
        dir: 'ASC'
    },
    pageSize: 3,
    listeners: {
        load: {
            fn: function( cmp, data ){
                
            }
        }
    }
});
*/
CoreJs.extend(CoreJs.Grid, CoreJs.Observable, {
    renderTo: null, // the element ID where the grid will be rendered to
    autoLoad: true, // trigger the data loading instantly

    url: null, // remote url where data is loaded from
    data: null, // the row data - is populated after the data is loaded from the URL
    columns: null, // column configuration
    baseParams: {},

    cls: '', // extra table class
    enablePagination: true, // enable pagination
    enableLoading: true, // enable loading message
    enableFilter: true, // enable filter
    enableCachePrevention: true, // enable cache prevention by adding a timestamp to all ajax calls
    enableDownload: false, // enable download button

    filterParam: 'q', // filter param will be sent to the server
    filterPlaceholder: typeof gridFilterPlaceholder !== 'undefined' ? gridFilterPlaceholder : 'Keyword', // filter placeholder
    textPage: typeof gridTextPage !== 'undefined' ? gridTextPage : 'Page',
    textFilter: typeof gridTextFilter !== 'undefined' ? gridTextFilter : 'Search',
    textFilterBtn: typeof gridTextFilterBtn !== 'undefined' ? gridTextFilterBtn : 'Go',
    textFilterBtnReset: typeof gridTextFilterBtnReset !== 'undefined' ? gridTextFilterBtnReset : 'Reset Filters',
    textNoData: typeof gridTextNoData !== 'undefined' ? gridTextNoData : 'No data found',
    textYes: typeof gridTextYes !== 'undefined' ? gridTextYes : 'Yes',
    textNo: typeof gridTextNo !== 'undefined' ? gridTextNo : 'No',
    textFrom: typeof gridTextFrom !== 'undefined' ? gridTextFrom : 'from',
    textDownloadBtn: typeof gridTextDownloadBtn !== 'undefined' ? gridTextDownloadBtn : 'Download',

    pageSize: 20,
    dataTotalParam: 'total', // total property of the json response
    dataResultsParam: 'results', // results property for the json response

    initComponent: function () {

    },

    /**
    * Renders the dom
    * 
    * @param container
    */
    render: function (container) {
        this.container = document.getElementById(container);
        if (!this.container)
            return;

        this.el = document.createElement('div');
        this.el.className = 'g-grid' + (this.cls && this.cls.length ? ' ' + this.cls : '');
        //this.el.innerHTML = '22';

        this.container.appendChild(this.el);

        if (this.enableLoading) {
            this.loading = document.createElement('div');
            this.loading.className = 'hide g-loading';
            this.el.appendChild(this.loading);
        }

        if (this.enableDownload) {
            this.download = document.createElement('div');
            this.download.innerHTML = '<a href="#" class="btn btn-success btn-sm g-btn-download" style="margin-left: 5px;"><div class="glyphicon glyphicon-save"></div>&nbsp;' + this.textDownloadBtn + '</a><div class="g-clearfix"></div>';
            this.el.appendChild(this.download);

            var me = this;
            $(this.el).find('.g-btn-download').click(function (event) {
                event.preventDefault();
                me.doDownload();
            });
        }

        if (this.enableFilter) {
            this.filter = document.createElement('form');
            this.filter.className = 'g-filter';
            this.filter.method = 'post';
            this.filter.innerHTML =
                '<div class="clearfix g-filter-item g-filter-item-text">' +
                '<label class="filter-label">' + this.textFilter + '</label>' +
                '<input type="text" class="form-control input-sm filter-input g-input-filter" name="' + this.filterParam + '" placeholder="' + this.filterPlaceholder + '">' +
                '</div>'
                ;

            CoreJs.each(this.columns, function (col) {
                // boolean filter
                if (col.filter && (col.filter == 'boolean' || col.filter == 'checkbox' || col.filter == 'select')) { // boolean filter
                    var filterIndex = col.filterIndex ? col.filterIndex : col.index,
                        inputName = col.filter == 'select' ? filterIndex : filterIndex + '[]',
                        filterDefaultOpt = col.filterOpt,
                        filterDefaultValue = col.filterVal,
                        fltrHtml = ''
                        ;

                    if (col.filter == 'boolean') {
                        filterDefaultOpt = [
                            { name: this.textYes, value: 1 },
                            { name: this.textNo, value: 0 }
                        ];
                        filterDefaultValue = col.filterVal ? col.filterVal : [0, 1];
                    }

                    // set base params as default checked
                    this.setBaseParam(inputName, filterDefaultValue);

                    if (filterDefaultValue)
                        this.setBaseParam(filterIndex + '_filter', 1);

                    fltrHtml +=
                        '<div class="clearfix g-filter-item g-filter-item-' + col.filter + '">' +
                        '<label class="filter-label">' + col.header + '</label>';

                    if (col.filter == 'select') {
                        fltrHtml += '<select class="form-control input-sm filter-input" name="' + inputName + '">';
                        CoreJs.each(filterDefaultOpt, function (opt) {
                            fltrHtml +=
                                '<option value="' + opt.value + '" ' + (filterDefaultValue && $.inArray(opt.value, filterDefaultValue) != -1 ? 'selected' : '') + '> ' + opt.name + '</option>';
                            ;
                        }, this);
                        fltrHtml += '</select>';
                    } else {
                        fltrHtml += '<div class="filter-input">';
                        CoreJs.each(filterDefaultOpt, function (opt) {
                            fltrHtml +=
                                '<label class="checkbox-inline">' +
                                '<input type="checkbox" name="' + inputName + '" value="' + opt.value + '" ' + (filterDefaultValue && $.inArray(opt.value, filterDefaultValue) != -1 ? 'checked' : '') + '> ' + opt.name +
                                '</label>';
                        }, this);
                        fltrHtml += '</div>';
                    }

                    fltrHtml +=
                        '</div>'
                        ;

                    this.filter.innerHTML += fltrHtml;
                }
            }, this);

            this.filter.innerHTML +=
                '<div class="g-filter-btns">' +
                '<a href="#" class="btn btn-primary btn-sm g-btn-filter" style="margin-left: 5px;">' + this.textFilterBtn + '</a>' +
                '<a href="#" class="btn btn-default btn-sm g-btn-filter-reset" style="margin-left: 5px;">' + this.textFilterBtnReset + '</a>' +
                '<div class="g-clearfix"></div>' +
                '</div>' +

                '<div class="g-clearfix"></div>';

            this.el.appendChild(this.filter);
        }

        this.buildTable();

        return this;
    },

    /**
    * Show loading
    * 
    */
    mask: function () {
        if (this.loading)
            this.loading.className = this.loading.className.replace('hide', '');
    },

    /**
    * Hide loading mask
    * 
    */
    unmask: function () {
        if (this.loading)
            this.loading.className = this.loading.className.replace('hide', '') + ' hide';
    },

    /**
    * Builds the table
    * 
    */
    buildTable: function () {
        var thead = tbody = tfoot = '';

        CoreJs.each(this.columns, function (col) {
            var val = col.header,
                cls = '', extra = '';

            if (col.width)
                extra += ' width="' + col.width + '"';

            if (this.sort && col.sortable !== false) {
                cls += 'g-sort';
                val += '&nbsp;<div class="glyphicon glyphicon-chevron-' + (this.sort.dir.toUpperCase() == 'DESC' ? 'down' : 'up') + '"></div>';
                extra += ' index="' + col.index + '"';

                if (this.sort.sort == col.index) {
                    cls += ' g-sorted';
                }
            }
            thead += '<th class="' + cls + '" ' + extra + ' style="' + (col.align ? 'text-align:' + col.align : '') + '">' + val + '</th>';
        }, this);

        var th = $('<thead><tr>' + thead + '</tr></thead>').get(0);
        var tb = document.createElement('tbody');
        var tf = document.createElement('tfoot');

        this.table = document.createElement('table');
        this.table.className = 'table table-striped table-condensed g-table';

        this.table.appendChild(th);
        this.table.appendChild(tb);
        this.table.appendChild(tf);

        this.el.appendChild(this.table);

        var me = this;

        // sort trigger
        if (this.sort) {
            $(this.el).find('.g-sort').click(function (event) {
                event.preventDefault();
                var el = $(this),
                    glyph = el.find('.glyphicon'),
                    dir = '';

                if (el.hasClass('g-sorted') && glyph.hasClass('glyphicon-chevron-up')) {
                    dir = 'DESC';
                } else {
                    dir = 'ASC';
                }

                me.doSort(el.attr('index'), dir);
            });
        }

        // trigger filter
        if (this.enableFilter) {
            // filter form should not be submitted
            $(this.el).find('.g-filter').submit(function (event) {
                event.preventDefault();
            });

            // filter button pressed
            $(this.el).find('.g-btn-filter').click(function (event) {
                event.preventDefault();
                //var val = $(me.el).find('[name="' + me.filterParam + '"]').val();

                // reset checkbox base param
                var input = $(me.el).find('.g-filter input[type="checkbox"]').toArray();
                CoreJs.each(input, function (item) {
                    me.unsetBaseParam($(item).attr('name'));
                }, this);

                var val2 = $(me.el).find('.g-filter').serializeArray();

                var val = {};
                CoreJs.each(val2, function (item) {
                    if (!val[item.name])
                        val[item.name] = item.value;
                    else {
                        if (!CoreJs.isArray(val[item.name])) {
                            var v = val[item.name];
                            val[item.name] = [];
                            val[item.name].push(v);
                        }
                        val[item.name].push(item.value);
                    }
                }, this);

                me.doFilter(val);
            });

            // trigger filter on enter key
            $(this.el).find('.g-input-filter').keyup(function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    $(me.el).find('.g-btn-filter').trigger('click');
                }
            });

            // reset form
            $(this.el).find('.g-btn-filter-reset').click(function (event) {
                event.preventDefault();

                $(me.el).find('.g-filter')[0].reset();
                $(me.el).find('.g-btn-filter').trigger('click');
            });
        }

        if (this.autoLoad)
            this.loadData();
    },

    buildParams: function (extraParams) {
        var me = this,
            params = {
                url: me.url
            };

        if (this.baseParams)
            CoreJs.apply(params, this.baseParams);
        if (this.sort)
            CoreJs.apply(params, this.sort);
        if (extraParams)
            CoreJs.apply(params, extraParams);

        if (this.pageSize) {
            params['limit'] = this.pageSize;
            params['start'] = this.start ? this.start : 0;
        }

        return params;
    },

    /**
    * Loads data from server & generates rows
    * 
    */
    loadData: function () {
        var me = this,
            params = this.buildParams()
            ;

        me.mask();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: me.url + ((me.enableCachePrevention && me.url.indexOf('?') == -1) ? '?' : '&') + '_tt=' + (new Date().getTime()),
            data: params
        }).done(function (data) {
            me.unmask();

            var ok = data ? !CoreJs.isEmpty(data[me.dataResultsParam]) : false;

            if (ok) {
                me.data = data;

                var tbody = tfoot = tr = val = '', k = 0;

                if (!me.data[me.dataResultsParam].length) {
                    tbody = '<tr><td colspan="' + me.columns.length + '"><div class="alert alert-warning alert-medium g-alert">' + me.textNoData + '</div></td></tr>';
                }

                CoreJs.each(me.data[me.dataResultsParam], function (row) {
                    tr = '';
                    var i = 0, v, vv, t;
                    CoreJs.each(me.columns, function (col) {
                        if (col.type == 'action') {
                            val = '', j = 0;
                            if (col.buttons) {
                                CoreJs.each(col.buttons, function (btn) {
                                    t = btn.text;

                                    if (btn.rendererTitle) {
                                        t = btn.rendererTitle(me, k, i, row);
                                        if (t === false) t = '&nbsp;';
                                    }

                                    vv = '&nbsp;<a href="#" row="' + k + '" col="' + i + '" btn="' + j + '" class="btn btn-default btn-xs g-btn ' + (btn.cls ? btn.cls : '') + '">' + t + '</a>';

                                    if (btn.renderer) {
                                        v = btn.renderer(me, k, i, row);
                                        if (v === false)
                                            val += '';
                                        else if (typeof v == 'string')
                                            val += v;
                                        else
                                            val += vv;
                                    } else {
                                        val += vv;
                                    }

                                    j++;
                                }, this);
                            }
                        } else {
                            if (col.renderer) {
                                v = col.renderer(me, k, i, row, row[col.index]);
                                if (v === false)
                                    val = '';
                                else
                                    val = v;
                            } else {
                                val = CoreJs.value(row[col.index], '');
                            }
                        }
                        tr += '<td style="' + (col.align ? 'text-align:' + col.align : '') + '">' + val + '</td>';
                        i++;
                    });
                    tbody += '<tr>' + tr + '</tr>';
                    k++;
                });
            } else {
                var tbody = '<tr><td colspan="' + me.columns.length + '"><div class="alert alert-warning alert-medium g-alert">' + me.textNoData + '</div></td></tr>';
            }

            //me.table.getElementsByTagName('tbody')[0].innerHTML = tbody;
            $(me.table).find('tbody').html(tbody);

            // pagination
            if (me.enablePagination) {
                var nrTotalPages = ok ? (Math.ceil(me.data[me.dataTotalParam] / me.pageSize) || 1) : 1,
                    selectedPageNr = me.start ? (me.start / me.pageSize) : 0;
                selectedPageNr++;

                tfoot = '';
                for (var i = 1; i <= nrTotalPages; i++) {
                    tfoot += '<option value="' + i + '" ' + (i == selectedPageNr ? 'selected' : '') + '>' + i + '</option>';
                }
                tfoot =
                    '<tr>' +
                    '<td colspan="' + me.columns.length + '" style="padding-bottom: 0;">' +
                    '<label style="float: left; margin: 5px 5px 0 0;">' + me.textPage + '</label>' +
                    '<select class="form-control input-sm g-page" style="float: left; width: auto; height: 30px; line-height: 30px; margin-right: 5px;">' + tfoot + '</select>' +
                    '<a href="#" class="btn btn-default btn-sm g-btn-reload" style="float: left;"><div class="glyphicon glyphicon-refresh"></div></a>' +
                    '<label style="float: left; margin: 5px 5px 0 5px;">' + me.textFrom + ' ' + nrTotalPages + '</label>' +
                    '</td>' +
                    '</tr>';

                //me.table.getElementsByTagName('tfoot')[0].innerHTML = tfoot;
                $(me.table).find('tfoot').html(tfoot);

                // pagination trigger
                $(me.table).find('.g-page').change(function () {
                    me.start = me.pageSize * ($(this).val() - 1);
                    me.loadData();
                });

                $(me.table).find('.g-btn-reload').click(function (event) {
                    event.preventDefault();
                    me.loadData();
                });
            }

            // row buttons trigger
            $(me.table).find('.g-btn').click(function (event) {
                event.preventDefault();
                var fn,
                    rIndex = parseInt($(this).attr('row')),
                    cIndex = parseInt($(this).attr('col')),
                    bIndex = parseInt($(this).attr('btn')),
                    col,
                    rowData = null;

                if (typeof cIndex == 'number' && typeof bIndex == 'number') {
                    col = me.columns[cIndex]['buttons'][bIndex];
                    rowData = me.data[me.dataResultsParam][rIndex];
                    if (col && col.handler) {
                        col.handler.call(col.scope || me, me, rIndex, cIndex, rowData);
                    }
                }
            });

            me.fireEvent('load', ok ? me.data[me.dataResultsParam] : null);
        })
            .error(function (data) {
                me.unmask();
                var tbody = '<tr><td colspan="' + me.columns.length + '"><div class="alert alert-warning alert-medium g-alert">' + me.textNoData + '</div></td></tr>';
                $(me.table).find('tbody').html(tbody);
                me.fireEvent('load', null);
            });
    },

    /**
    * Sorts by field & direction (ASC/DESC)
    * 
    * @param field
    * @param dir
    */
    doSort: function (field, dir) {
        var colData,
            dir = dir ? dir.toUpperCase() : 'ASC';

        CoreJs.each(this.columns, function (col) {
            if (col.index == field) {
                colData = col;
                return false;
            }
        }, this);

        if (!colData)
            return;

        var el = $(this.el).find('.g-sort[index="' + field + '"]'),
            glyph = el.find('.glyphicon')
            ;

        if (dir == 'DESC')
            glyph.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        else
            glyph.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');

        $(this.table).find('.g-sort').removeClass('g-sorted');
        el.addClass('g-sorted');

        this.sort.sort = field;
        this.sort.dir = dir;
        this.loadData();
    },

    /**
    * Filter by value
    * 
    * @param q
    */
    doFilter: function (q) {
        if (CoreJs.isObject(q)) {
            CoreJs.iterate(q, function (k, v) {
                this.setBaseParam(k, v);
            }, this);
        } else {
            if (this.filter)
                $(this.el).find('[name="' + this.filterParam + '"]').val(q);

            this.setBaseParam(this.filterParam, q);
        }

        this.loadData();
        this.fireEvent('filter', q, this.data ? this.data[this.dataResultsParam] : null);
    },

    doDownload: function () {
        var me = this,
            params = this.buildParams({ download: true })
            ;

        me.mask();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: me.url + ((me.enableCachePrevention && me.url.indexOf('?') == -1) ? '?' : '&') + '_tt=' + (new Date().getTime()),
            data: params
        }).done(function (data) {
            me.unmask();
            me.fireEvent('download', data);
            if (data.success && data.fileUrl && data.fileUrl.length)
                window.open(data.fileUrl, '_blank');
        }).error(function (data) {
            me.unmask();
            me.fireEvent('download', null);
        });
    },

    setBaseParam: function (paramName, paramValue) {
        this.baseParams[paramName] = paramValue;
    },
    unsetBaseParam: function (paramName) {
        delete this.baseParams[paramName];
    }

});


////////////////////////////////////////////////////////////////////

function date(format, timestamp) {
    //  discuss at: http://phpjs.org/functions/date/
    // original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
    // original by: gettimeofday
    //    parts by: Peter-Paul Koch (http://www.quirksmode.org/js/beat.html)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: MeEtc (http://yass.meetcweb.com)
    // improved by: Brad Touesnard
    // improved by: Tim Wiel
    // improved by: Bryan Elliott
    // improved by: David Randall
    // improved by: Theriault
    // improved by: Theriault
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Theriault
    // improved by: Thomas Beaucourt (http://www.webapp.fr)
    // improved by: JT
    // improved by: Theriault
    // improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // improved by: Theriault
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: majak
    //    input by: Alex
    //    input by: Martin
    //    input by: Alex Wilson
    //    input by: Haravikk
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: majak
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: omid (http://phpjs.org/functions/380:380#comment_137122)
    // bugfixed by: Chris (http://www.devotis.nl/)
    //        note: Uses global: php_js to store the default timezone
    //        note: Although the function potentially allows timezone info (see notes), it currently does not set
    //        note: per a timezone specified by date_default_timezone_set(). Implementers might use
    //        note: this.php_js.currentTimezoneOffset and this.php_js.currentTimezoneDST set by that function
    //        note: in order to adjust the dates in this function (or our other date functions!) accordingly
    //   example 1: date('H:m:s \\m \\i\\s \\m\\o\\n\\t\\h', 1062402400);
    //   returns 1: '09:09:40 m is month'
    //   example 2: date('F j, Y, g:i a', 1062462400);
    //   returns 2: 'September 2, 2003, 2:26 am'
    //   example 3: date('Y W o', 1062462400);
    //   returns 3: '2003 36 2003'
    //   example 4: x = date('Y m d', (new Date()).getTime()/1000);
    //   example 4: (x+'').length == 10 // 2009 01 09
    //   returns 4: true
    //   example 5: date('W', 1104534000);
    //   returns 5: '53'
    //   example 6: date('B t', 1104534000);
    //   returns 6: '999 31'
    //   example 7: date('W U', 1293750000.82); // 2010-12-31
    //   returns 7: '52 1293750000'
    //   example 8: date('W', 1293836400); // 2011-01-01
    //   returns 8: '52'
    //   example 9: date('W Y-m-d', 1293974054); // 2011-01-02
    //   returns 9: '52 2011-01-02'

    var that = this;
    var jsdate, f;
    // Keep this here (works, but for code commented-out below for file size reasons)
    // var tal= [];
    var txt_words = [
        'Sun', 'Mon', 'Tues', 'Wednes', 'Thurs', 'Fri', 'Satur',
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // trailing backslash -> (dropped)
    // a backslash followed by any character (including backslash) -> the character
    // empty string -> empty string
    var formatChr = /\\?(.?)/gi;
    var formatChrCb = function (t, s) {
        return f[t] ? f[t]() : s;
    };
    var _pad = function (n, c) {
        n = String(n);
        while (n.length < c) {
            n = '0' + n;
        }
        return n;
    };
    f = {
        // Day
        d: function () {
            // Day of month w/leading 0; 01..31
            return _pad(f.j(), 2);
        },
        D: function () {
            // Shorthand day name; Mon...Sun
            return f.l()
                .slice(0, 3);
        },
        j: function () {
            // Day of month; 1..31
            return jsdate.getDate();
        },
        l: function () {
            // Full day name; Monday...Sunday
            return txt_words[f.w()] + 'day';
        },
        N: function () {
            // ISO-8601 day of week; 1[Mon]..7[Sun]
            return f.w() || 7;
        },
        S: function () {
            // Ordinal suffix for day of month; st, nd, rd, th
            var j = f.j();
            var i = j % 10;
            if (i <= 3 && parseInt((j % 100) / 10, 10) == 1) {
                i = 0;
            }
            return ['st', 'nd', 'rd'][i - 1] || 'th';
        },
        w: function () {
            // Day of week; 0[Sun]..6[Sat]
            return jsdate.getDay();
        },
        z: function () {
            // Day of year; 0..365
            var a = new Date(f.Y(), f.n() - 1, f.j());
            var b = new Date(f.Y(), 0, 1);
            return Math.round((a - b) / 864e5);
        },

        // Week
        W: function () {
            // ISO-8601 week number
            var a = new Date(f.Y(), f.n() - 1, f.j() - f.N() + 3);
            var b = new Date(a.getFullYear(), 0, 4);
            return _pad(1 + Math.round((a - b) / 864e5 / 7), 2);
        },

        // Month
        F: function () {
            // Full month name; January...December
            return txt_words[6 + f.n()];
        },
        m: function () {
            // Month w/leading 0; 01...12
            return _pad(f.n(), 2);
        },
        M: function () {
            // Shorthand month name; Jan...Dec
            return f.F()
                .slice(0, 3);
        },
        n: function () {
            // Month; 1...12
            return jsdate.getMonth() + 1;
        },
        t: function () {
            // Days in month; 28...31
            return (new Date(f.Y(), f.n(), 0))
                .getDate();
        },

        // Year
        L: function () {
            // Is leap year?; 0 or 1
            var j = f.Y();
            return j % 4 === 0 & j % 100 !== 0 | j % 400 === 0;
        },
        o: function () {
            // ISO-8601 year
            var n = f.n();
            var W = f.W();
            var Y = f.Y();
            return Y + (n === 12 && W < 9 ? 1 : n === 1 && W > 9 ? -1 : 0);
        },
        Y: function () {
            // Full year; e.g. 1980...2010
            return jsdate.getFullYear();
        },
        y: function () {
            // Last two digits of year; 00...99
            return f.Y()
                .toString()
                .slice(-2);
        },

        // Time
        a: function () {
            // am or pm
            return jsdate.getHours() > 11 ? 'pm' : 'am';
        },
        A: function () {
            // AM or PM
            return f.a()
                .toUpperCase();
        },
        B: function () {
            // Swatch Internet time; 000..999
            var H = jsdate.getUTCHours() * 36e2;
            // Hours
            var i = jsdate.getUTCMinutes() * 60;
            // Minutes
            // Seconds
            var s = jsdate.getUTCSeconds();
            return _pad(Math.floor((H + i + s + 36e2) / 86.4) % 1e3, 3);
        },
        g: function () {
            // 12-Hours; 1..12
            return f.G() % 12 || 12;
        },
        G: function () {
            // 24-Hours; 0..23
            return jsdate.getHours();
        },
        h: function () {
            // 12-Hours w/leading 0; 01..12
            return _pad(f.g(), 2);
        },
        H: function () {
            // 24-Hours w/leading 0; 00..23
            return _pad(f.G(), 2);
        },
        i: function () {
            // Minutes w/leading 0; 00..59
            return _pad(jsdate.getMinutes(), 2);
        },
        s: function () {
            // Seconds w/leading 0; 00..59
            return _pad(jsdate.getSeconds(), 2);
        },
        u: function () {
            // Microseconds; 000000-999000
            return _pad(jsdate.getMilliseconds() * 1000, 6);
        },

        // Timezone
        e: function () {
            // Timezone identifier; e.g. Atlantic/Azores, ...
            // The following works, but requires inclusion of the very large
            // timezone_abbreviations_list() function.
            /*              return that.date_default_timezone_get();
             */
            throw 'Not supported (see source code of date() for timezone on how to add support)';
        },
        I: function () {
            // DST observed?; 0 or 1
            // Compares Jan 1 minus Jan 1 UTC to Jul 1 minus Jul 1 UTC.
            // If they are not equal, then DST is observed.
            var a = new Date(f.Y(), 0);
            // Jan 1
            var c = Date.UTC(f.Y(), 0);
            // Jan 1 UTC
            var b = new Date(f.Y(), 6);
            // Jul 1
            // Jul 1 UTC
            var d = Date.UTC(f.Y(), 6);
            return ((a - c) !== (b - d)) ? 1 : 0;
        },
        O: function () {
            // Difference to GMT in hour format; e.g. +0200
            var tzo = jsdate.getTimezoneOffset();
            var a = Math.abs(tzo);
            return (tzo > 0 ? '-' : '+') + _pad(Math.floor(a / 60) * 100 + a % 60, 4);
        },
        P: function () {
            // Difference to GMT w/colon; e.g. +02:00
            var O = f.O();
            return (O.substr(0, 3) + ':' + O.substr(3, 2));
        },
        T: function () {
            // Timezone abbreviation; e.g. EST, MDT, ...
            // The following works, but requires inclusion of the very
            // large timezone_abbreviations_list() function.
            /*              var abbr, i, os, _default;
            if (!tal.length) {
              tal = that.timezone_abbreviations_list();
            }
            if (that.php_js && that.php_js.default_timezone) {
              _default = that.php_js.default_timezone;
              for (abbr in tal) {
                for (i = 0; i < tal[abbr].length; i++) {
                  if (tal[abbr][i].timezone_id === _default) {
                    return abbr.toUpperCase();
                  }
                }
              }
            }
            for (abbr in tal) {
              for (i = 0; i < tal[abbr].length; i++) {
                os = -jsdate.getTimezoneOffset() * 60;
                if (tal[abbr][i].offset === os) {
                  return abbr.toUpperCase();
                }
              }
            }
            */
            return 'UTC';
        },
        Z: function () {
            // Timezone offset in seconds (-43200...50400)
            return -jsdate.getTimezoneOffset() * 60;
        },

        // Full Date/Time
        c: function () {
            // ISO-8601 date.
            return 'Y-m-d\\TH:i:sP'.replace(formatChr, formatChrCb);
        },
        r: function () {
            // RFC 2822
            return 'D, d M Y H:i:s O'.replace(formatChr, formatChrCb);
        },
        U: function () {
            // Seconds since UNIX epoch
            return jsdate / 1000 | 0;
        }
    };
    this.date = function (format, timestamp) {
        that = this;
        jsdate = (timestamp === undefined ? new Date() : // Not provided
            (timestamp instanceof Date) ? new Date(timestamp) : // JS Date()
                new Date(timestamp * 1000) // UNIX timestamp (auto-convert to int)
        );
        return format.replace(formatChr, formatChrCb);
    };
    return this.date(format, timestamp);
}

function strtotime(text, now) {
    //  discuss at: http://phpjs.org/functions/strtotime/
    //     version: 1109.2016
    // original by: Caio Ariede (http://caioariede.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Caio Ariede (http://caioariede.com)
    // improved by: A. Matías Quezada (http://amatiasq.com)
    // improved by: preuter
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Mirko Faber
    //    input by: David
    // bugfixed by: Wagner B. Soares
    // bugfixed by: Artur Tchernychev
    // bugfixed by: Stephan Bösch-Plepelits (http://github.com/plepe)
    //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    //   example 1: strtotime('+1 day', 1129633200);
    //   returns 1: 1129719600
    //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    //   returns 2: 1130425202
    //   example 3: strtotime('last month', 1129633200);
    //   returns 3: 1127041200
    //   example 4: strtotime('2009-05-04 08:30:00 GMT');
    //   returns 4: 1241425800
    //   example 5: strtotime('2009-05-04 08:30:00+00');
    //   returns 5: 1241425800
    //   example 6: strtotime('2009-05-04 08:30:00+02:00');
    //   returns 6: 1241418600
    //   example 7: strtotime('2009-05-04T08:30:00Z');
    //   returns 7: 1241425800

    var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

    if (!text) {
        return fail;
    }

    // Unecessary spaces
    text = text.replace(/^\s+|\s+$/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/[\t\r\n]/g, '')
        .toLowerCase();

    // in contrast to php, js Date.parse function interprets:
    // dates given as yyyy-mm-dd as in timezone: UTC,
    // dates with "." or "-" as MDY instead of DMY
    // dates with two-digit years differently
    // etc...etc...
    // ...therefore we manually parse lots of common date formats
    match = text.match(
        /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

    if (match && match[2] === match[4]) {
        if (match[1] > 1901) {
            switch (match[2]) {
                case '-': {
                    // YYYY-M-D
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // YYYY.M.D is not parsed by strtotime()
                    return fail;
                }
                case '/': {
                    // YYYY/M/D
                    if (match[3] > 12 || match[5] > 31) {
                        return fail;
                    }

                    return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
            }
        } else if (match[5] > 1901) {
            switch (match[2]) {
                case '-': {
                    // D-M-YYYY
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // D.M.YYYY
                    if (match[3] > 12 || match[1] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '/': {
                    // M/D/YYYY
                    if (match[1] > 12 || match[3] > 31) {
                        return fail;
                    }

                    return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
            }
        } else {
            switch (match[2]) {
                case '-': {
                    // YY-M-D
                    if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
                        return fail;
                    }

                    year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
                    return new Date(year, parseInt(match[3], 10) - 1, match[5],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case '.': {
                    // D.M.YY or H.MM.SS
                    if (match[5] >= 70) {
                        // D.M.YY
                        if (match[3] > 12 || match[1] > 31) {
                            return fail;
                        }

                        return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                            match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                    }
                    if (match[5] < 60 && !match[6]) {
                        // H.MM.SS
                        if (match[1] > 23 || match[3] > 59) {
                            return fail;
                        }

                        today = new Date();
                        return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                            match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
                    }

                    // invalid format, cannot be parsed
                    return fail;
                }
                case '/': {
                    // M/D/YY
                    if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
                        return fail;
                    }

                    year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
                    return new Date(year, parseInt(match[1], 10) - 1, match[3],
                        match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
                }
                case ':': {
                    // HH:MM:SS
                    if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
                        return fail;
                    }

                    today = new Date();
                    return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                        match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
                }
            }
        }
    }

    // other formats and "now" should be parsed by Date.parse()
    if (text === 'now') {
        return now === null || isNaN(now) ? new Date()
            .getTime() / 1000 | 0 : now | 0;
    }
    if (!isNaN(parsed = Date.parse(text))) {
        return parsed / 1000 | 0;
    }
    // Browsers != Chrome have problems parsing ISO 8601 date strings, as they do
    // not accept lower case characters, space, or shortened time zones.
    // Therefore, fix these problems and try again.
    // Examples:
    //   2015-04-15 20:33:59+02
    //   2015-04-15 20:33:59z
    //   2015-04-15t20:33:59+02:00
    if (match = text.match(
        /^([0-9]{4}-[0-9]{2}-[0-9]{2})[ t]([0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]+)?)([\+-][0-9]{2}(:[0-9]{2})?|z)/)) {
        // fix time zone information
        if (match[4] == 'z') {
            match[4] = 'Z';
        } else if (match[4].match(/^([\+-][0-9]{2})$/)) {
            match[4] = match[4] + ':00';
        }

        if (!isNaN(parsed = Date.parse(match[1] + 'T' + match[2] + match[4]))) {
            return parsed / 1000 | 0;
        }
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
        'sun': 0,
        'mon': 1,
        'tue': 2,
        'wed': 3,
        'thu': 4,
        'fri': 5,
        'sat': 6
    };
    ranges = {
        'yea': 'FullYear',
        'mon': 'Month',
        'day': 'Date',
        'hou': 'Hours',
        'min': 'Minutes',
        'sec': 'Seconds'
    };

    function lastNext(type, range, modifier) {
        var diff, day = days[range];

        if (typeof day !== 'undefined') {
            diff = day - date.getDay();

            if (diff === 0) {
                diff = 7 * modifier;
            } else if (diff > 0 && type === 'last') {
                diff -= 7;
            } else if (diff < 0 && type === 'next') {
                diff += 7;
            }

            date.setDate(date.getDate() + diff);
        }
    }

    function process(val) {
        var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
            type = splt[0],
            range = splt[1].substring(0, 3),
            typeIsNumber = /\d+/.test(type),
            ago = splt[2] === 'ago',
            num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

        if (typeIsNumber) {
            num *= parseInt(type, 10);
        }

        if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
            return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
        }

        if (range === 'wee') {
            return date.setDate(date.getDate() + (num * 7));
        }

        if (type === 'next' || type === 'last') {
            lastNext(type, range, num);
        } else if (!typeIsNumber) {
            return false;
        }

        return true;
    }

    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
        '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
        '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

    match = text.match(new RegExp(regex, 'gi'));
    if (!match) {
        return fail;
    }

    for (i = 0, len = match.length; i < len; i++) {
        if (!process(match[i])) {
            return fail;
        }
    }

    // ECMAScript 5 only
    // if (!match.every(process))
    //    return false;

    return (date.getTime() / 1000);
}

////////////////////////////////////////////////////////////////////

// handle ajax form submit
$(document).on('submit', '.core-js-form-ajax', function (e) {
    e.preventDefault();

    var me = $(this),
        formResetOnSuccess = false,
        message = me.find('.message'), // get message tag
        loading = me.find('.loading'), // get loading tag
        errorFieldGroup,
        errorField
        ;

    // reset errors if they were set before (from a previous form submit)
    if (loading) loading.show(); // show loading
    message.empty().hide(); // reset main message
    me.find('.form-group').removeClass('has-error'); // remove error class from field group
    me.find('.field-error').empty().hide(); // remove individual errors

    // set it to the server
    //$.ajax({
    me.ajaxSubmit({
        url: me.attr('form_url'), // set url to the block url
        data: me.serializeArray(), // set params from form
        type: 'POST', // send params as POST params
        dataType: 'json', // identify server response as json
        success: function (response) {
            if (!response) return;

            // close window on success
            if (response.success && parseInt(me.attr('form_submit_close'))) {
                me.closest('.ui-dialog-content').dialog('close');
                return;
            }

            // disable loading
            if (loading) loading.hide();

            // if it's successfull
            if (response.success) {
                // set the main message
                if (response.message && response.message.length)
                    message.removeClass('alert-danger').addClass('alert-success').html(response.message).show();

                // reset the form fields to the initial values
                if (formResetOnSuccess)
                    me.resetForm();
            } else { // we have errors => we need to display them
                // set the main message
                if (response.message && response.message.length)
                    message.removeClass('alert-success').addClass('alert-danger').html(response.message).show();

                // set individual errors
                if (response.errors) {

                    // loop through errors and set them
                    $.each(response.errors, function (k, v) {
                        // find the input group -> find the input name then move to the parent tag that has the class "form-group"
                        errorFieldGroup = me.find('[name="' + k + '"]').closest('.form-group');

                        // get the error block where we will actually display the individual field errors
                        errorField = errorFieldGroup.find('.field-error');

                        if (errorFieldGroup) // mark group as error (will change the style of the input in red, add red borders)
                            errorFieldGroup.addClass('has-error');

                        if (errorField) // set errors (they come in an array because they might be more than one for the same field)
                            errorField.html('- ' + v.join('<br />- ')).show();
                    });
                }
            }

            if (response.record) {
                //record
                $.each(response.record, function (k, v) {
                    me.find('[name="' + k + '"]').val(v);
                });
            }

            if (response.success && me.attr('form_success') && window[me.attr('form_success')]) {
                window[me.attr('form_success')](me, response);
            } else if (!response.success && me.attr('form_fail') && window[me.attr('form_fail')]) {
                window[me.attr('form_fail')](me, response);
            }
        },
        error: function (response) {
            // disable loading
            if (loading) loading.hide();

            if (me.attr('form_error') && window[me.attr('form_error')]) {
                window[me.attr('form_error')](me, response);
            }
        }

        // always return false to stop the normal form submition which would otherwise reload the page
        //return false;
    });
});

// trigger form submit
$(document).on('click', '[form_submit]:not(form)', function (e) {
    e.preventDefault();
    var me = $(this),
        form = $('#' + me.attr('form_submit'))
        ;

    if (form && form.length) {
        form.attr('form_submit_close', 0);
        form.submit();
    }
});

// trigger form submit & close
$(document).on('click', '[form_submit_close]:not(form)', function (e) {
    e.preventDefault();
    var me = $(this),
        form = $('#' + me.attr('form_submit_close'))
        ;

    if (form && form.length) {
        form.attr('form_submit_close', 1);
        form.submit();
    }
});

(function () { var a = this, b = a._, c = {}, d = Array.prototype, e = Object.prototype, f = Function.prototype, g = d.push, h = d.slice, i = d.concat, j = e.toString, k = e.hasOwnProperty, l = d.forEach, m = d.map, n = d.reduce, o = d.reduceRight, p = d.filter, q = d.every, r = d.some, s = d.indexOf, t = d.lastIndexOf, u = Array.isArray, v = Object.keys, w = f.bind, x = function (a) { return a instanceof x ? a : this instanceof x ? void (this._wrapped = a) : new x(a) }; "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = x), exports._ = x) : a._ = x, x.VERSION = "1.6.0"; var y = x.each = x.forEach = function (a, b, d) { if (null == a) return a; if (l && a.forEach === l) a.forEach(b, d); else if (a.length === +a.length) { for (var e = 0, f = a.length; f > e; e++)if (b.call(d, a[e], e, a) === c) return } else for (var g = x.keys(a), e = 0, f = g.length; f > e; e++)if (b.call(d, a[g[e]], g[e], a) === c) return; return a }; x.map = x.collect = function (a, b, c) { var d = []; return null == a ? d : m && a.map === m ? a.map(b, c) : (y(a, function (a, e, f) { d.push(b.call(c, a, e, f)) }), d) }; var z = "Reduce of empty array with no initial value"; x.reduce = x.foldl = x.inject = function (a, b, c, d) { var e = arguments.length > 2; if (null == a && (a = []), n && a.reduce === n) return d && (b = x.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b); if (y(a, function (a, f, g) { e ? c = b.call(d, c, a, f, g) : (c = a, e = !0) }), !e) throw new TypeError(z); return c }, x.reduceRight = x.foldr = function (a, b, c, d) { var e = arguments.length > 2; if (null == a && (a = []), o && a.reduceRight === o) return d && (b = x.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b); var f = a.length; if (f !== +f) { var g = x.keys(a); f = g.length } if (y(a, function (h, i, j) { i = g ? g[--f] : --f, e ? c = b.call(d, c, a[i], i, j) : (c = a[i], e = !0) }), !e) throw new TypeError(z); return c }, x.find = x.detect = function (a, b, c) { var d; return A(a, function (a, e, f) { return b.call(c, a, e, f) ? (d = a, !0) : void 0 }), d }, x.filter = x.select = function (a, b, c) { var d = []; return null == a ? d : p && a.filter === p ? a.filter(b, c) : (y(a, function (a, e, f) { b.call(c, a, e, f) && d.push(a) }), d) }, x.reject = function (a, b, c) { return x.filter(a, function (a, d, e) { return !b.call(c, a, d, e) }, c) }, x.every = x.all = function (a, b, d) { b || (b = x.identity); var e = !0; return null == a ? e : q && a.every === q ? a.every(b, d) : (y(a, function (a, f, g) { return (e = e && b.call(d, a, f, g)) ? void 0 : c }), !!e) }; var A = x.some = x.any = function (a, b, d) { b || (b = x.identity); var e = !1; return null == a ? e : r && a.some === r ? a.some(b, d) : (y(a, function (a, f, g) { return e || (e = b.call(d, a, f, g)) ? c : void 0 }), !!e) }; x.contains = x.include = function (a, b) { return null == a ? !1 : s && a.indexOf === s ? -1 != a.indexOf(b) : A(a, function (a) { return a === b }) }, x.invoke = function (a, b) { var c = h.call(arguments, 2), d = x.isFunction(b); return x.map(a, function (a) { return (d ? b : a[b]).apply(a, c) }) }, x.pluck = function (a, b) { return x.map(a, x.property(b)) }, x.where = function (a, b) { return x.filter(a, x.matches(b)) }, x.findWhere = function (a, b) { return x.find(a, x.matches(b)) }, x.max = function (a, b, c) { if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535) return Math.max.apply(Math, a); var d = -(1 / 0), e = -(1 / 0); return y(a, function (a, f, g) { var h = b ? b.call(c, a, f, g) : a; h > e && (d = a, e = h) }), d }, x.min = function (a, b, c) { if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535) return Math.min.apply(Math, a); var d = 1 / 0, e = 1 / 0; return y(a, function (a, f, g) { var h = b ? b.call(c, a, f, g) : a; e > h && (d = a, e = h) }), d }, x.shuffle = function (a) { var b, c = 0, d = []; return y(a, function (a) { b = x.random(c++), d[c - 1] = d[b], d[b] = a }), d }, x.sample = function (a, b, c) { return null == b || c ? (a.length !== +a.length && (a = x.values(a)), a[x.random(a.length - 1)]) : x.shuffle(a).slice(0, Math.max(0, b)) }; var B = function (a) { return null == a ? x.identity : x.isFunction(a) ? a : x.property(a) }; x.sortBy = function (a, b, c) { return b = B(b), x.pluck(x.map(a, function (a, d, e) { return { value: a, index: d, criteria: b.call(c, a, d, e) } }).sort(function (a, b) { var c = a.criteria, d = b.criteria; if (c !== d) { if (c > d || void 0 === c) return 1; if (d > c || void 0 === d) return -1 } return a.index - b.index }), "value") }; var C = function (a) { return function (b, c, d) { var e = {}; return c = B(c), y(b, function (f, g) { var h = c.call(d, f, g, b); a(e, h, f) }), e } }; x.groupBy = C(function (a, b, c) { x.has(a, b) ? a[b].push(c) : a[b] = [c] }), x.indexBy = C(function (a, b, c) { a[b] = c }), x.countBy = C(function (a, b) { x.has(a, b) ? a[b]++ : a[b] = 1 }), x.sortedIndex = function (a, b, c, d) { c = B(c); for (var e = c.call(d, b), f = 0, g = a.length; g > f;) { var h = f + g >>> 1; c.call(d, a[h]) < e ? f = h + 1 : g = h } return f }, x.toArray = function (a) { return a ? x.isArray(a) ? h.call(a) : a.length === +a.length ? x.map(a, x.identity) : x.values(a) : [] }, x.size = function (a) { return null == a ? 0 : a.length === +a.length ? a.length : x.keys(a).length }, x.first = x.head = x.take = function (a, b, c) { return null == a ? void 0 : null == b || c ? a[0] : 0 > b ? [] : h.call(a, 0, b) }, x.initial = function (a, b, c) { return h.call(a, 0, a.length - (null == b || c ? 1 : b)) }, x.last = function (a, b, c) { return null == a ? void 0 : null == b || c ? a[a.length - 1] : h.call(a, Math.max(a.length - b, 0)) }, x.rest = x.tail = x.drop = function (a, b, c) { return h.call(a, null == b || c ? 1 : b) }, x.compact = function (a) { return x.filter(a, x.identity) }; var D = function (a, b, c) { return b && x.every(a, x.isArray) ? i.apply(c, a) : (y(a, function (a) { x.isArray(a) || x.isArguments(a) ? b ? g.apply(c, a) : D(a, b, c) : c.push(a) }), c) }; x.flatten = function (a, b) { return D(a, b, []) }, x.without = function (a) { return x.difference(a, h.call(arguments, 1)) }, x.partition = function (a, b) { var c = [], d = []; return y(a, function (a) { (b(a) ? c : d).push(a) }), [c, d] }, x.uniq = x.unique = function (a, b, c, d) { x.isFunction(b) && (d = c, c = b, b = !1); var e = c ? x.map(a, c, d) : a, f = [], g = []; return y(e, function (c, d) { (b ? d && g[g.length - 1] === c : x.contains(g, c)) || (g.push(c), f.push(a[d])) }), f }, x.union = function () { return x.uniq(x.flatten(arguments, !0)) }, x.intersection = function (a) { var b = h.call(arguments, 1); return x.filter(x.uniq(a), function (a) { return x.every(b, function (b) { return x.contains(b, a) }) }) }, x.difference = function (a) { var b = i.apply(d, h.call(arguments, 1)); return x.filter(a, function (a) { return !x.contains(b, a) }) }, x.zip = function () { for (var a = x.max(x.pluck(arguments, "length").concat(0)), b = new Array(a), c = 0; a > c; c++)b[c] = x.pluck(arguments, "" + c); return b }, x.object = function (a, b) { if (null == a) return {}; for (var c = {}, d = 0, e = a.length; e > d; d++)b ? c[a[d]] = b[d] : c[a[d][0]] = a[d][1]; return c }, x.indexOf = function (a, b, c) { if (null == a) return -1; var d = 0, e = a.length; if (c) { if ("number" != typeof c) return d = x.sortedIndex(a, b), a[d] === b ? d : -1; d = 0 > c ? Math.max(0, e + c) : c } if (s && a.indexOf === s) return a.indexOf(b, c); for (; e > d; d++)if (a[d] === b) return d; return -1 }, x.lastIndexOf = function (a, b, c) { if (null == a) return -1; var d = null != c; if (t && a.lastIndexOf === t) return d ? a.lastIndexOf(b, c) : a.lastIndexOf(b); for (var e = d ? c : a.length; e--;)if (a[e] === b) return e; return -1 }, x.range = function (a, b, c) { arguments.length <= 1 && (b = a || 0, a = 0), c = arguments[2] || 1; for (var d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = new Array(d); d > e;)f[e++] = a, a += c; return f }; var E = function () { }; x.bind = function (a, b) { var c, d; if (w && a.bind === w) return w.apply(a, h.call(arguments, 1)); if (!x.isFunction(a)) throw new TypeError; return c = h.call(arguments, 2), d = function () { if (!(this instanceof d)) return a.apply(b, c.concat(h.call(arguments))); E.prototype = a.prototype; var e = new E; E.prototype = null; var f = a.apply(e, c.concat(h.call(arguments))); return Object(f) === f ? f : e } }, x.partial = function (a) { var b = h.call(arguments, 1); return function () { for (var c = 0, d = b.slice(), e = 0, f = d.length; f > e; e++)d[e] === x && (d[e] = arguments[c++]); for (; c < arguments.length;)d.push(arguments[c++]); return a.apply(this, d) } }, x.bindAll = function (a) { var b = h.call(arguments, 1); if (0 === b.length) throw new Error("bindAll must be passed function names"); return y(b, function (b) { a[b] = x.bind(a[b], a) }), a }, x.memoize = function (a, b) { var c = {}; return b || (b = x.identity), function () { var d = b.apply(this, arguments); return x.has(c, d) ? c[d] : c[d] = a.apply(this, arguments) } }, x.delay = function (a, b) { var c = h.call(arguments, 2); return setTimeout(function () { return a.apply(null, c) }, b) }, x.defer = function (a) { return x.delay.apply(x, [a, 1].concat(h.call(arguments, 1))) }, x.throttle = function (a, b, c) { var d, e, f, g = null, h = 0; c || (c = {}); var i = function () { h = c.leading === !1 ? 0 : x.now(), g = null, f = a.apply(d, e), d = e = null }; return function () { var j = x.now(); h || c.leading !== !1 || (h = j); var k = b - (j - h); return d = this, e = arguments, 0 >= k ? (clearTimeout(g), g = null, h = j, f = a.apply(d, e), d = e = null) : g || c.trailing === !1 || (g = setTimeout(i, k)), f } }, x.debounce = function (a, b, c) { var d, e, f, g, h, i = function () { var j = x.now() - g; b > j ? d = setTimeout(i, b - j) : (d = null, c || (h = a.apply(f, e), f = e = null)) }; return function () { f = this, e = arguments, g = x.now(); var j = c && !d; return d || (d = setTimeout(i, b)), j && (h = a.apply(f, e), f = e = null), h } }, x.once = function (a) { var b, c = !1; return function () { return c ? b : (c = !0, b = a.apply(this, arguments), a = null, b) } }, x.wrap = function (a, b) { return x.partial(b, a) }, x.compose = function () { var a = arguments; return function () { for (var b = arguments, c = a.length - 1; c >= 0; c--)b = [a[c].apply(this, b)]; return b[0] } }, x.after = function (a, b) { return function () { return --a < 1 ? b.apply(this, arguments) : void 0 } }, x.keys = function (a) { if (!x.isObject(a)) return []; if (v) return v(a); var b = []; for (var c in a) x.has(a, c) && b.push(c); return b }, x.values = function (a) { for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)d[e] = a[b[e]]; return d }, x.pairs = function (a) { for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)d[e] = [b[e], a[b[e]]]; return d }, x.invert = function (a) { for (var b = {}, c = x.keys(a), d = 0, e = c.length; e > d; d++)b[a[c[d]]] = c[d]; return b }, x.functions = x.methods = function (a) { var b = []; for (var c in a) x.isFunction(a[c]) && b.push(c); return b.sort() }, x.extend = function (a) { return y(h.call(arguments, 1), function (b) { if (b) for (var c in b) a[c] = b[c] }), a }, x.pick = function (a) { var b = {}, c = i.apply(d, h.call(arguments, 1)); return y(c, function (c) { c in a && (b[c] = a[c]) }), b }, x.omit = function (a) { var b = {}, c = i.apply(d, h.call(arguments, 1)); for (var e in a) x.contains(c, e) || (b[e] = a[e]); return b }, x.defaults = function (a) { return y(h.call(arguments, 1), function (b) { if (b) for (var c in b) void 0 === a[c] && (a[c] = b[c]) }), a }, x.clone = function (a) { return x.isObject(a) ? x.isArray(a) ? a.slice() : x.extend({}, a) : a }, x.tap = function (a, b) { return b(a), a }; var F = function (a, b, c, d) { if (a === b) return 0 !== a || 1 / a == 1 / b; if (null == a || null == b) return a === b; a instanceof x && (a = a._wrapped), b instanceof x && (b = b._wrapped); var e = j.call(a); if (e != j.call(b)) return !1; switch (e) { case "[object String]": return a == String(b); case "[object Number]": return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b; case "[object Date]": case "[object Boolean]": return +a == +b; case "[object RegExp]": return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase }if ("object" != typeof a || "object" != typeof b) return !1; for (var f = c.length; f--;)if (c[f] == a) return d[f] == b; var g = a.constructor, h = b.constructor; if (g !== h && !(x.isFunction(g) && g instanceof g && x.isFunction(h) && h instanceof h) && "constructor" in a && "constructor" in b) return !1; c.push(a), d.push(b); var i = 0, k = !0; if ("[object Array]" == e) { if (i = a.length, k = i == b.length) for (; i-- && (k = F(a[i], b[i], c, d));); } else { for (var l in a) if (x.has(a, l) && (i++, !(k = x.has(b, l) && F(a[l], b[l], c, d)))) break; if (k) { for (l in b) if (x.has(b, l) && !i--) break; k = !i } } return c.pop(), d.pop(), k }; x.isEqual = function (a, b) { return F(a, b, [], []) }, x.isEmpty = function (a) { if (null == a) return !0; if (x.isArray(a) || x.isString(a)) return 0 === a.length; for (var b in a) if (x.has(a, b)) return !1; return !0 }, x.isElement = function (a) { return !(!a || 1 !== a.nodeType) }, x.isArray = u || function (a) { return "[object Array]" == j.call(a) }, x.isObject = function (a) { return a === Object(a) }, y(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (a) { x["is" + a] = function (b) { return j.call(b) == "[object " + a + "]" } }), x.isArguments(arguments) || (x.isArguments = function (a) { return !(!a || !x.has(a, "callee")) }), "function" != typeof /./ && (x.isFunction = function (a) { return "function" == typeof a }), x.isFinite = function (a) { return isFinite(a) && !isNaN(parseFloat(a)) }, x.isNaN = function (a) { return x.isNumber(a) && a != +a }, x.isBoolean = function (a) { return a === !0 || a === !1 || "[object Boolean]" == j.call(a) }, x.isNull = function (a) { return null === a }, x.isUndefined = function (a) { return void 0 === a }, x.has = function (a, b) { return k.call(a, b) }, x.noConflict = function () { return a._ = b, this }, x.identity = function (a) { return a }, x.constant = function (a) { return function () { return a } }, x.property = function (a) { return function (b) { return b[a] } }, x.matches = function (a) { return function (b) { if (b === a) return !0; for (var c in a) if (a[c] !== b[c]) return !1; return !0 } }, x.times = function (a, b, c) { for (var d = Array(Math.max(0, a)), e = 0; a > e; e++)d[e] = b.call(c, e); return d }, x.random = function (a, b) { return null == b && (b = a, a = 0), a + Math.floor(Math.random() * (b - a + 1)) }, x.now = Date.now || function () { return (new Date).getTime() }; var G = { escape: { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" } }; G.unescape = x.invert(G.escape); var H = { escape: new RegExp("[" + x.keys(G.escape).join("") + "]", "g"), unescape: new RegExp("(" + x.keys(G.unescape).join("|") + ")", "g") }; x.each(["escape", "unescape"], function (a) { x[a] = function (b) { return null == b ? "" : ("" + b).replace(H[a], function (b) { return G[a][b] }) } }), x.result = function (a, b) { if (null == a) return void 0; var c = a[b]; return x.isFunction(c) ? c.call(a) : c }, x.mixin = function (a) { y(x.functions(a), function (b) { var c = x[b] = a[b]; x.prototype[b] = function () { var a = [this._wrapped]; return g.apply(a, arguments), M.call(this, c.apply(x, a)) } }) }; var I = 0; x.uniqueId = function (a) { var b = ++I + ""; return a ? a + b : b }, x.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var J = /(.)^/, K = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "	": "t", "\u2028": "u2028", "\u2029": "u2029" }, L = /\\|'|\r|\n|\t|\u2028|\u2029/g; x.template = function (a, b, c) { var d; c = x.defaults({}, c, x.templateSettings); var e = new RegExp([(c.escape || J).source, (c.interpolate || J).source, (c.evaluate || J).source].join("|") + "|$", "g"), f = 0, g = "__p+='"; a.replace(e, function (b, c, d, e, h) { return g += a.slice(f, h).replace(L, function (a) { return "\\" + K[a] }), c && (g += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'"), d && (g += "'+\n((__t=(" + d + "))==null?'':__t)+\n'"), e && (g += "';\n" + e + "\n__p+='"), f = h + b.length, b }), g += "';\n", c.variable || (g = "with(obj||{}){\n" + g + "}\n"), g = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + g + "return __p;\n"; try { d = new Function(c.variable || "obj", "_", g) } catch (h) { throw h.source = g, h } if (b) return d(b, x); var i = function (a) { return d.call(this, a, x) }; return i.source = "function(" + (c.variable || "obj") + "){\n" + g + "}", i }, x.chain = function (a) { return x(a).chain() }; var M = function (a) { return this._chain ? x(a).chain() : a }; x.mixin(x), y(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (a) { var b = d[a]; x.prototype[a] = function () { var c = this._wrapped; return b.apply(c, arguments), "shift" != a && "splice" != a || 0 !== c.length || delete c[0], M.call(this, c) } }), y(["concat", "join", "slice"], function (a) { var b = d[a]; x.prototype[a] = function () { return M.call(this, b.apply(this._wrapped, arguments)) } }), x.extend(x.prototype, { chain: function () { return this._chain = !0, this }, value: function () { return this._wrapped } }), "function" == typeof define && define.amd && define("underscore", [], function () { return x }) }).call(this);

