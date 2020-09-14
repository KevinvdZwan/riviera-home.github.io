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
 * Isotope PACKAGED v3.0.1
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2016 Metafizzy
 */
(function (window, factory) { 'use strict'; if (typeof define == 'function' && define.amd) { define('jquery-bridget/jquery-bridget', ['jquery'], function (jQuery) { factory(window, jQuery); }); } else if (typeof module == 'object' && module.exports) { module.exports = factory(window, require('jquery')); } else { window.jQueryBridget = factory(window, window.jQuery); } }(window, function factory(window, jQuery) {
   'use strict'; var arraySlice = Array.prototype.slice; var console = window.console; var logError = typeof console == 'undefined' ? function () { } : function (message) { console.error(message); }; function jQueryBridget(namespace, PluginClass, $) {
      $ = $ || jQuery || window.jQuery; if (!$) { return; }
      if (!PluginClass.prototype.option) {
         PluginClass.prototype.option = function (opts) {
            if (!$.isPlainObject(opts)) { return; }
            this.options = $.extend(true, this.options, opts);
         };
      }
      $.fn[namespace] = function (arg0) {
         if (typeof arg0 == 'string') { var args = arraySlice.call(arguments, 1); return methodCall(this, arg0, args); }
         plainCall(this, arg0); return this;
      }; function methodCall($elems, methodName, args) {
         var returnValue; var pluginMethodStr = '$().' + namespace + '("' + methodName + '")'; $elems.each(function (i, elem) {
            var instance = $.data(elem, namespace); if (!instance) {
               logError(namespace + ' not initialized. Cannot call methods, i.e. ' +
                  pluginMethodStr); return;
            }
            var method = instance[methodName]; if (!method || methodName.charAt(0) == '_') { logError(pluginMethodStr + ' is not a valid method'); return; }
            var value = method.apply(instance, args); returnValue = returnValue === undefined ? value : returnValue;
         }); return returnValue !== undefined ? returnValue : $elems;
      }
      function plainCall($elems, options) { $elems.each(function (i, elem) { var instance = $.data(elem, namespace); if (instance) { instance.option(options); instance._init(); } else { instance = new PluginClass(elem, options); $.data(elem, namespace, instance); } }); }
      updateJQuery($);
   }
   function updateJQuery($) {
      if (!$ || ($ && $.bridget)) { return; }
      $.bridget = jQueryBridget;
   }
   updateJQuery(jQuery || window.jQuery); return jQueryBridget;
})); (function (global, factory) { if (typeof define == 'function' && define.amd) { define('ev-emitter/ev-emitter', factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(); } else { global.EvEmitter = factory(); } }(typeof window != 'undefined' ? window : this, function () {
   function EvEmitter() { }
   var proto = EvEmitter.prototype; proto.on = function (eventName, listener) {
      if (!eventName || !listener) { return; }
      var events = this._events = this._events || {}; var listeners = events[eventName] = events[eventName] || []; if (listeners.indexOf(listener) == -1) { listeners.push(listener); }
      return this;
   }; proto.once = function (eventName, listener) {
      if (!eventName || !listener) { return; }
      this.on(eventName, listener); var onceEvents = this._onceEvents = this._onceEvents || {}; var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {}; onceListeners[listener] = true; return this;
   }; proto.off = function (eventName, listener) {
      var listeners = this._events && this._events[eventName]; if (!listeners || !listeners.length) { return; }
      var index = listeners.indexOf(listener); if (index != -1) { listeners.splice(index, 1); }
      return this;
   }; proto.emitEvent = function (eventName, args) {
      var listeners = this._events && this._events[eventName]; if (!listeners || !listeners.length) { return; }
      var i = 0; var listener = listeners[i]; args = args || []; var onceListeners = this._onceEvents && this._onceEvents[eventName]; while (listener) {
         var isOnce = onceListeners && onceListeners[listener]; if (isOnce) { this.off(eventName, listener); delete onceListeners[listener]; }
         listener.apply(this, args); i += isOnce ? 0 : 1; listener = listeners[i];
      }
      return this;
   }; return EvEmitter;
}));
/*!
 * getSize v2.0.2
 * measure size of elements
 * MIT license
 */
(function (window, factory) { 'use strict'; if (typeof define == 'function' && define.amd) { define('get-size/get-size', [], function () { return factory(); }); } else if (typeof module == 'object' && module.exports) { module.exports = factory(); } else { window.getSize = factory(); } })(window, function factory() {
   'use strict'; function getStyleSize(value) { var num = parseFloat(value); var isValid = value.indexOf('%') == -1 && !isNaN(num); return isValid && num; }
   function noop() { }
   var logError = typeof console == 'undefined' ? noop : function (message) { console.error(message); }; var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth']; var measurementsLength = measurements.length; function getZeroSize() {
      var size = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 }; for (var i = 0; i < measurementsLength; i++) { var measurement = measurements[i]; size[measurement] = 0; }
      return size;
   }
   function getStyle(elem) {
      var style = getComputedStyle(elem); if (!style) { logError('Style returned ' + style + '. Are you running this code in a hidden iframe on Firefox? ' + 'See http://bit.ly/getsizebug1'); }
      return style;
   }
   var isSetup = false; var isBoxSizeOuter; function setup() {
      if (isSetup) { return; }
      isSetup = true; var div = document.createElement('div'); div.style.width = '200px'; div.style.padding = '1px 2px 3px 4px'; div.style.borderStyle = 'solid'; div.style.borderWidth = '1px 2px 3px 4px'; div.style.boxSizing = 'border-box'; var body = document.body || document.documentElement; body.appendChild(div); var style = getStyle(div); getSize.isBoxSizeOuter = isBoxSizeOuter = getStyleSize(style.width) == 200; body.removeChild(div);
   }
   function getSize(elem) {
      setup(); if (typeof elem == 'string') { elem = document.querySelector(elem); }
      if (!elem || typeof elem != 'object' || !elem.nodeType) { return; }
      var style = getStyle(elem); if (style.display == 'none') { return getZeroSize(); }
      var size = {}; size.width = elem.offsetWidth; size.height = elem.offsetHeight; var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box'; for (var i = 0; i < measurementsLength; i++) { var measurement = measurements[i]; var value = style[measurement]; var num = parseFloat(value); size[measurement] = !isNaN(num) ? num : 0; }
      var paddingWidth = size.paddingLeft + size.paddingRight; var paddingHeight = size.paddingTop + size.paddingBottom; var marginWidth = size.marginLeft + size.marginRight; var marginHeight = size.marginTop + size.marginBottom; var borderWidth = size.borderLeftWidth + size.borderRightWidth; var borderHeight = size.borderTopWidth + size.borderBottomWidth; var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter; var styleWidth = getStyleSize(style.width); if (styleWidth !== false) {
         size.width = styleWidth +
            (isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
      }
      var styleHeight = getStyleSize(style.height); if (styleHeight !== false) {
         size.height = styleHeight +
            (isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
      }
      size.innerWidth = size.width - (paddingWidth + borderWidth); size.innerHeight = size.height - (paddingHeight + borderHeight); size.outerWidth = size.width + marginWidth; size.outerHeight = size.height + marginHeight; return size;
   }
   return getSize;
}); (function (window, factory) { 'use strict'; if (typeof define == 'function' && define.amd) { define('desandro-matches-selector/matches-selector', factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(); } else { window.matchesSelector = factory(); } }(window, function factory() {
   'use strict'; var matchesMethod = (function () {
      var ElemProto = Element.prototype; if (ElemProto.matches) { return 'matches'; }
      if (ElemProto.matchesSelector) { return 'matchesSelector'; }
      var prefixes = ['webkit', 'moz', 'ms', 'o']; for (var i = 0; i < prefixes.length; i++) { var prefix = prefixes[i]; var method = prefix + 'MatchesSelector'; if (ElemProto[method]) { return method; } }
   })(); return function matchesSelector(elem, selector) { return elem[matchesMethod](selector); };
})); (function (window, factory) { if (typeof define == 'function' && define.amd) { define('fizzy-ui-utils/utils', ['desandro-matches-selector/matches-selector'], function (matchesSelector) { return factory(window, matchesSelector); }); } else if (typeof module == 'object' && module.exports) { module.exports = factory(window, require('desandro-matches-selector')); } else { window.fizzyUIUtils = factory(window, window.matchesSelector); } }(window, function factory(window, matchesSelector) {
   var utils = {}; utils.extend = function (a, b) {
      for (var prop in b) { a[prop] = b[prop]; }
      return a;
   }; utils.modulo = function (num, div) { return ((num % div) + div) % div; }; utils.makeArray = function (obj) {
      var ary = []; if (Array.isArray(obj)) { ary = obj; } else if (obj && typeof obj.length == 'number') { for (var i = 0; i < obj.length; i++) { ary.push(obj[i]); } } else { ary.push(obj); }
      return ary;
   }; utils.removeFrom = function (ary, obj) { var index = ary.indexOf(obj); if (index != -1) { ary.splice(index, 1); } }; utils.getParent = function (elem, selector) { while (elem != document.body) { elem = elem.parentNode; if (matchesSelector(elem, selector)) { return elem; } } }; utils.getQueryElement = function (elem) {
      if (typeof elem == 'string') { return document.querySelector(elem); }
      return elem;
   }; utils.handleEvent = function (event) { var method = 'on' + event.type; if (this[method]) { this[method](event); } }; utils.filterFindElements = function (elems, selector) {
      elems = utils.makeArray(elems); var ffElems = []; elems.forEach(function (elem) {
         if (!(elem instanceof HTMLElement)) { return; }
         if (!selector) { ffElems.push(elem); return; }
         if (matchesSelector(elem, selector)) { ffElems.push(elem); }
         var childElems = elem.querySelectorAll(selector); for (var i = 0; i < childElems.length; i++) { ffElems.push(childElems[i]); }
      }); return ffElems;
   }; utils.debounceMethod = function (_class, methodName, threshold) {
      var method = _class.prototype[methodName]; var timeoutName = methodName + 'Timeout'; _class.prototype[methodName] = function () {
         var timeout = this[timeoutName]; if (timeout) { clearTimeout(timeout); }
         var args = arguments; var _this = this; this[timeoutName] = setTimeout(function () { method.apply(_this, args); delete _this[timeoutName]; }, threshold || 100);
      };
   }; utils.docReady = function (callback) { var readyState = document.readyState; if (readyState == 'complete' || readyState == 'interactive') { callback(); } else { document.addEventListener('DOMContentLoaded', callback); } }; utils.toDashed = function (str) { return str.replace(/(.)([A-Z])/g, function (match, $1, $2) { return $1 + '-' + $2; }).toLowerCase(); }; var console = window.console; utils.htmlInit = function (WidgetClass, namespace) {
      utils.docReady(function () {
         var dashedNamespace = utils.toDashed(namespace); var dataAttr = 'data-' + dashedNamespace; var dataAttrElems = document.querySelectorAll('[' + dataAttr + ']'); var jsDashElems = document.querySelectorAll('.js-' + dashedNamespace); var elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems)); var dataOptionsAttr = dataAttr + '-options'; var jQuery = window.jQuery; elems.forEach(function (elem) {
            var attr = elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr); var options; try { options = attr && JSON.parse(attr); } catch (error) {
               if (console) { console.error('Error parsing ' + dataAttr + ' on ' + elem.className + ': ' + error); }
               return;
            }
            var instance = new WidgetClass(elem, options); if (jQuery) { jQuery.data(elem, namespace, instance); }
         });
      });
   }; return utils;
})); (function (window, factory) { if (typeof define == 'function' && define.amd) { define('outlayer/item', ['ev-emitter/ev-emitter', 'get-size/get-size'], factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(require('ev-emitter'), require('get-size')); } else { window.Outlayer = {}; window.Outlayer.Item = factory(window.EvEmitter, window.getSize); } }(window, function factory(EvEmitter, getSize) {
   'use strict'; function isEmptyObj(obj) {
      for (var prop in obj) { return false; }
      prop = null; return true;
   }
   var docElemStyle = document.documentElement.style; var transitionProperty = typeof docElemStyle.transition == 'string' ? 'transition' : 'WebkitTransition'; var transformProperty = typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform'; var transitionEndEvent = { WebkitTransition: 'webkitTransitionEnd', transition: 'transitionend' }[transitionProperty]; var vendorProperties = { transform: transformProperty, transition: transitionProperty, transitionDuration: transitionProperty + 'Duration', transitionProperty: transitionProperty + 'Property', transitionDelay: transitionProperty + 'Delay' }; function Item(element, layout) {
      if (!element) { return; }
      this.element = element; this.layout = layout; this.position = { x: 0, y: 0 }; this._create();
   }
   var proto = Item.prototype = Object.create(EvEmitter.prototype); proto.constructor = Item; proto._create = function () { this._transn = { ingProperties: {}, clean: {}, onEnd: {} }; this.css({ position: 'absolute' }); }; proto.handleEvent = function (event) { var method = 'on' + event.type; if (this[method]) { this[method](event); } }; proto.getSize = function () { this.size = getSize(this.element); }; proto.css = function (style) { var elemStyle = this.element.style; for (var prop in style) { var supportedProp = vendorProperties[prop] || prop; elemStyle[supportedProp] = style[prop]; } }; proto.getPosition = function () { var style = getComputedStyle(this.element); var isOriginLeft = this.layout._getOption('originLeft'); var isOriginTop = this.layout._getOption('originTop'); var xValue = style[isOriginLeft ? 'left' : 'right']; var yValue = style[isOriginTop ? 'top' : 'bottom']; var layoutSize = this.layout.size; var x = xValue.indexOf('%') != -1 ? (parseFloat(xValue) / 100) * layoutSize.width : parseInt(xValue, 10); var y = yValue.indexOf('%') != -1 ? (parseFloat(yValue) / 100) * layoutSize.height : parseInt(yValue, 10); x = isNaN(x) ? 0 : x; y = isNaN(y) ? 0 : y; x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight; y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom; this.position.x = x; this.position.y = y; }; proto.layoutPosition = function () { var layoutSize = this.layout.size; var style = {}; var isOriginLeft = this.layout._getOption('originLeft'); var isOriginTop = this.layout._getOption('originTop'); var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight'; var xProperty = isOriginLeft ? 'left' : 'right'; var xResetProperty = isOriginLeft ? 'right' : 'left'; var x = this.position.x + layoutSize[xPadding]; style[xProperty] = this.getXValue(x); style[xResetProperty] = ''; var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom'; var yProperty = isOriginTop ? 'top' : 'bottom'; var yResetProperty = isOriginTop ? 'bottom' : 'top'; var y = this.position.y + layoutSize[yPadding]; style[yProperty] = this.getYValue(y); style[yResetProperty] = ''; this.css(style); this.emitEvent('layout', [this]); }; proto.getXValue = function (x) { var isHorizontal = this.layout._getOption('horizontal'); return this.layout.options.percentPosition && !isHorizontal ? ((x / this.layout.size.width) * 100) + '%' : x + 'px'; }; proto.getYValue = function (y) { var isHorizontal = this.layout._getOption('horizontal'); return this.layout.options.percentPosition && isHorizontal ? ((y / this.layout.size.height) * 100) + '%' : y + 'px'; }; proto._transitionTo = function (x, y) {
      this.getPosition(); var curX = this.position.x; var curY = this.position.y; var compareX = parseInt(x, 10); var compareY = parseInt(y, 10); var didNotMove = compareX === this.position.x && compareY === this.position.y; this.setPosition(x, y); if (didNotMove && !this.isTransitioning) { this.layoutPosition(); return; }
      var transX = x - curX; var transY = y - curY; var transitionStyle = {}; transitionStyle.transform = this.getTranslate(transX, transY); this.transition({ to: transitionStyle, onTransitionEnd: { transform: this.layoutPosition }, isCleaning: true });
   }; proto.getTranslate = function (x, y) { var isOriginLeft = this.layout._getOption('originLeft'); var isOriginTop = this.layout._getOption('originTop'); x = isOriginLeft ? x : -x; y = isOriginTop ? y : -y; return 'translate3d(' + x + 'px, ' + y + 'px, 0)'; }; proto.goTo = function (x, y) { this.setPosition(x, y); this.layoutPosition(); }; proto.moveTo = proto._transitionTo; proto.setPosition = function (x, y) { this.position.x = parseInt(x, 10); this.position.y = parseInt(y, 10); }; proto._nonTransition = function (args) {
      this.css(args.to); if (args.isCleaning) { this._removeStyles(args.to); }
      for (var prop in args.onTransitionEnd) { args.onTransitionEnd[prop].call(this); }
   }; proto.transition = function (args) {
      if (!parseFloat(this.layout.options.transitionDuration)) { this._nonTransition(args); return; }
      var _transition = this._transn; for (var prop in args.onTransitionEnd) { _transition.onEnd[prop] = args.onTransitionEnd[prop]; }
      for (prop in args.to) { _transition.ingProperties[prop] = true; if (args.isCleaning) { _transition.clean[prop] = true; } }
      if (args.from) { this.css(args.from); var h = this.element.offsetHeight; h = null; }
      this.enableTransition(args.to); this.css(args.to); this.isTransitioning = true;
   }; function toDashedAll(str) { return str.replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); }); }
   var transitionProps = 'opacity,' + toDashedAll(transformProperty); proto.enableTransition = function () {
      if (this.isTransitioning) { return; }
      var duration = this.layout.options.transitionDuration; duration = typeof duration == 'number' ? duration + 'ms' : duration; this.css({ transitionProperty: transitionProps, transitionDuration: duration, transitionDelay: this.staggerDelay || 0 }); this.element.addEventListener(transitionEndEvent, this, false);
   }; proto.onwebkitTransitionEnd = function (event) { this.ontransitionend(event); }; proto.onotransitionend = function (event) { this.ontransitionend(event); }; var dashedVendorProperties = { '-webkit-transform': 'transform' }; proto.ontransitionend = function (event) {
      if (event.target !== this.element) { return; }
      var _transition = this._transn; var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName; delete _transition.ingProperties[propertyName]; if (isEmptyObj(_transition.ingProperties)) { this.disableTransition(); }
      if (propertyName in _transition.clean) { this.element.style[event.propertyName] = ''; delete _transition.clean[propertyName]; }
      if (propertyName in _transition.onEnd) { var onTransitionEnd = _transition.onEnd[propertyName]; onTransitionEnd.call(this); delete _transition.onEnd[propertyName]; }
      this.emitEvent('transitionEnd', [this]);
   }; proto.disableTransition = function () { this.removeTransitionStyles(); this.element.removeEventListener(transitionEndEvent, this, false); this.isTransitioning = false; }; proto._removeStyles = function (style) {
      var cleanStyle = {}; for (var prop in style) { cleanStyle[prop] = ''; }
      this.css(cleanStyle);
   }; var cleanTransitionStyle = { transitionProperty: '', transitionDuration: '', transitionDelay: '' }; proto.removeTransitionStyles = function () { this.css(cleanTransitionStyle); }; proto.stagger = function (delay) { delay = isNaN(delay) ? 0 : delay; this.staggerDelay = delay + 'ms'; }; proto.removeElem = function () { this.element.parentNode.removeChild(this.element); this.css({ display: '' }); this.emitEvent('remove', [this]); }; proto.remove = function () {
      if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) { this.removeElem(); return; }
      this.once('transitionEnd', function () { this.removeElem(); }); this.hide();
   }; proto.reveal = function () { delete this.isHidden; this.css({ display: '' }); var options = this.layout.options; var onTransitionEnd = {}; var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle'); onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd; this.transition({ from: options.hiddenStyle, to: options.visibleStyle, isCleaning: true, onTransitionEnd: onTransitionEnd }); }; proto.onRevealTransitionEnd = function () { if (!this.isHidden) { this.emitEvent('reveal'); } }; proto.getHideRevealTransitionEndProperty = function (styleProperty) {
      var optionStyle = this.layout.options[styleProperty]; if (optionStyle.opacity) { return 'opacity'; }
      for (var prop in optionStyle) { return prop; }
   }; proto.hide = function () { this.isHidden = true; this.css({ display: '' }); var options = this.layout.options; var onTransitionEnd = {}; var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle'); onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd; this.transition({ from: options.visibleStyle, to: options.hiddenStyle, isCleaning: true, onTransitionEnd: onTransitionEnd }); }; proto.onHideTransitionEnd = function () { if (this.isHidden) { this.css({ display: 'none' }); this.emitEvent('hide'); } }; proto.destroy = function () { this.css({ position: '', left: '', right: '', top: '', bottom: '', transition: '', transform: '' }); }; return Item;
}));
/*!
 * Outlayer v2.1.0
 * the brains and guts of a layout library
 * MIT license
 */
