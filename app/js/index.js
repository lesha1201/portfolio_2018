window.onload = function() {
  var works = document.querySelectorAll('.work:not(.work--reverse):not(.hide)');
  var worksReverse = document.querySelectorAll('.work--reverse:not(.hide)');
  var worksAnimated = 0;
  var worksReverseAnimated = 0;

  function animate() {
    for (var i = 0; i < works.length; i++) {
      if (
        window.pageYOffset + document.body.offsetHeight >
        works[i].offsetTop
      ) {
        works[i].classList.add('animated', 'fadeInRight');
        worksAnimated += 1;
      }
    }

    for (var i = 0; i < worksReverse.length; i++) {
      if (
        window.pageYOffset + document.body.offsetHeight >
        worksReverse[i].offsetTop
      ) {
        worksReverse[i].classList.add('animated', 'fadeInLeft');
        worksReverseAnimated += 1;
      }
    }

    if (
      worksAnimated !== works.length ||
      worksReverseAnimated !== worksReverse.length
    ) {
      requestAnimationFrame(animate);
    }
  }

  animate();

  var moreWorksBtn = document.querySelector('#js--moreWorksBtn');
  var navIcons = document.querySelectorAll('.js--nav-icon');
  var mobNav = document.querySelector('#js--mob-nav');
  var hideWorks, hideWorksRev;

  var onClickMore = function() {
    hideWorks = document.querySelectorAll('.work:not(.work--reverse).hide');
    hideWorksRev = document.querySelectorAll('.work--reverse.hide');

    if (hideWorks[0] || hideWorksRev[0]) {
      if (hideWorks[0]) {
        hideWorks[0].classList.remove('hide');
        hideWorks[0].classList.add('animated', 'fadeInRight');
      }
      if (hideWorksRev[0]) {
        hideWorksRev[0].classList.remove('hide');
        hideWorksRev[0].classList.add('animated', 'fadeInLeft');
      }
    } else {
      moreWorksBtn.removeEventListener('click', onClickMore);
    }

    if (hideWorks.length + hideWorksRev.length < 3) {
      moreWorksBtn.classList.add('hide');
    }
  };

  moreWorksBtn.addEventListener('click', onClickMore);

  var scrollControl = (function() {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };
    var isScrollDisable = false;

    function preventDefault(e) {
      e = e || window.event;
      if (e.preventDefault) e.preventDefault();
      e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
      if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }

    function disableScroll() {
      isScrollDisable = true;
      if (window.addEventListener)
        // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
      window.onwheel = preventDefault; // modern standard
      window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
      window.ontouchmove = preventDefault; // mobile
      document.onkeydown = preventDefaultForScrollKeys;
    }

    function enableScroll() {
      isScrollDisable = false;
      if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
      window.onmousewheel = document.onmousewheel = null;
      window.onwheel = null;
      window.ontouchmove = null;
      document.onkeydown = null;
    }

    function getIsScrollDisable() {
      return isScrollDisable;
    }

    return {
      disableScroll: disableScroll,
      enableScroll: enableScroll,
      isScrollDisable: getIsScrollDisable
    };
  })();

  function toggleMobNav() {
    mobNav.classList.toggle('hide');
    if (scrollControl.isScrollDisable()) {
      scrollControl.enableScroll();
      document.body.style.overflow = 'auto';
    } else {
      scrollControl.disableScroll();
      document.body.style.overflow = 'hidden';
    }
  }

  navIcons.forEach(function(icon) {
    icon.addEventListener('click', toggleMobNav);
  });

  var scrollToHome = document.querySelectorAll('.js--scroll-to-home');
  var scrollToAbout = document.querySelectorAll('.js--scroll-to-about');
  var scrollToWorks = document.querySelectorAll('.js--scroll-to-works');
  var scrollToContact = document.querySelectorAll('.js--scroll-to-contact');
  var sectionHome = document.querySelector('.section--home');
  var sectionAbout = document.querySelector('.section--about');
  var sectionWorks = document.querySelector('.section--works');
  var sectionContact = document.querySelector('.section--contact');

  function scrollToOnClick(bindTo, scrollTo) {
    bindTo.forEach(function(el) {
      el.addEventListener('click', function() {
        if (!mobNav.classList.contains('hide')) {
          toggleMobNav();
        }
        window.scrollTo({
          top: scrollTo.offsetTop,
          behavior: 'smooth'
        });
      });
    });
  }

  scrollToOnClick(scrollToHome, sectionHome);
  scrollToOnClick(scrollToAbout, sectionAbout);
  scrollToOnClick(scrollToWorks, sectionWorks);
  scrollToOnClick(scrollToContact, sectionContact);
};
