"use strict";

//source for parts of js solution: https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c#.uwfs3la8l
//http://jsfiddle.net/mariusc23/s6mLJ/31/

var Navigation = {
  config: {
    tl: new TimelineLite(),
    didScroll: false,
    delta: 5,
    lastScrollTop: 0,
    lastScrollUp: false,
    lastScrollDown: false
  },
  dom: {
    nav: document.getElementById('js-nav'),
    // navHeight: parseFloat(getComputedStyle(document.getElementById('js-nav'), null).height.split('px')[0]),
    // boxShadow: parseFloat(getComputedStyle(document.getElementById('js-nav'), null).boxShadow[27]),
    navOpen: document.getElementById('js-nav-open'),
    navClose: document.getElementById('js-nav-close'),
    menu: document.getElementById('js-menu')
  },
  getHeight: function getHeight() {
    var height = parseFloat(getComputedStyle(this.dom.nav).height.split('px')[0]);
    var boxShadow = parseFloat(getComputedStyle(this.dom.nav).boxShadow[27]);
    return height + boxShadow;
  },
  callbackSetInterval: function callbackSetInterval() {
    if (this.config.didScroll) {
      this.config.didScroll = false;
      this.hasScrolled();
    }
  },
  addSetInterval: function addSetInterval() {
    setInterval(this.callbackSetInterval.bind(this), 250);
  },
  //animations
  animScrollUp: function animScrollUp() {
    TweenLite.to(this.dom.nav, 0.6, { ease: Power3.easeOut, boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.6)", y: 0, force3D: true });
  },
  animScrollDown: function animScrollDown(height) {
    TweenLite.to(this.dom.nav, 0.6, { ease: Power3.easeIn, boxShadow: "0px 0px 8px rgba(0, 0, 0, 0)", y: -height, force3D: true });
  },
  animFadeIcon: function animFadeIcon(el1, el2) {
    this.config.tl.to(el1, 0.22, { ease: Power3.easeIn, opacity: 0, scale: 0, display: "none" })
                  .to(el2, 0.22, { ease: Power3.easeOut, opacity: 1, scale: 1, display: "block" });
  },
  animOpenMenu: function animOpenMenu() {
    TweenLite.set(this.dom.menu, { display: 'flex', delay: 0.35 });
  },
  animCloseMenu: function animCloseMenu() {
    TweenLite.set(this.dom.menu, { clearProps: "all", delay: 0.35 });
  },
  hasScrolled: function hasScrolled() {
    //fn config
    var wScroll = window.scrollY; 
    var scrollNotEnough = Math.abs(this.config.lastScrollTop - wScroll) <= this.config.delta;
    var height = this.getHeight();
    var scrollUp = wScroll < this.config.lastScrollTop;
    var scrollDown = wScroll > this.config.lastScrollTop; // && wScroll > this.dom.navHeight;  //???!!!
    var directionChanged = this.config.lastScrollUp !== scrollUp || this.config.lastScrollDown !== scrollDown;

    if (scrollNotEnough) {
      return;
    }
    //detecting scroll-down
    if (directionChanged && scrollDown) {
      this.animScrollDown(height);
    }
    //detecting scroll-up
    if (directionChanged && scrollUp) {
      this.animScrollUp();
    }

    this.config.lastScrollTop = wScroll;
    this.config.lastScrollUp = scrollUp;
    this.config.lastScrollDown = scrollDown;
  },
  scrollHandler: function scrollHandler() {
    this.config.didScroll = true;
  },
  openHandler: function openHandler() {
    this.animFadeIcon(this.dom.navOpen, this.dom.navClose);
    this.animOpenMenu();
  },
  closeHandler: function closeHandler() {
    this.animFadeIcon(this.dom.navClose, this.dom.navOpen);
    this.animCloseMenu();
  },
  attachListener: function attachListener(el, handler) {
    var ev = arguments.length <= 2 || arguments[2] === undefined ? 'click' : arguments[2];

    el.addEventListener(ev, handler, false);
  },
  init: function init() {
    if (this.dom.nav === null) {
      return;
    }
    this.attachListener(window, this.scrollHandler.bind(this), 'scroll');
    // this.attachListener(this.dom.nav, ()=>console.log("something happens"));
    this.attachListener(this.dom.navOpen, this.openHandler.bind(this));
    this.attachListener(this.dom.navClose, this.closeHandler.bind(this));
    this.addSetInterval();
    // console.log(this.getHeight());
  }
};

Navigation.init();
