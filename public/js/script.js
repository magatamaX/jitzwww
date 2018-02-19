'use strict';

// トップスライダー
(function () {

  if (document.getElementById('top-page')) {
    var slideNext = function slideNext() {
      currentSlideOrder = slides.querySelectorAll('li');
      console.log(currentSlideOrder);
      slides.classList.add('sliding-next');
    };

    var slidePrev = function slidePrev() {
      currentSlideOrder = slides.querySelectorAll('li');
      console.log(currentSlideOrder);
      slides.classList.add('sliding-prev');
    };

    // 自動スライド送り
    var autoPlay = function autoPlay(interval) {
      console.log('autoplayによってslidenextされました。');
      slideNext();
      clearTimeout(timerID);
      timerID = setTimeout(function () {
        autoPlay(interval);
      }, interval);
    };

    var slides = document.getElementById('slides');
    var slidesBtn = document.getElementById('main-slide-btn');
    var clonedList = slides.querySelector('[data-clonedlist]');
    var timerID = void 0;

    // 最後のスライドを一番前に移動する
    slides.insertBefore(clonedList, slides.firstElementChild);

    var currentSlideOrder = void 0;
    var clickableFlag = true;

    slidesBtn.addEventListener('click', function (e) {
      // 前後送りボタンを押したとき
      if (clickableFlag) {

        clearTimeout(timerID);

        if (e.target.className === 'slide-next') {
          console.log('NEXTボタンをクリックしました。');

          slideNext();
        } else if (e.target.className === 'slide-prev') {
          console.log('PREVボタンをクリックしました');

          slidePrev();
        }

        timerID = setTimeout(function () {
          autoPlay(5000);
        }, 8000);
        return false;
      }
    });
    // アニメーションスタート時
    slides.addEventListener('animationstart', function () {
      console.log('アニメーション開始！');
      clickableFlag = false;
    });
    // アニメーション終了時（送り種類で分ける）
    slides.addEventListener('animationend', function (animation) {
      console.log('アニメーション終了！');
      clickableFlag = true;

      if (animation.animationName === 'slidenext') {
        console.log('送りアニメーションです。');

        slides.appendChild(currentSlideOrder[0]);
        slides.classList.remove('sliding-next');
        currentSlideOrder;
      } else if (animation.animationName === 'slideprev') {
        console.log('戻りアニメーションです。');

        slides.insertBefore(currentSlideOrder[currentSlideOrder.length - 1], slides.firstElementChild);
        slides.classList.remove('sliding-prev');
        currentSlideOrder;
      }
    });

    timerID = setTimeout(function () {
      autoPlay(5000);
    }, 5000);
  }
})();
// スティッキーヘッダ
(function () {

  var targetElement = document.querySelector('.header-contents');
  var hHeight = targetElement.clientHeight;
  var raisingHeight = document.getElementById('header').querySelector('.top').clientHeight;
  var toFixedPoint = targetElement.getBoundingClientRect().top + window.pageYOffset;
  var pageNaviInner = document.getElementById('page-navi').querySelectorAll('.page-navi-inner-wrap');
  var staticScrollTop = document.documentElement.scrollTop;
  window.addEventListener('load', function () {

    for (var i = 0; i < pageNaviInner.length; i++) {
      pageNaviInner[i].style.top = hHeight + (raisingHeight - staticScrollTop) + 'px';
    }
  });
  window.addEventListener('scroll', function () {

    var scrollTopPoint = document.scrollingElement.scrollTop;

    if (scrollTopPoint >= toFixedPoint) {
      // ヘッダーコンテンツがFixedになるとき
      targetElement.classList.add('fixed');
      document.getElementById('contents').style.paddingTop = hHeight + 'px';
      for (var i = 0; i < pageNaviInner.length; i++) {
        pageNaviInner[i].style.top = hHeight + 'px';
      }
    } else {
      // ヘッダーコンテンツがStaticなとき
      targetElement.classList.remove('fixed');
      document.getElementById('contents').style.paddingTop = '0px';
      for (var _i = 0; _i < pageNaviInner.length; _i++) {
        pageNaviInner[_i].style.top = hHeight + (raisingHeight - scrollTopPoint) + 'px';
      }
    }
  });
})();
// ヘッダメニューのホバー表示
(function () {

  var targetElement = document.getElementById('page-navi');
  var hoveringTargets = document.querySelectorAll('#page-navi > ul > li');

  // console.log(hoveringTargets);

  var _loop = function _loop(i) {
    hoveringTargets[i].addEventListener('mouseover', function () {
      hoveringTargets[i].classList.add('hover');
    });
    hoveringTargets[i].addEventListener('mouseout', function () {
      hoveringTargets[i].classList.remove('hover');
    });
  };

  for (var i = 0; i < hoveringTargets.length; i++) {
    _loop(i);
  }
})();
// ヘッダメニューボタンで表示切替（SP）
(function () {

  var toggleBtn = document.getElementById('navi-toggle-btn').querySelector('a');
  console.log(toggleBtn);
  var toggleTarget = document.getElementById('page-navi');

  toggleBtn.addEventListener('click', function (e) {

    e.preventDefault();

    if (toggleTarget.classList.contains('active')) {

      toggleTarget.classList.remove('active');

      return false;
    } else {

      toggleTarget.classList.add('active');

      return false;
    }
  });
})();