(function (window, factory) { 'use strict'; if (typeof define == 'function' && define.amd) { define('outlayer/outlayer', ['ev-emitter/ev-emitter', 'get-size/get-size', 'fizzy-ui-utils/utils', './item'], function (EvEmitter, getSize, utils, Item) { return factory(window, EvEmitter, getSize, utils, Item); }); } else if (typeof module == 'object' && module.exports) { module.exports = factory(window, require('ev-emitter'), require('get-size'), require('fizzy-ui-utils'), require('./item')); } else { window.Outlayer = factory(window, window.EvEmitter, window.getSize, window.fizzyUIUtils, window.Outlayer.Item); } }(window, function factory(window, EvEmitter, getSize, utils, Item) {
   'use strict'; var console = window.console; var jQuery = window.jQuery; var noop = function () { }; var GUID = 0; var instances = {}; function Outlayer(element, options) {
      var queryElement = utils.getQueryElement(element); if (!queryElement) {
         if (console) { console.error('Bad element for ' + this.constructor.namespace + ': ' + (queryElement || element)); }
         return;
      }
      this.element = queryElement; if (jQuery) { this.$element = jQuery(this.element); }
      this.options = utils.extend({}, this.constructor.defaults); this.option(options); var id = ++GUID; this.element.outlayerGUID = id; instances[id] = this; this._create(); var isInitLayout = this._getOption('initLayout'); if (isInitLayout) { this.layout(); }
   }
   Outlayer.namespace = 'outlayer'; Outlayer.Item = Item; Outlayer.defaults = { containerStyle: { position: 'relative' }, initLayout: true, originLeft: true, originTop: true, resize: true, resizeContainer: true, transitionDuration: '0.4s', hiddenStyle: { opacity: 0, transform: 'scale(0.001)' }, visibleStyle: { opacity: 1, transform: 'scale(1)' } }; var proto = Outlayer.prototype; utils.extend(proto, EvEmitter.prototype); proto.option = function (opts) { utils.extend(this.options, opts); }; proto._getOption = function (option) { var oldOption = this.constructor.compatOptions[option]; return oldOption && this.options[oldOption] !== undefined ? this.options[oldOption] : this.options[option]; }; Outlayer.compatOptions = { initLayout: 'isInitLayout', horizontal: 'isHorizontal', layoutInstant: 'isLayoutInstant', originLeft: 'isOriginLeft', originTop: 'isOriginTop', resize: 'isResizeBound', resizeContainer: 'isResizingContainer' }; proto._create = function () { this.reloadItems(); this.stamps = []; this.stamp(this.options.stamp); utils.extend(this.element.style, this.options.containerStyle); var canBindResize = this._getOption('resize'); if (canBindResize) { this.bindResize(); } }; proto.reloadItems = function () { this.items = this._itemize(this.element.children); }; proto._itemize = function (elems) {
      var itemElems = this._filterFindItemElements(elems); var Item = this.constructor.Item; var items = []; for (var i = 0; i < itemElems.length; i++) { var elem = itemElems[i]; var item = new Item(elem, this); items.push(item); }
      return items;
   }; proto._filterFindItemElements = function (elems) { return utils.filterFindElements(elems, this.options.itemSelector); }; proto.getItemElements = function () { return this.items.map(function (item) { return item.element; }); }; proto.layout = function () { this._resetLayout(); this._manageStamps(); var layoutInstant = this._getOption('layoutInstant'); var isInstant = layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited; this.layoutItems(this.items, isInstant); this._isLayoutInited = true; }; proto._init = proto.layout; proto._resetLayout = function () { this.getSize(); }; proto.getSize = function () { this.size = getSize(this.element); }; proto._getMeasurement = function (measurement, size) {
      var option = this.options[measurement]; var elem; if (!option) { this[measurement] = 0; } else {
         if (typeof option == 'string') { elem = this.element.querySelector(option); } else if (option instanceof HTMLElement) { elem = option; }
         this[measurement] = elem ? getSize(elem)[size] : option;
      }
   }; proto.layoutItems = function (items, isInstant) { items = this._getItemsForLayout(items); this._layoutItems(items, isInstant); this._postLayout(); }; proto._getItemsForLayout = function (items) { return items.filter(function (item) { return !item.isIgnored; }); }; proto._layoutItems = function (items, isInstant) {
      this._emitCompleteOnItems('layout', items); if (!items || !items.length) { return; }
      var queue = []; items.forEach(function (item) { var position = this._getItemLayoutPosition(item); position.item = item; position.isInstant = isInstant || item.isLayoutInstant; queue.push(position); }, this); this._processLayoutQueue(queue);
   }; proto._getItemLayoutPosition = function () { return { x: 0, y: 0 }; }; proto._processLayoutQueue = function (queue) { this.updateStagger(); queue.forEach(function (obj, i) { this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i); }, this); }; proto.updateStagger = function () {
      var stagger = this.options.stagger; if (stagger === null || stagger === undefined) { this.stagger = 0; return; }
      this.stagger = getMilliseconds(stagger); return this.stagger;
   }; proto._positionItem = function (item, x, y, isInstant, i) { if (isInstant) { item.goTo(x, y); } else { item.stagger(i * this.stagger); item.moveTo(x, y); } }; proto._postLayout = function () { this.resizeContainer(); }; proto.resizeContainer = function () {
      var isResizingContainer = this._getOption('resizeContainer'); if (!isResizingContainer) { return; }
      var size = this._getContainerSize(); if (size) { this._setContainerMeasure(size.width, true); this._setContainerMeasure(size.height, false); }
   }; proto._getContainerSize = noop; proto._setContainerMeasure = function (measure, isWidth) {
      if (measure === undefined) { return; }
      var elemSize = this.size; if (elemSize.isBorderBox) {
         measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
            elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop +
            elemSize.borderTopWidth + elemSize.borderBottomWidth;
      }
      measure = Math.max(measure, 0); this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
   }; proto._emitCompleteOnItems = function (eventName, items) {
      var _this = this; function onComplete() { _this.dispatchEvent(eventName + 'Complete', null, [items]); }
      var count = items.length; if (!items || !count) { onComplete(); return; }
      var doneCount = 0; function tick() { doneCount++; if (doneCount == count) { onComplete(); } }
      items.forEach(function (item) { item.once(eventName, tick); });
   }; proto.dispatchEvent = function (type, event, args) { var emitArgs = event ? [event].concat(args) : args; this.emitEvent(type, emitArgs); if (jQuery) { this.$element = this.$element || jQuery(this.element); if (event) { var $event = jQuery.Event(event); $event.type = type; this.$element.trigger($event, args); } else { this.$element.trigger(type, args); } } }; proto.ignore = function (elem) { var item = this.getItem(elem); if (item) { item.isIgnored = true; } }; proto.unignore = function (elem) { var item = this.getItem(elem); if (item) { delete item.isIgnored; } }; proto.stamp = function (elems) {
      elems = this._find(elems); if (!elems) { return; }
      this.stamps = this.stamps.concat(elems); elems.forEach(this.ignore, this);
   }; proto.unstamp = function (elems) {
      elems = this._find(elems); if (!elems) { return; }
      elems.forEach(function (elem) { utils.removeFrom(this.stamps, elem); this.unignore(elem); }, this);
   }; proto._find = function (elems) {
      if (!elems) { return; }
      if (typeof elems == 'string') { elems = this.element.querySelectorAll(elems); }
      elems = utils.makeArray(elems); return elems;
   }; proto._manageStamps = function () {
      if (!this.stamps || !this.stamps.length) { return; }
      this._getBoundingRect(); this.stamps.forEach(this._manageStamp, this);
   }; proto._getBoundingRect = function () { var boundingRect = this.element.getBoundingClientRect(); var size = this.size; this._boundingRect = { left: boundingRect.left + size.paddingLeft + size.borderLeftWidth, top: boundingRect.top + size.paddingTop + size.borderTopWidth, right: boundingRect.right - (size.paddingRight + size.borderRightWidth), bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth) }; }; proto._manageStamp = noop; proto._getElementOffset = function (elem) { var boundingRect = elem.getBoundingClientRect(); var thisRect = this._boundingRect; var size = getSize(elem); var offset = { left: boundingRect.left - thisRect.left - size.marginLeft, top: boundingRect.top - thisRect.top - size.marginTop, right: thisRect.right - boundingRect.right - size.marginRight, bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom }; return offset; }; proto.handleEvent = utils.handleEvent; proto.bindResize = function () { window.addEventListener('resize', this); this.isResizeBound = true; }; proto.unbindResize = function () { window.removeEventListener('resize', this); this.isResizeBound = false; }; proto.onresize = function () { this.resize(); }; utils.debounceMethod(Outlayer, 'onresize', 100); proto.resize = function () {
      if (!this.isResizeBound || !this.needsResizeLayout()) { return; }
      this.layout();
   }; proto.needsResizeLayout = function () { var size = getSize(this.element); var hasSizes = this.size && size; return hasSizes && size.innerWidth !== this.size.innerWidth; }; proto.addItems = function (elems) {
      var items = this._itemize(elems); if (items.length) { this.items = this.items.concat(items); }
      return items;
   }; proto.appended = function (elems) {
      var items = this.addItems(elems); if (!items.length) { return; }
      this.layoutItems(items, true); this.reveal(items);
   }; proto.prepended = function (elems) {
      var items = this._itemize(elems); if (!items.length) { return; }
      var previousItems = this.items.slice(0); this.items = items.concat(previousItems); this._resetLayout(); this._manageStamps(); this.layoutItems(items, true); this.reveal(items); this.layoutItems(previousItems);
   }; proto.reveal = function (items) {
      this._emitCompleteOnItems('reveal', items); if (!items || !items.length) { return; }
      var stagger = this.updateStagger(); items.forEach(function (item, i) { item.stagger(i * stagger); item.reveal(); });
   }; proto.hide = function (items) {
      this._emitCompleteOnItems('hide', items); if (!items || !items.length) { return; }
      var stagger = this.updateStagger(); items.forEach(function (item, i) { item.stagger(i * stagger); item.hide(); });
   }; proto.revealItemElements = function (elems) { var items = this.getItems(elems); this.reveal(items); }; proto.hideItemElements = function (elems) { var items = this.getItems(elems); this.hide(items); }; proto.getItem = function (elem) { for (var i = 0; i < this.items.length; i++) { var item = this.items[i]; if (item.element == elem) { return item; } } }; proto.getItems = function (elems) { elems = utils.makeArray(elems); var items = []; elems.forEach(function (elem) { var item = this.getItem(elem); if (item) { items.push(item); } }, this); return items; }; proto.remove = function (elems) {
      var removeItems = this.getItems(elems); this._emitCompleteOnItems('remove', removeItems); if (!removeItems || !removeItems.length) { return; }
      removeItems.forEach(function (item) { item.remove(); utils.removeFrom(this.items, item); }, this);
   }; proto.destroy = function () { var style = this.element.style; style.height = ''; style.position = ''; style.width = ''; this.items.forEach(function (item) { item.destroy(); }); this.unbindResize(); var id = this.element.outlayerGUID; delete instances[id]; delete this.element.outlayerGUID; if (jQuery) { jQuery.removeData(this.element, this.constructor.namespace); } }; Outlayer.data = function (elem) { elem = utils.getQueryElement(elem); var id = elem && elem.outlayerGUID; return id && instances[id]; }; Outlayer.create = function (namespace, options) {
      var Layout = subclass(Outlayer); Layout.defaults = utils.extend({}, Outlayer.defaults); utils.extend(Layout.defaults, options); Layout.compatOptions = utils.extend({}, Outlayer.compatOptions); Layout.namespace = namespace; Layout.data = Outlayer.data; Layout.Item = subclass(Item); utils.htmlInit(Layout, namespace); if (jQuery && jQuery.bridget) { jQuery.bridget(namespace, Layout); }
      return Layout;
   }; function subclass(Parent) {
      function SubClass() { Parent.apply(this, arguments); }
      SubClass.prototype = Object.create(Parent.prototype); SubClass.prototype.constructor = SubClass; return SubClass;
   }
   var msUnits = { ms: 1, s: 1000 }; function getMilliseconds(time) {
      if (typeof time == 'number') { return time; }
      var matches = time.match(/(^\d*\.?\d*)(\w*)/); var num = matches && matches[1]; var unit = matches && matches[2]; if (!num.length) { return 0; }
      num = parseFloat(num); var mult = msUnits[unit] || 1; return num * mult;
   }
   Outlayer.Item = Item; return Outlayer;
})); (function (window, factory) { if (typeof define == 'function' && define.amd) { define('isotope/js/item', ['outlayer/outlayer'], factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(require('outlayer')); } else { window.Isotope = window.Isotope || {}; window.Isotope.Item = factory(window.Outlayer); } }(window, function factory(Outlayer) {
   'use strict'; function Item() { Outlayer.Item.apply(this, arguments); }
   var proto = Item.prototype = Object.create(Outlayer.Item.prototype); var _create = proto._create; proto._create = function () { this.id = this.layout.itemGUID++; _create.call(this); this.sortData = {}; }; proto.updateSortData = function () {
      if (this.isIgnored) { return; }
      this.sortData.id = this.id; this.sortData['original-order'] = this.id; this.sortData.random = Math.random(); var getSortData = this.layout.options.getSortData; var sorters = this.layout._sorters; for (var key in getSortData) { var sorter = sorters[key]; this.sortData[key] = sorter(this.element, this); }
   }; var _destroy = proto.destroy; proto.destroy = function () { _destroy.apply(this, arguments); this.css({ display: '' }); }; return Item;
})); (function (window, factory) { if (typeof define == 'function' && define.amd) { define('isotope/js/layout-mode', ['get-size/get-size', 'outlayer/outlayer'], factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(require('get-size'), require('outlayer')); } else { window.Isotope = window.Isotope || {}; window.Isotope.LayoutMode = factory(window.getSize, window.Outlayer); } }(window, function factory(getSize, Outlayer) {
   'use strict'; function LayoutMode(isotope) { this.isotope = isotope; if (isotope) { this.options = isotope.options[this.namespace]; this.element = isotope.element; this.items = isotope.filteredItems; this.size = isotope.size; } }
   var proto = LayoutMode.prototype; var facadeMethods = ['_resetLayout', '_getItemLayoutPosition', '_manageStamp', '_getContainerSize', '_getElementOffset', 'needsResizeLayout', '_getOption']; facadeMethods.forEach(function (methodName) { proto[methodName] = function () { return Outlayer.prototype[methodName].apply(this.isotope, arguments); }; }); proto.needsVerticalResizeLayout = function () { var size = getSize(this.isotope.element); var hasSizes = this.isotope.size && size; return hasSizes && size.innerHeight != this.isotope.size.innerHeight; }; proto._getMeasurement = function () { this.isotope._getMeasurement.apply(this, arguments); }; proto.getColumnWidth = function () { this.getSegmentSize('column', 'Width'); }; proto.getRowHeight = function () { this.getSegmentSize('row', 'Height'); }; proto.getSegmentSize = function (segment, size) {
      var segmentName = segment + size; var outerSize = 'outer' + size; this._getMeasurement(segmentName, outerSize); if (this[segmentName]) { return; }
      var firstItemSize = this.getFirstItemSize(); this[segmentName] = firstItemSize && firstItemSize[outerSize] || this.isotope.size['inner' + size];
   }; proto.getFirstItemSize = function () { var firstItem = this.isotope.filteredItems[0]; return firstItem && firstItem.element && getSize(firstItem.element); }; proto.layout = function () { this.isotope.layout.apply(this.isotope, arguments); }; proto.getSize = function () { this.isotope.getSize(); this.size = this.isotope.size; }; LayoutMode.modes = {}; LayoutMode.create = function (namespace, options) {
      function Mode() { LayoutMode.apply(this, arguments); }
      Mode.prototype = Object.create(proto); Mode.prototype.constructor = Mode; if (options) { Mode.options = options; }
      Mode.prototype.namespace = namespace; LayoutMode.modes[namespace] = Mode; return Mode;
   }; return LayoutMode;
}));
/*!
 * Masonry v4.1.0
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */
(function (window, factory) { if (typeof define == 'function' && define.amd) { define('masonry/masonry', ['outlayer/outlayer', 'get-size/get-size'], factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(require('outlayer'), require('get-size')); } else { window.Masonry = factory(window.Outlayer, window.getSize); } }(window, function factory(Outlayer, getSize) {
   var Masonry = Outlayer.create('masonry'); Masonry.compatOptions.fitWidth = 'isFitWidth'; Masonry.prototype._resetLayout = function () {
      this.getSize(); this._getMeasurement('columnWidth', 'outerWidth'); this._getMeasurement('gutter', 'outerWidth'); this.measureColumns(); this.colYs = []; for (var i = 0; i < this.cols; i++) { this.colYs.push(0); }
      this.maxY = 0;
   }; Masonry.prototype.measureColumns = function () {
      this.getContainerWidth(); if (!this.columnWidth) { var firstItem = this.items[0]; var firstItemElem = firstItem && firstItem.element; this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth || this.containerWidth; }
      var columnWidth = this.columnWidth += this.gutter; var containerWidth = this.containerWidth + this.gutter; var cols = containerWidth / columnWidth; var excess = columnWidth - containerWidth % columnWidth; var mathMethod = excess && excess < 1 ? 'round' : 'floor'; cols = Math[mathMethod](cols); this.cols = Math.max(cols, 1);
   }; Masonry.prototype.getContainerWidth = function () { var isFitWidth = this._getOption('fitWidth'); var container = isFitWidth ? this.element.parentNode : this.element; var size = getSize(container); this.containerWidth = size && size.innerWidth; }; Masonry.prototype._getItemLayoutPosition = function (item) {
      item.getSize(); var remainder = item.size.outerWidth % this.columnWidth; var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil'; var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth); colSpan = Math.min(colSpan, this.cols); var colGroup = this._getColGroup(colSpan); var minimumY = Math.min.apply(Math, colGroup); var shortColIndex = colGroup.indexOf(minimumY); var position = { x: this.columnWidth * shortColIndex, y: minimumY }; var setHeight = minimumY + item.size.outerHeight; var setSpan = this.cols + 1 - colGroup.length; for (var i = 0; i < setSpan; i++) { this.colYs[shortColIndex + i] = setHeight; }
      return position;
   }; Masonry.prototype._getColGroup = function (colSpan) {
      if (colSpan < 2) { return this.colYs; }
      var colGroup = []; var groupCount = this.cols + 1 - colSpan; for (var i = 0; i < groupCount; i++) { var groupColYs = this.colYs.slice(i, i + colSpan); colGroup[i] = Math.max.apply(Math, groupColYs); }
      return colGroup;
   }; Masonry.prototype._manageStamp = function (stamp) {
      var stampSize = getSize(stamp); var offset = this._getElementOffset(stamp); var isOriginLeft = this._getOption('originLeft'); var firstX = isOriginLeft ? offset.left : offset.right; var lastX = firstX + stampSize.outerWidth; var firstCol = Math.floor(firstX / this.columnWidth); firstCol = Math.max(0, firstCol); var lastCol = Math.floor(lastX / this.columnWidth); lastCol -= lastX % this.columnWidth ? 0 : 1; lastCol = Math.min(this.cols - 1, lastCol); var isOriginTop = this._getOption('originTop'); var stampMaxY = (isOriginTop ? offset.top : offset.bottom) +
         stampSize.outerHeight; for (var i = firstCol; i <= lastCol; i++) { this.colYs[i] = Math.max(stampMaxY, this.colYs[i]); }
   }; Masonry.prototype._getContainerSize = function () {
      this.maxY = Math.max.apply(Math, this.colYs); var size = { height: this.maxY }; if (this._getOption('fitWidth')) { size.width = this._getContainerFitWidth(); }
      return size;
   }; Masonry.prototype._getContainerFitWidth = function () {
      var unusedCols = 0; var i = this.cols; while (--i) {
         if (this.colYs[i] !== 0) { break; }
         unusedCols++;
      }
      return (this.cols - unusedCols) * this.columnWidth - this.gutter;
   }; Masonry.prototype.needsResizeLayout = function () { var previousWidth = this.containerWidth; this.getContainerWidth(); return previousWidth != this.containerWidth; }; return Masonry;
}));
/*!
 * Masonry layout mode
 * sub-classes Masonry
 * http://masonry.desandro.com
 */
(function (window, factory) { if (typeof define == 'function' && define.amd) { define('isotope/js/layout-modes/masonry', ['../layout-mode', 'masonry/masonry'], factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(require('../layout-mode'), require('masonry-layout')); } else { factory(window.Isotope.LayoutMode, window.Masonry); } }(window, function factory(LayoutMode, Masonry) {
   'use strict'; var MasonryMode = LayoutMode.create('masonry'); var proto = MasonryMode.prototype; var keepModeMethods = { _getElementOffset: true, layout: true, _getMeasurement: true }; for (var method in Masonry.prototype) { if (!keepModeMethods[method]) { proto[method] = Masonry.prototype[method]; } }
   var measureColumns = proto.measureColumns; proto.measureColumns = function () { this.items = this.isotope.filteredItems; measureColumns.call(this); }; var _getOption = proto._getOption; proto._getOption = function (option) {
      if (option == 'fitWidth') { return this.options.isFitWidth !== undefined ? this.options.isFitWidth : this.options.fitWidth; }
      return _getOption.apply(this.isotope, arguments);
   }; return MasonryMode;
})); (function (window, factory) { if (typeof define == 'function' && define.amd) { define('isotope/js/layout-modes/fit-rows', ['../layout-mode'], factory); } else if (typeof exports == 'object') { module.exports = factory(require('../layout-mode')); } else { factory(window.Isotope.LayoutMode); } }(window, function factory(LayoutMode) {
   'use strict'; var FitRows = LayoutMode.create('fitRows'); var proto = FitRows.prototype; proto._resetLayout = function () { this.x = 0; this.y = 0; this.maxY = 0; this._getMeasurement('gutter', 'outerWidth'); }; proto._getItemLayoutPosition = function (item) {
      item.getSize(); var itemWidth = item.size.outerWidth + this.gutter; var containerWidth = this.isotope.size.innerWidth + this.gutter; if (this.x !== 0 && itemWidth + this.x > containerWidth) { this.x = 0; this.y = this.maxY; }
      var position = { x: this.x, y: this.y }; this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight); this.x += itemWidth; return position;
   }; proto._getContainerSize = function () { return { height: this.maxY }; }; return FitRows;
})); (function (window, factory) { if (typeof define == 'function' && define.amd) { define('isotope/js/layout-modes/vertical', ['../layout-mode'], factory); } else if (typeof module == 'object' && module.exports) { module.exports = factory(require('../layout-mode')); } else { factory(window.Isotope.LayoutMode); } }(window, function factory(LayoutMode) { 'use strict'; var Vertical = LayoutMode.create('vertical', { horizontalAlignment: 0 }); var proto = Vertical.prototype; proto._resetLayout = function () { this.y = 0; }; proto._getItemLayoutPosition = function (item) { item.getSize(); var x = (this.isotope.size.innerWidth - item.size.outerWidth) * this.options.horizontalAlignment; var y = this.y; this.y += item.size.outerHeight; return { x: x, y: y }; }; proto._getContainerSize = function () { return { height: this.y }; }; return Vertical; }));
/*!
 * Isotope v3.0.1
 *
 * Licensed GPLv3 for open source use
 * or Isotope Commercial License for commercial use
 *
 * http://isotope.metafizzy.co
 * Copyright 2016 Metafizzy
 */
(function (window, factory) { if (typeof define == 'function' && define.amd) { define(['outlayer/outlayer', 'get-size/get-size', 'desandro-matches-selector/matches-selector', 'fizzy-ui-utils/utils', 'isotope/js/item', 'isotope/js/layout-mode', 'isotope/js/layout-modes/masonry', 'isotope/js/layout-modes/fit-rows', 'isotope/js/layout-modes/vertical'], function (Outlayer, getSize, matchesSelector, utils, Item, LayoutMode) { return factory(window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode); }); } else if (typeof module == 'object' && module.exports) { module.exports = factory(window, require('outlayer'), require('get-size'), require('desandro-matches-selector'), require('fizzy-ui-utils'), require('isotope/js/item'), require('isotope/js/layout-mode'), require('isotope/js/layout-modes/masonry'), require('isotope/js/layout-modes/fit-rows'), require('isotope/js/layout-modes/vertical')); } else { window.Isotope = factory(window, window.Outlayer, window.getSize, window.matchesSelector, window.fizzyUIUtils, window.Isotope.Item, window.Isotope.LayoutMode); } }(window, function factory(window, Outlayer, getSize, matchesSelector, utils, Item, LayoutMode) {
   var jQuery = window.jQuery; var trim = String.prototype.trim ? function (str) { return str.trim(); } : function (str) { return str.replace(/^\s+|\s+$/g, ''); }; var Isotope = Outlayer.create('isotope', { layoutMode: 'masonry', isJQueryFiltering: true, sortAscending: true }); Isotope.Item = Item; Isotope.LayoutMode = LayoutMode; var proto = Isotope.prototype; proto._create = function () { this.itemGUID = 0; this._sorters = {}; this._getSorters(); Outlayer.prototype._create.call(this); this.modes = {}; this.filteredItems = this.items; this.sortHistory = ['original-order']; for (var name in LayoutMode.modes) { this._initLayoutMode(name); } }; proto.reloadItems = function () { this.itemGUID = 0; Outlayer.prototype.reloadItems.call(this); }; proto._itemize = function () {
      var items = Outlayer.prototype._itemize.apply(this, arguments); for (var i = 0; i < items.length; i++) { var item = items[i]; item.id = this.itemGUID++; }
      this._updateItemsSortData(items); return items;
   }; proto._initLayoutMode = function (name) { var Mode = LayoutMode.modes[name]; var initialOpts = this.options[name] || {}; this.options[name] = Mode.options ? utils.extend(Mode.options, initialOpts) : initialOpts; this.modes[name] = new Mode(this); }; proto.layout = function () {
      if (!this._isLayoutInited && this._getOption('initLayout')) { this.arrange(); return; }
      this._layout();
   }; proto._layout = function () { var isInstant = this._getIsInstant(); this._resetLayout(); this._manageStamps(); this.layoutItems(this.filteredItems, isInstant); this._isLayoutInited = true; }; proto.arrange = function (opts) {
      this.option(opts); this._getIsInstant(); var filtered = this._filter(this.items); this.filteredItems = filtered.matches; this._bindArrangeComplete(); if (this._isInstant) { this._noTransition(this._hideReveal, [filtered]); } else { this._hideReveal(filtered); }
      this._sort(); this._layout();
   }; proto._init = proto.arrange; proto._hideReveal = function (filtered) { this.reveal(filtered.needReveal); this.hide(filtered.needHide); }; proto._getIsInstant = function () { var isLayoutInstant = this._getOption('layoutInstant'); var isInstant = isLayoutInstant !== undefined ? isLayoutInstant : !this._isLayoutInited; this._isInstant = isInstant; return isInstant; }; proto._bindArrangeComplete = function () {
      var isLayoutComplete, isHideComplete, isRevealComplete; var _this = this; function arrangeParallelCallback() { if (isLayoutComplete && isHideComplete && isRevealComplete) { _this.dispatchEvent('arrangeComplete', null, [_this.filteredItems]); } }
      this.once('layoutComplete', function () { isLayoutComplete = true; arrangeParallelCallback(); }); this.once('hideComplete', function () { isHideComplete = true; arrangeParallelCallback(); }); this.once('revealComplete', function () { isRevealComplete = true; arrangeParallelCallback(); });
   }; proto._filter = function (items) {
      var filter = this.options.filter; filter = filter || '*'; var matches = []; var hiddenMatched = []; var visibleUnmatched = []; var test = this._getFilterTest(filter); for (var i = 0; i < items.length; i++) {
         var item = items[i]; if (item.isIgnored) { continue; }
         var isMatched = test(item); if (isMatched) { matches.push(item); }
         if (isMatched && item.isHidden) { hiddenMatched.push(item); } else if (!isMatched && !item.isHidden) { visibleUnmatched.push(item); }
      }
      return { matches: matches, needReveal: hiddenMatched, needHide: visibleUnmatched };
   }; proto._getFilterTest = function (filter) {
      if (jQuery && this.options.isJQueryFiltering) { return function (item) { return jQuery(item.element).is(filter); }; }
      if (typeof filter == 'function') { return function (item) { return filter(item.element); }; }
      return function (item) { return matchesSelector(item.element, filter); };
   }; proto.updateSortData = function (elems) {
      var items; if (elems) { elems = utils.makeArray(elems); items = this.getItems(elems); } else { items = this.items; }
      this._getSorters(); this._updateItemsSortData(items);
   }; proto._getSorters = function () { var getSortData = this.options.getSortData; for (var key in getSortData) { var sorter = getSortData[key]; this._sorters[key] = mungeSorter(sorter); } }; proto._updateItemsSortData = function (items) { var len = items && items.length; for (var i = 0; len && i < len; i++) { var item = items[i]; item.updateSortData(); } }; var mungeSorter = (function () {
      function mungeSorter(sorter) {
         if (typeof sorter != 'string') { return sorter; }
         var args = trim(sorter).split(' '); var query = args[0]; var attrMatch = query.match(/^\[(.+)\]$/); var attr = attrMatch && attrMatch[1]; var getValue = getValueGetter(attr, query); var parser = Isotope.sortDataParsers[args[1]]; sorter = parser ? function (elem) { return elem && parser(getValue(elem)); } : function (elem) { return elem && getValue(elem); }; return sorter;
      }
      function getValueGetter(attr, query) {
         if (attr) { return function getAttribute(elem) { return elem.getAttribute(attr); }; }
         return function getChildText(elem) { var child = elem.querySelector(query); return child && child.textContent; };
      }
      return mungeSorter;
   })(); Isotope.sortDataParsers = { 'parseInt': function (val) { return parseInt(val, 10); }, 'parseFloat': function (val) { return parseFloat(val); } }; proto._sort = function () {
      var sortByOpt = this.options.sortBy; if (!sortByOpt) { return; }
      var sortBys = [].concat.apply(sortByOpt, this.sortHistory); var itemSorter = getItemSorter(sortBys, this.options.sortAscending); this.filteredItems.sort(itemSorter); if (sortByOpt != this.sortHistory[0]) { this.sortHistory.unshift(sortByOpt); }
   }; function getItemSorter(sortBys, sortAsc) {
      return function sorter(itemA, itemB) {
         for (var i = 0; i < sortBys.length; i++) { var sortBy = sortBys[i]; var a = itemA.sortData[sortBy]; var b = itemB.sortData[sortBy]; if (a > b || a < b) { var isAscending = sortAsc[sortBy] !== undefined ? sortAsc[sortBy] : sortAsc; var direction = isAscending ? 1 : -1; return (a > b ? 1 : -1) * direction; } }
         return 0;
      };
   }
   proto._mode = function () {
      var layoutMode = this.options.layoutMode; var mode = this.modes[layoutMode]; if (!mode) { throw new Error('No layout mode: ' + layoutMode); }
      mode.options = this.options[layoutMode]; return mode;
   }; proto._resetLayout = function () { Outlayer.prototype._resetLayout.call(this); this._mode()._resetLayout(); }; proto._getItemLayoutPosition = function (item) { return this._mode()._getItemLayoutPosition(item); }; proto._manageStamp = function (stamp) { this._mode()._manageStamp(stamp); }; proto._getContainerSize = function () { return this._mode()._getContainerSize(); }; proto.needsResizeLayout = function () { return this._mode().needsResizeLayout(); }; proto.appended = function (elems) {
      var items = this.addItems(elems); if (!items.length) { return; }
      var filteredItems = this._filterRevealAdded(items); this.filteredItems = this.filteredItems.concat(filteredItems);
   }; proto.prepended = function (elems) {
      var items = this._itemize(elems); if (!items.length) { return; }
      this._resetLayout(); this._manageStamps(); var filteredItems = this._filterRevealAdded(items); this.layoutItems(this.filteredItems); this.filteredItems = filteredItems.concat(this.filteredItems); this.items = items.concat(this.items);
   }; proto._filterRevealAdded = function (items) { var filtered = this._filter(items); this.hide(filtered.needHide); this.reveal(filtered.matches); this.layoutItems(filtered.matches, true); return filtered.matches; }; proto.insert = function (elems) {
      var items = this.addItems(elems); if (!items.length) { return; }
      var i, item; var len = items.length; for (i = 0; i < len; i++) { item = items[i]; this.element.appendChild(item.element); }
      var filteredInsertItems = this._filter(items).matches; for (i = 0; i < len; i++) { items[i].isLayoutInstant = true; }
      this.arrange(); for (i = 0; i < len; i++) { delete items[i].isLayoutInstant; }
      this.reveal(filteredInsertItems);
   }; var _remove = proto.remove; proto.remove = function (elems) { elems = utils.makeArray(elems); var removeItems = this.getItems(elems); _remove.call(this, elems); var len = removeItems && removeItems.length; for (var i = 0; len && i < len; i++) { var item = removeItems[i]; utils.removeFrom(this.filteredItems, item); } }; proto.shuffle = function () {
      for (var i = 0; i < this.items.length; i++) { var item = this.items[i]; item.sortData.random = Math.random(); }
      this.options.sortBy = 'random'; this._sort(); this._layout();
   }; proto._noTransition = function (fn, args) { var transitionDuration = this.options.transitionDuration; this.options.transitionDuration = 0; var returnValue = fn.apply(this, args); this.options.transitionDuration = transitionDuration; return returnValue; }; proto.getFilteredItemElements = function () { return this.filteredItems.map(function (item) { return item.element; }); }; return Isotope;
}));

/*!
 * imagesLoaded PACKAGED v4.1.1
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

!function (t, e) { "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", e) : "object" == typeof module && module.exports ? module.exports = e() : t.EvEmitter = e() }("undefined" != typeof window ? window : this, function () { function t() { } var e = t.prototype; return e.on = function (t, e) { if (t && e) { var i = this._events = this._events || {}, n = i[t] = i[t] || []; return -1 == n.indexOf(e) && n.push(e), this } }, e.once = function (t, e) { if (t && e) { this.on(t, e); var i = this._onceEvents = this._onceEvents || {}, n = i[t] = i[t] || {}; return n[e] = !0, this } }, e.off = function (t, e) { var i = this._events && this._events[t]; if (i && i.length) { var n = i.indexOf(e); return -1 != n && i.splice(n, 1), this } }, e.emitEvent = function (t, e) { var i = this._events && this._events[t]; if (i && i.length) { var n = 0, o = i[n]; e = e || []; for (var r = this._onceEvents && this._onceEvents[t]; o;) { var s = r && r[o]; s && (this.off(t, o), delete r[o]), o.apply(this, e), n += s ? 0 : 1, o = i[n] } return this } }, t }), function (t, e) { "use strict"; "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function (i) { return e(t, i) }) : "object" == typeof module && module.exports ? module.exports = e(t, require("ev-emitter")) : t.imagesLoaded = e(t, t.EvEmitter) }(window, function (t, e) { function i(t, e) { for (var i in e) t[i] = e[i]; return t } function n(t) { var e = []; if (Array.isArray(t)) e = t; else if ("number" == typeof t.length) for (var i = 0; i < t.length; i++)e.push(t[i]); else e.push(t); return e } function o(t, e, r) { return this instanceof o ? ("string" == typeof t && (t = document.querySelectorAll(t)), this.elements = n(t), this.options = i({}, this.options), "function" == typeof e ? r = e : i(this.options, e), r && this.on("always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(function () { this.check() }.bind(this))) : new o(t, e, r) } function r(t) { this.img = t } function s(t, e) { this.url = t, this.element = e, this.img = new Image } var h = t.jQuery, a = t.console; o.prototype = Object.create(e.prototype), o.prototype.options = {}, o.prototype.getImages = function () { this.images = [], this.elements.forEach(this.addElementImages, this) }, o.prototype.addElementImages = function (t) { "IMG" == t.nodeName && this.addImage(t), this.options.background === !0 && this.addElementBackgroundImages(t); var e = t.nodeType; if (e && d[e]) { for (var i = t.querySelectorAll("img"), n = 0; n < i.length; n++) { var o = i[n]; this.addImage(o) } if ("string" == typeof this.options.background) { var r = t.querySelectorAll(this.options.background); for (n = 0; n < r.length; n++) { var s = r[n]; this.addElementBackgroundImages(s) } } } }; var d = { 1: !0, 9: !0, 11: !0 }; return o.prototype.addElementBackgroundImages = function (t) { var e = getComputedStyle(t); if (e) for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(e.backgroundImage); null !== n;) { var o = n && n[2]; o && this.addBackground(o, t), n = i.exec(e.backgroundImage) } }, o.prototype.addImage = function (t) { var e = new r(t); this.images.push(e) }, o.prototype.addBackground = function (t, e) { var i = new s(t, e); this.images.push(i) }, o.prototype.check = function () { function t(t, i, n) { setTimeout(function () { e.progress(t, i, n) }) } var e = this; return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function (e) { e.once("progress", t), e.check() }) : void this.complete() }, o.prototype.progress = function (t, e, i) { this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !t.isLoaded, this.emitEvent("progress", [this, t, e]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, t), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, t, e) }, o.prototype.complete = function () { var t = this.hasAnyBroken ? "fail" : "done"; if (this.isComplete = !0, this.emitEvent(t, [this]), this.emitEvent("always", [this]), this.jqDeferred) { var e = this.hasAnyBroken ? "reject" : "resolve"; this.jqDeferred[e](this) } }, r.prototype = Object.create(e.prototype), r.prototype.check = function () { var t = this.getIsImageComplete(); return t ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void (this.proxyImage.src = this.img.src)) }, r.prototype.getIsImageComplete = function () { return this.img.complete && void 0 !== this.img.naturalWidth }, r.prototype.confirm = function (t, e) { this.isLoaded = t, this.emitEvent("progress", [this, this.img, e]) }, r.prototype.handleEvent = function (t) { var e = "on" + t.type; this[e] && this[e](t) }, r.prototype.onload = function () { this.confirm(!0, "onload"), this.unbindEvents() }, r.prototype.onerror = function () { this.confirm(!1, "onerror"), this.unbindEvents() }, r.prototype.unbindEvents = function () { this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this) }, s.prototype = Object.create(r.prototype), s.prototype.check = function () { this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url; var t = this.getIsImageComplete(); t && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents()) }, s.prototype.unbindEvents = function () { this.img.removeEventListener("load", this), this.img.removeEventListener("error", this) }, s.prototype.confirm = function (t, e) { this.isLoaded = t, this.emitEvent("progress", [this, this.element, e]) }, o.makeJQueryPlugin = function (e) { e = e || t.jQuery, e && (h = e, h.fn.imagesLoaded = function (t, e) { var i = new o(this, t, e); return i.jqDeferred.promise(h(this)) }) }, o.makeJQueryPlugin(), o });

/*!
   --------------------------------
   Infinite Scroll
   --------------------------------
   + https://github.com/paulirish/infinite-scroll
   + version 2.1.0
   + Copyright 2011/12 Paul Irish & Luke Shumard
   + Licensed under the MIT license

   + Documentation: http://infinite-scroll.com/
*/
; (function (e) { if (typeof define === "function" && define.amd) { define(["jquery"], e) } else { e(jQuery) } })(function (e, t) { "use strict"; e.infinitescroll = function (n, r, i) { this.element = e(i); if (!this._create(n, r)) { this.failed = true } }; e.infinitescroll.defaults = { loading: { finished: t, finishedMsg: "<em>Congratulations, you've reached the end of the internet.</em>", img: "data:image/gif;base64,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", msg: null, msgText: "<em>Loading the next set of posts...</em>", selector: null, speed: "fast", start: t }, state: { isDuringAjax: false, isInvalidPage: false, isDestroyed: false, isDone: false, isPaused: false, isBeyondMaxPage: false, currPage: 1 }, debug: false, behavior: t, binder: e(window), nextSelector: "div.navigation a:first", navSelector: "div.navigation", contentSelector: null, extraScrollPx: 150, itemSelector: "div.post", animate: false, pathParse: t, dataType: "html", appendCallback: true, bufferPx: 40, errorCallback: function () { }, infid: 0, pixelsFromNavToBottom: t, path: t, prefill: false, maxPage: t }; e.infinitescroll.prototype = { _binding: function (n) { var r = this, i = r.options; i.v = "2.0b2.120520"; if (!!i.behavior && this["_binding_" + i.behavior] !== t) { this["_binding_" + i.behavior].call(this); return } if (n !== "bind" && n !== "unbind") { this._debug("Binding value  " + n + " not valid"); return false } if (n === "unbind") { this.options.binder.unbind("smartscroll.infscr." + r.options.infid) } else { this.options.binder[n]("smartscroll.infscr." + r.options.infid, function () { r.scroll() }) } this._debug("Binding", n) }, _create: function (r, i) { var s = e.extend(true, {}, e.infinitescroll.defaults, r); this.options = s; var o = e(window); var u = this; if (!u._validate(r)) { return false } var a = e(s.nextSelector).attr("href"); if (!a) { this._debug("Navigation selector not found"); return false } s.path = s.path || this._determinepath(a); s.contentSelector = s.contentSelector || this.element; s.loading.selector = s.loading.selector || s.contentSelector; s.loading.msg = s.loading.msg || e('<div id="infscr-loading"><img alt="Loading..." src="' + s.loading.img + '" /><div>' + s.loading.msgText + "</div></div>"); (new Image).src = s.loading.img; if (s.pixelsFromNavToBottom === t) { s.pixelsFromNavToBottom = e(document).height() - e(s.navSelector).offset().top; this._debug("pixelsFromNavToBottom: " + s.pixelsFromNavToBottom) } var f = this; s.loading.start = s.loading.start || function () { e(s.navSelector).hide(); s.loading.msg.appendTo(s.loading.selector).show(s.loading.speed, e.proxy(function () { this.beginAjax(s) }, f)) }; s.loading.finished = s.loading.finished || function () { if (!s.state.isBeyondMaxPage) s.loading.msg.fadeOut(s.loading.speed) }; s.callback = function (n, r, u) { if (!!s.behavior && n["_callback_" + s.behavior] !== t) { n["_callback_" + s.behavior].call(e(s.contentSelector)[0], r, u) } if (i) { i.call(e(s.contentSelector)[0], r, s, u) } if (s.prefill) { o.bind("resize.infinite-scroll", n._prefill) } }; if (r.debug) { if (Function.prototype.bind && (typeof console === "object" || typeof console === "function") && typeof console.log === "object") { ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"].forEach(function (e) { console[e] = this.call(console[e], console) }, Function.prototype.bind) } } this._setup(); if (s.prefill) { this._prefill() } return true }, _prefill: function () { function i() { return e(n.options.contentSelector).height() <= r.height() } var n = this; var r = e(window); this._prefill = function () { if (i()) { n.scroll() } r.bind("resize.infinite-scroll", function () { if (i()) { r.unbind("resize.infinite-scroll"); n.scroll() } }) }; this._prefill() }, _debug: function () { if (true !== this.options.debug) { return } if (typeof console !== "undefined" && typeof console.log === "function") { if (Array.prototype.slice.call(arguments).length === 1 && typeof Array.prototype.slice.call(arguments)[0] === "string") { console.log(Array.prototype.slice.call(arguments).toString()) } else { console.log(Array.prototype.slice.call(arguments)) } } else if (!Function.prototype.bind && typeof console !== "undefined" && typeof console.log === "object") { Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments)) } }, _determinepath: function (n) { var r = this.options; if (!!r.behavior && this["_determinepath_" + r.behavior] !== t) { return this["_determinepath_" + r.behavior].call(this, n) } if (!!r.pathParse) { this._debug("pathParse manual"); return r.pathParse(n, this.options.state.currPage + 1) } else if (n.match(/^(.*?)\b2\b(.*?$)/)) { n = n.match(/^(.*?)\b2\b(.*?$)/).slice(1) } else if (n.match(/^(.*?)2(.*?$)/)) { if (n.match(/^(.*?page=)2(\/.*|$)/)) { n = n.match(/^(.*?page=)2(\/.*|$)/).slice(1); return n } n = n.match(/^(.*?)2(.*?$)/).slice(1) } else { if (n.match(/^(.*?page=)1(\/.*|$)/)) { n = n.match(/^(.*?page=)1(\/.*|$)/).slice(1); return n } else { this._debug("Sorry, we couldn't parse your Next (Previous Posts) URL. Verify your the css selector points to the correct A tag. If you still get this error: yell, scream, and kindly ask for help at infinite-scroll.com."); r.state.isInvalidPage = true } } this._debug("determinePath", n); return n }, _error: function (n) { var r = this.options; if (!!r.behavior && this["_error_" + r.behavior] !== t) { this["_error_" + r.behavior].call(this, n); return } if (n !== "destroy" && n !== "end") { n = "unknown" } this._debug("Error", n); if (n === "end" || r.state.isBeyondMaxPage) { this._showdonemsg() } r.state.isDone = true; r.state.currPage = 1; r.state.isPaused = false; r.state.isBeyondMaxPage = false; this._binding("unbind") }, _loadcallback: function (r, i, s) { var o = this.options, u = this.options.callback, a = o.state.isDone ? "done" : !o.appendCallback ? "no-append" : "append", f; if (!!o.behavior && this["_loadcallback_" + o.behavior] !== t) { this["_loadcallback_" + o.behavior].call(this, r, i); return } switch (a) { case "done": this._showdonemsg(); return false; case "no-append": if (o.dataType === "html") { i = "<div>" + i + "</div>"; i = e(i).find(o.itemSelector) } if (i.length === 0) { return this._error("end") } break; case "append": var l = r.children(); if (l.length === 0) { return this._error("end") } f = document.createDocumentFragment(); while (r[0].firstChild) { f.appendChild(r[0].firstChild) } this._debug("contentSelector", e(o.contentSelector)[0]); e(o.contentSelector)[0].appendChild(f); i = l.get(); break }o.loading.finished.call(e(o.contentSelector)[0], o); if (o.animate) { var c = e(window).scrollTop() + e(o.loading.msg).height() + o.extraScrollPx + "px"; e("html,body").animate({ scrollTop: c }, 800, function () { o.state.isDuringAjax = false }) } if (!o.animate) { o.state.isDuringAjax = false } u(this, i, s); if (o.prefill) { this._prefill() } }, _nearbottom: function () { var r = this.options, i = 0 + e(document).height() - r.binder.scrollTop() - e(window).height(); if (!!r.behavior && this["_nearbottom_" + r.behavior] !== t) { return this["_nearbottom_" + r.behavior].call(this) } this._debug("math:", i, r.pixelsFromNavToBottom); return i - r.bufferPx < r.pixelsFromNavToBottom }, _pausing: function (n) { var r = this.options; if (!!r.behavior && this["_pausing_" + r.behavior] !== t) { this["_pausing_" + r.behavior].call(this, n); return } if (n !== "pause" && n !== "resume" && n !== null) { this._debug("Invalid argument. Toggling pause value instead") } n = n && (n === "pause" || n === "resume") ? n : "toggle"; switch (n) { case "pause": r.state.isPaused = true; break; case "resume": r.state.isPaused = false; break; case "toggle": r.state.isPaused = !r.state.isPaused; break }this._debug("Paused", r.state.isPaused); return false }, _setup: function () { var n = this.options; if (!!n.behavior && this["_setup_" + n.behavior] !== t) { this["_setup_" + n.behavior].call(this); return } this._binding("bind"); return false }, _showdonemsg: function () { var r = this.options; if (!!r.behavior && this["_showdonemsg_" + r.behavior] !== t) { this["_showdonemsg_" + r.behavior].call(this); return } r.loading.msg.find("img").hide().parent().find("div").html(r.loading.finishedMsg).animate({ opacity: 1 }, 2e3, function () { e(this).parent().fadeOut(r.loading.speed) }); r.errorCallback.call(e(r.contentSelector)[0], "done") }, _validate: function (n) { for (var r in n) { if (r.indexOf && r.indexOf("Selector") > -1 && e(n[r]).length === 0) { this._debug("Your " + r + " found no elements."); return false } } return true }, bind: function () { this._binding("bind") }, destroy: function () { this.options.state.isDestroyed = true; this.options.loading.finished(); return this._error("destroy") }, pause: function () { this._pausing("pause") }, resume: function () { this._pausing("resume") }, beginAjax: function (r) { var i = this, s = r.path, o, u, a, f; r.state.currPage++; if (r.maxPage !== t && r.state.currPage > r.maxPage) { r.state.isBeyondMaxPage = true; this.destroy(); return } o = e(r.contentSelector).is("table, tbody") ? e("<tbody/>") : e("<div/>"); u = typeof s === "function" ? s(r.state.currPage) : s.join(r.state.currPage); i._debug("heading into ajax", u); a = r.dataType === "html" || r.dataType === "json" ? r.dataType : "html+callback"; if (r.appendCallback && r.dataType === "html") { a += "+callback" } switch (a) { case "html+callback": i._debug("Using HTML via .load() method"); o.load(u + " " + r.itemSelector, t, function (t) { i._loadcallback(o, t, u) }); break; case "html": i._debug("Using " + a.toUpperCase() + " via $.ajax() method"); e.ajax({ url: u, dataType: r.dataType, complete: function (t, n) { f = typeof t.isResolved !== "undefined" ? t.isResolved() : n === "success" || n === "notmodified"; if (f) { i._loadcallback(o, t.responseText, u) } else { i._error("end") } } }); break; case "json": i._debug("Using " + a.toUpperCase() + " via $.ajax() method"); e.ajax({ dataType: "json", type: "GET", url: u, success: function (e, n, s) { f = typeof s.isResolved !== "undefined" ? s.isResolved() : n === "success" || n === "notmodified"; if (r.appendCallback) { if (r.template !== t) { var a = r.template(e); o.append(a); if (f) { i._loadcallback(o, a) } else { i._error("end") } } else { i._debug("template must be defined."); i._error("end") } } else { if (f) { i._loadcallback(o, e, u) } else { i._error("end") } } }, error: function () { i._debug("JSON ajax request failed."); i._error("end") } }); break } }, retrieve: function (r) { r = r || null; var i = this, s = i.options; if (!!s.behavior && this["retrieve_" + s.behavior] !== t) { this["retrieve_" + s.behavior].call(this, r); return } if (s.state.isDestroyed) { this._debug("Instance is destroyed"); return false } s.state.isDuringAjax = true; s.loading.start.call(e(s.contentSelector)[0], s) }, scroll: function () { var n = this.options, r = n.state; if (!!n.behavior && this["scroll_" + n.behavior] !== t) { this["scroll_" + n.behavior].call(this); return } if (r.isDuringAjax || r.isInvalidPage || r.isDone || r.isDestroyed || r.isPaused) { return } if (!this._nearbottom()) { return } this.retrieve() }, toggle: function () { this._pausing() }, unbind: function () { this._binding("unbind") }, update: function (n) { if (e.isPlainObject(n)) { this.options = e.extend(true, this.options, n) } } }; e.fn.infinitescroll = function (n, r) { var i = typeof n; switch (i) { case "string": var s = Array.prototype.slice.call(arguments, 1); this.each(function () { var t = e.data(this, "infinitescroll"); if (!t) { return false } if (!e.isFunction(t[n]) || n.charAt(0) === "_") { return false } t[n].apply(t, s) }); break; case "object": this.each(function () { var t = e.data(this, "infinitescroll"); if (t) { t.update(n) } else { t = new e.infinitescroll(n, r, this); if (!t.failed) { e.data(this, "infinitescroll", t) } } }); break }return this }; var n = e.event, r; n.special.smartscroll = { setup: function () { e(this).bind("scroll", n.special.smartscroll.handler) }, teardown: function () { e(this).unbind("scroll", n.special.smartscroll.handler) }, handler: function (t, n) { var i = this, s = arguments; t.type = "smartscroll"; if (r) { clearTimeout(r) } r = setTimeout(function () { e(i).trigger("smartscroll", s) }, n === "execAsap" ? 0 : 100) } }; e.fn.smartscroll = function (e) { return e ? this.bind("smartscroll", e) : this.trigger("smartscroll", ["execAsap"]) } });


(function () { var a = this, b = a._, c = {}, d = Array.prototype, e = Object.prototype, f = Function.prototype, g = d.push, h = d.slice, i = d.concat, j = e.toString, k = e.hasOwnProperty, l = d.forEach, m = d.map, n = d.reduce, o = d.reduceRight, p = d.filter, q = d.every, r = d.some, s = d.indexOf, t = d.lastIndexOf, u = Array.isArray, v = Object.keys, w = f.bind, x = function (a) { return a instanceof x ? a : this instanceof x ? void (this._wrapped = a) : new x(a) }; "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = x), exports._ = x) : a._ = x, x.VERSION = "1.6.0"; var y = x.each = x.forEach = function (a, b, d) { if (null == a) return a; if (l && a.forEach === l) a.forEach(b, d); else if (a.length === +a.length) { for (var e = 0, f = a.length; f > e; e++)if (b.call(d, a[e], e, a) === c) return } else for (var g = x.keys(a), e = 0, f = g.length; f > e; e++)if (b.call(d, a[g[e]], g[e], a) === c) return; return a }; x.map = x.collect = function (a, b, c) { var d = []; return null == a ? d : m && a.map === m ? a.map(b, c) : (y(a, function (a, e, f) { d.push(b.call(c, a, e, f)) }), d) }; var z = "Reduce of empty array with no initial value"; x.reduce = x.foldl = x.inject = function (a, b, c, d) { var e = arguments.length > 2; if (null == a && (a = []), n && a.reduce === n) return d && (b = x.bind(b, d)), e ? a.reduce(b, c) : a.reduce(b); if (y(a, function (a, f, g) { e ? c = b.call(d, c, a, f, g) : (c = a, e = !0) }), !e) throw new TypeError(z); return c }, x.reduceRight = x.foldr = function (a, b, c, d) { var e = arguments.length > 2; if (null == a && (a = []), o && a.reduceRight === o) return d && (b = x.bind(b, d)), e ? a.reduceRight(b, c) : a.reduceRight(b); var f = a.length; if (f !== +f) { var g = x.keys(a); f = g.length } if (y(a, function (h, i, j) { i = g ? g[--f] : --f, e ? c = b.call(d, c, a[i], i, j) : (c = a[i], e = !0) }), !e) throw new TypeError(z); return c }, x.find = x.detect = function (a, b, c) { var d; return A(a, function (a, e, f) { return b.call(c, a, e, f) ? (d = a, !0) : void 0 }), d }, x.filter = x.select = function (a, b, c) { var d = []; return null == a ? d : p && a.filter === p ? a.filter(b, c) : (y(a, function (a, e, f) { b.call(c, a, e, f) && d.push(a) }), d) }, x.reject = function (a, b, c) { return x.filter(a, function (a, d, e) { return !b.call(c, a, d, e) }, c) }, x.every = x.all = function (a, b, d) { b || (b = x.identity); var e = !0; return null == a ? e : q && a.every === q ? a.every(b, d) : (y(a, function (a, f, g) { return (e = e && b.call(d, a, f, g)) ? void 0 : c }), !!e) }; var A = x.some = x.any = function (a, b, d) { b || (b = x.identity); var e = !1; return null == a ? e : r && a.some === r ? a.some(b, d) : (y(a, function (a, f, g) { return e || (e = b.call(d, a, f, g)) ? c : void 0 }), !!e) }; x.contains = x.include = function (a, b) { return null == a ? !1 : s && a.indexOf === s ? -1 != a.indexOf(b) : A(a, function (a) { return a === b }) }, x.invoke = function (a, b) { var c = h.call(arguments, 2), d = x.isFunction(b); return x.map(a, function (a) { return (d ? b : a[b]).apply(a, c) }) }, x.pluck = function (a, b) { return x.map(a, x.property(b)) }, x.where = function (a, b) { return x.filter(a, x.matches(b)) }, x.findWhere = function (a, b) { return x.find(a, x.matches(b)) }, x.max = function (a, b, c) { if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535) return Math.max.apply(Math, a); var d = -(1 / 0), e = -(1 / 0); return y(a, function (a, f, g) { var h = b ? b.call(c, a, f, g) : a; h > e && (d = a, e = h) }), d }, x.min = function (a, b, c) { if (!b && x.isArray(a) && a[0] === +a[0] && a.length < 65535) return Math.min.apply(Math, a); var d = 1 / 0, e = 1 / 0; return y(a, function (a, f, g) { var h = b ? b.call(c, a, f, g) : a; e > h && (d = a, e = h) }), d }, x.shuffle = function (a) { var b, c = 0, d = []; return y(a, function (a) { b = x.random(c++), d[c - 1] = d[b], d[b] = a }), d }, x.sample = function (a, b, c) { return null == b || c ? (a.length !== +a.length && (a = x.values(a)), a[x.random(a.length - 1)]) : x.shuffle(a).slice(0, Math.max(0, b)) }; var B = function (a) { return null == a ? x.identity : x.isFunction(a) ? a : x.property(a) }; x.sortBy = function (a, b, c) { return b = B(b), x.pluck(x.map(a, function (a, d, e) { return { value: a, index: d, criteria: b.call(c, a, d, e) } }).sort(function (a, b) { var c = a.criteria, d = b.criteria; if (c !== d) { if (c > d || void 0 === c) return 1; if (d > c || void 0 === d) return -1 } return a.index - b.index }), "value") }; var C = function (a) { return function (b, c, d) { var e = {}; return c = B(c), y(b, function (f, g) { var h = c.call(d, f, g, b); a(e, h, f) }), e } }; x.groupBy = C(function (a, b, c) { x.has(a, b) ? a[b].push(c) : a[b] = [c] }), x.indexBy = C(function (a, b, c) { a[b] = c }), x.countBy = C(function (a, b) { x.has(a, b) ? a[b]++ : a[b] = 1 }), x.sortedIndex = function (a, b, c, d) { c = B(c); for (var e = c.call(d, b), f = 0, g = a.length; g > f;) { var h = f + g >>> 1; c.call(d, a[h]) < e ? f = h + 1 : g = h } return f }, x.toArray = function (a) { return a ? x.isArray(a) ? h.call(a) : a.length === +a.length ? x.map(a, x.identity) : x.values(a) : [] }, x.size = function (a) { return null == a ? 0 : a.length === +a.length ? a.length : x.keys(a).length }, x.first = x.head = x.take = function (a, b, c) { return null == a ? void 0 : null == b || c ? a[0] : 0 > b ? [] : h.call(a, 0, b) }, x.initial = function (a, b, c) { return h.call(a, 0, a.length - (null == b || c ? 1 : b)) }, x.last = function (a, b, c) { return null == a ? void 0 : null == b || c ? a[a.length - 1] : h.call(a, Math.max(a.length - b, 0)) }, x.rest = x.tail = x.drop = function (a, b, c) { return h.call(a, null == b || c ? 1 : b) }, x.compact = function (a) { return x.filter(a, x.identity) }; var D = function (a, b, c) { return b && x.every(a, x.isArray) ? i.apply(c, a) : (y(a, function (a) { x.isArray(a) || x.isArguments(a) ? b ? g.apply(c, a) : D(a, b, c) : c.push(a) }), c) }; x.flatten = function (a, b) { return D(a, b, []) }, x.without = function (a) { return x.difference(a, h.call(arguments, 1)) }, x.partition = function (a, b) { var c = [], d = []; return y(a, function (a) { (b(a) ? c : d).push(a) }), [c, d] }, x.uniq = x.unique = function (a, b, c, d) { x.isFunction(b) && (d = c, c = b, b = !1); var e = c ? x.map(a, c, d) : a, f = [], g = []; return y(e, function (c, d) { (b ? d && g[g.length - 1] === c : x.contains(g, c)) || (g.push(c), f.push(a[d])) }), f }, x.union = function () { return x.uniq(x.flatten(arguments, !0)) }, x.intersection = function (a) { var b = h.call(arguments, 1); return x.filter(x.uniq(a), function (a) { return x.every(b, function (b) { return x.contains(b, a) }) }) }, x.difference = function (a) { var b = i.apply(d, h.call(arguments, 1)); return x.filter(a, function (a) { return !x.contains(b, a) }) }, x.zip = function () { for (var a = x.max(x.pluck(arguments, "length").concat(0)), b = new Array(a), c = 0; a > c; c++)b[c] = x.pluck(arguments, "" + c); return b }, x.object = function (a, b) { if (null == a) return {}; for (var c = {}, d = 0, e = a.length; e > d; d++)b ? c[a[d]] = b[d] : c[a[d][0]] = a[d][1]; return c }, x.indexOf = function (a, b, c) { if (null == a) return -1; var d = 0, e = a.length; if (c) { if ("number" != typeof c) return d = x.sortedIndex(a, b), a[d] === b ? d : -1; d = 0 > c ? Math.max(0, e + c) : c } if (s && a.indexOf === s) return a.indexOf(b, c); for (; e > d; d++)if (a[d] === b) return d; return -1 }, x.lastIndexOf = function (a, b, c) { if (null == a) return -1; var d = null != c; if (t && a.lastIndexOf === t) return d ? a.lastIndexOf(b, c) : a.lastIndexOf(b); for (var e = d ? c : a.length; e--;)if (a[e] === b) return e; return -1 }, x.range = function (a, b, c) { arguments.length <= 1 && (b = a || 0, a = 0), c = arguments[2] || 1; for (var d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = new Array(d); d > e;)f[e++] = a, a += c; return f }; var E = function () { }; x.bind = function (a, b) { var c, d; if (w && a.bind === w) return w.apply(a, h.call(arguments, 1)); if (!x.isFunction(a)) throw new TypeError; return c = h.call(arguments, 2), d = function () { if (!(this instanceof d)) return a.apply(b, c.concat(h.call(arguments))); E.prototype = a.prototype; var e = new E; E.prototype = null; var f = a.apply(e, c.concat(h.call(arguments))); return Object(f) === f ? f : e } }, x.partial = function (a) { var b = h.call(arguments, 1); return function () { for (var c = 0, d = b.slice(), e = 0, f = d.length; f > e; e++)d[e] === x && (d[e] = arguments[c++]); for (; c < arguments.length;)d.push(arguments[c++]); return a.apply(this, d) } }, x.bindAll = function (a) { var b = h.call(arguments, 1); if (0 === b.length) throw new Error("bindAll must be passed function names"); return y(b, function (b) { a[b] = x.bind(a[b], a) }), a }, x.memoize = function (a, b) { var c = {}; return b || (b = x.identity), function () { var d = b.apply(this, arguments); return x.has(c, d) ? c[d] : c[d] = a.apply(this, arguments) } }, x.delay = function (a, b) { var c = h.call(arguments, 2); return setTimeout(function () { return a.apply(null, c) }, b) }, x.defer = function (a) { return x.delay.apply(x, [a, 1].concat(h.call(arguments, 1))) }, x.throttle = function (a, b, c) { var d, e, f, g = null, h = 0; c || (c = {}); var i = function () { h = c.leading === !1 ? 0 : x.now(), g = null, f = a.apply(d, e), d = e = null }; return function () { var j = x.now(); h || c.leading !== !1 || (h = j); var k = b - (j - h); return d = this, e = arguments, 0 >= k ? (clearTimeout(g), g = null, h = j, f = a.apply(d, e), d = e = null) : g || c.trailing === !1 || (g = setTimeout(i, k)), f } }, x.debounce = function (a, b, c) { var d, e, f, g, h, i = function () { var j = x.now() - g; b > j ? d = setTimeout(i, b - j) : (d = null, c || (h = a.apply(f, e), f = e = null)) }; return function () { f = this, e = arguments, g = x.now(); var j = c && !d; return d || (d = setTimeout(i, b)), j && (h = a.apply(f, e), f = e = null), h } }, x.once = function (a) { var b, c = !1; return function () { return c ? b : (c = !0, b = a.apply(this, arguments), a = null, b) } }, x.wrap = function (a, b) { return x.partial(b, a) }, x.compose = function () { var a = arguments; return function () { for (var b = arguments, c = a.length - 1; c >= 0; c--)b = [a[c].apply(this, b)]; return b[0] } }, x.after = function (a, b) { return function () { return --a < 1 ? b.apply(this, arguments) : void 0 } }, x.keys = function (a) { if (!x.isObject(a)) return []; if (v) return v(a); var b = []; for (var c in a) x.has(a, c) && b.push(c); return b }, x.values = function (a) { for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)d[e] = a[b[e]]; return d }, x.pairs = function (a) { for (var b = x.keys(a), c = b.length, d = new Array(c), e = 0; c > e; e++)d[e] = [b[e], a[b[e]]]; return d }, x.invert = function (a) { for (var b = {}, c = x.keys(a), d = 0, e = c.length; e > d; d++)b[a[c[d]]] = c[d]; return b }, x.functions = x.methods = function (a) { var b = []; for (var c in a) x.isFunction(a[c]) && b.push(c); return b.sort() }, x.extend = function (a) { return y(h.call(arguments, 1), function (b) { if (b) for (var c in b) a[c] = b[c] }), a }, x.pick = function (a) { var b = {}, c = i.apply(d, h.call(arguments, 1)); return y(c, function (c) { c in a && (b[c] = a[c]) }), b }, x.omit = function (a) { var b = {}, c = i.apply(d, h.call(arguments, 1)); for (var e in a) x.contains(c, e) || (b[e] = a[e]); return b }, x.defaults = function (a) { return y(h.call(arguments, 1), function (b) { if (b) for (var c in b) void 0 === a[c] && (a[c] = b[c]) }), a }, x.clone = function (a) { return x.isObject(a) ? x.isArray(a) ? a.slice() : x.extend({}, a) : a }, x.tap = function (a, b) { return b(a), a }; var F = function (a, b, c, d) { if (a === b) return 0 !== a || 1 / a == 1 / b; if (null == a || null == b) return a === b; a instanceof x && (a = a._wrapped), b instanceof x && (b = b._wrapped); var e = j.call(a); if (e != j.call(b)) return !1; switch (e) { case "[object String]": return a == String(b); case "[object Number]": return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b; case "[object Date]": case "[object Boolean]": return +a == +b; case "[object RegExp]": return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase }if ("object" != typeof a || "object" != typeof b) return !1; for (var f = c.length; f--;)if (c[f] == a) return d[f] == b; var g = a.constructor, h = b.constructor; if (g !== h && !(x.isFunction(g) && g instanceof g && x.isFunction(h) && h instanceof h) && "constructor" in a && "constructor" in b) return !1; c.push(a), d.push(b); var i = 0, k = !0; if ("[object Array]" == e) { if (i = a.length, k = i == b.length) for (; i-- && (k = F(a[i], b[i], c, d));); } else { for (var l in a) if (x.has(a, l) && (i++, !(k = x.has(b, l) && F(a[l], b[l], c, d)))) break; if (k) { for (l in b) if (x.has(b, l) && !i--) break; k = !i } } return c.pop(), d.pop(), k }; x.isEqual = function (a, b) { return F(a, b, [], []) }, x.isEmpty = function (a) { if (null == a) return !0; if (x.isArray(a) || x.isString(a)) return 0 === a.length; for (var b in a) if (x.has(a, b)) return !1; return !0 }, x.isElement = function (a) { return !(!a || 1 !== a.nodeType) }, x.isArray = u || function (a) { return "[object Array]" == j.call(a) }, x.isObject = function (a) { return a === Object(a) }, y(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function (a) { x["is" + a] = function (b) { return j.call(b) == "[object " + a + "]" } }), x.isArguments(arguments) || (x.isArguments = function (a) { return !(!a || !x.has(a, "callee")) }), "function" != typeof /./ && (x.isFunction = function (a) { return "function" == typeof a }), x.isFinite = function (a) { return isFinite(a) && !isNaN(parseFloat(a)) }, x.isNaN = function (a) { return x.isNumber(a) && a != +a }, x.isBoolean = function (a) { return a === !0 || a === !1 || "[object Boolean]" == j.call(a) }, x.isNull = function (a) { return null === a }, x.isUndefined = function (a) { return void 0 === a }, x.has = function (a, b) { return k.call(a, b) }, x.noConflict = function () { return a._ = b, this }, x.identity = function (a) { return a }, x.constant = function (a) { return function () { return a } }, x.property = function (a) { return function (b) { return b[a] } }, x.matches = function (a) { return function (b) { if (b === a) return !0; for (var c in a) if (a[c] !== b[c]) return !1; return !0 } }, x.times = function (a, b, c) { for (var d = Array(Math.max(0, a)), e = 0; a > e; e++)d[e] = b.call(c, e); return d }, x.random = function (a, b) { return null == b && (b = a, a = 0), a + Math.floor(Math.random() * (b - a + 1)) }, x.now = Date.now || function () { return (new Date).getTime() }; var G = { escape: { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" } }; G.unescape = x.invert(G.escape); var H = { escape: new RegExp("[" + x.keys(G.escape).join("") + "]", "g"), unescape: new RegExp("(" + x.keys(G.unescape).join("|") + ")", "g") }; x.each(["escape", "unescape"], function (a) { x[a] = function (b) { return null == b ? "" : ("" + b).replace(H[a], function (b) { return G[a][b] }) } }), x.result = function (a, b) { if (null == a) return void 0; var c = a[b]; return x.isFunction(c) ? c.call(a) : c }, x.mixin = function (a) { y(x.functions(a), function (b) { var c = x[b] = a[b]; x.prototype[b] = function () { var a = [this._wrapped]; return g.apply(a, arguments), M.call(this, c.apply(x, a)) } }) }; var I = 0; x.uniqueId = function (a) { var b = ++I + ""; return a ? a + b : b }, x.templateSettings = { evaluate: /<%([\s\S]+?)%>/g, interpolate: /<%=([\s\S]+?)%>/g, escape: /<%-([\s\S]+?)%>/g }; var J = /(.)^/, K = { "'": "'", "\\": "\\", "\r": "r", "\n": "n", "	": "t", "\u2028": "u2028", "\u2029": "u2029" }, L = /\\|'|\r|\n|\t|\u2028|\u2029/g; x.template = function (a, b, c) { var d; c = x.defaults({}, c, x.templateSettings); var e = new RegExp([(c.escape || J).source, (c.interpolate || J).source, (c.evaluate || J).source].join("|") + "|$", "g"), f = 0, g = "__p+='"; a.replace(e, function (b, c, d, e, h) { return g += a.slice(f, h).replace(L, function (a) { return "\\" + K[a] }), c && (g += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'"), d && (g += "'+\n((__t=(" + d + "))==null?'':__t)+\n'"), e && (g += "';\n" + e + "\n__p+='"), f = h + b.length, b }), g += "';\n", c.variable || (g = "with(obj||{}){\n" + g + "}\n"), g = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + g + "return __p;\n"; try { d = new Function(c.variable || "obj", "_", g) } catch (h) { throw h.source = g, h } if (b) return d(b, x); var i = function (a) { return d.call(this, a, x) }; return i.source = "function(" + (c.variable || "obj") + "){\n" + g + "}", i }, x.chain = function (a) { return x(a).chain() }; var M = function (a) { return this._chain ? x(a).chain() : a }; x.mixin(x), y(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (a) { var b = d[a]; x.prototype[a] = function () { var c = this._wrapped; return b.apply(c, arguments), "shift" != a && "splice" != a || 0 !== c.length || delete c[0], M.call(this, c) } }), y(["concat", "join", "slice"], function (a) { var b = d[a]; x.prototype[a] = function () { return M.call(this, b.apply(this._wrapped, arguments)) } }), x.extend(x.prototype, { chain: function () { return this._chain = !0, this }, value: function () { return this._wrapped } }), "function" == typeof define && define.amd && define("underscore", [], function () { return x }) }).call(this);

(function ($, _) {
   if (typeof MuntzBlog === 'undefined') { MuntzBlog = {}; }
   MuntzBlog.Blog = function (selector, config) {
      var blogSelector = $(selector); var blog = this; var blogArticle = '.blog-article'; var articleSizer = '.article-sizer'; var isotope; config = $.extend({ page: 1, loader: $('.content-loader'), initialize: true, loading: false }, config || {}); init(); function init() { initIsotope(); getArticles(); config.initialize = false; $(document).scroll(function () { getArticles(); }); }
      function initIsotope() { if ($.fn.isotope) { isotope = blogSelector.isotope({ itemSelector: blogArticle, percentPosition: true, masonry: { columnWidth: articleSizer } }); } }
      function getUrl() {
         var url; var lastChar = config.url.substr(-1); if (lastChar != '/') { url = config.url + '/' + config.page; } else { url = config.url + config.page; }
         return url + '/' + getTags();
      }
      function getTags() { if (config.tags.length > 0) { return config.tags.toString(); } else { return ''; } }
      function getArticles() {
         blogSelector = $(selector); var contentAreaOffset = blogSelector.offset(); if (contentAreaOffset) {
            var windowHeight = window.innerHeight ? window.innerHeight : $(window).height(); var scrollPosition = $(document).scrollTop() + windowHeight; if (scrollPosition >= (contentAreaOffset.top + blogSelector.height()) || config.initialize) {
               if (config.page <= config.totalPages && !config.loading) {
                  config.loading = true; $.ajax({ method: "POST", url: getUrl(), dataType: "json", beforeSend: function () { config.loader.show(); } }).success(function (data) {
                     config.page++; if (data) { $.each(data, function (index, value) { blogSelector.append(value); blogSelector.imagesLoaded().done(function (instance) { $(blogArticle).show(); isotope = blogSelector.isotope('reloadItems').isotope({ itemSelector: blogArticle, percentPosition: true, masonry: { columnWidth: articleSizer } }); contentAreaOffset = blogSelector.offset(); var contentHeightOffset = contentAreaOffset.top + blogSelector.height(); if (contentHeightOffset <= windowHeight) { getArticles(); } }); }); }
                     config.loading = false; config.loader.hide();
                  });
               }
            }
         }
      }
      return blog;
   };
})(jQuery, _);

