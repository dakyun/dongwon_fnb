$(function () {
  const part = $('.trigger');

  $(window).on('scroll', function () {
    let scrollTop = $(window).scrollTop();
    let windowHeight = $(window).height();
    const isMobile = $(window).width() <= 768;

    // ✅ 스크롤 최상단일 때 모든 active 제거 (단, 모바일에서는 section1 제외)
    if (scrollTop === 0) {
      part.each(function () {
        const $el = $(this);
        const isInSection1 = $el.closest('#section1').length > 0;

        if (isMobile && isInSection1) return;

        $el.removeClass('active');
      });
      return;
    }

    // ✅ 일반 스크롤 처리
    part.each(function () {
      const $el = $(this);
      const offsetTop = $el.offset().top;
      const isInSection1 = $el.closest('#section1').length > 0;

      if (isMobile && isInSection1) return;

      const triggerRatio = isMobile ? 0.8 : 0.7;
      const triggerPoint = scrollTop + windowHeight * triggerRatio;

      if (triggerPoint >= offsetTop) {
        if (!$el.hasClass('active')) {
          $el.addClass('active');
        }
      } else {
        if ($el.hasClass('active')) {
          $el.removeClass('active');
        }
      }
    });
  });

  // ✅ 최초 로딩 시 한 번 실행
  $(window).trigger('scroll');

  // ✅ 모바일/PC 인터랙션 분기
  const isMobile = $(window).width() <= 768;

  if (isMobile) {
    setTimeout(function () {
      $('#section1 .trigger').addClass('active');
    }, 400);

    $('#section4 .box').on('click', function () {
      $(this).toggleClass('flip');
    });
  } else {
    $('#section4 .box').on('mouseenter', function () {
      $(this).addClass('flip');
    }).on('mouseleave', function () {
      $(this).removeClass('flip');
    });
  }

  // ✅ 히스토리 박스 등장 애니메이션
  const $boxes = $(".history_flow .box");
  let ticking = false;

  function handleScroll() {
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    $boxes.each(function (i) {
      const $el = $(this);
      const elTop = $el.offset().top;

      const isVisible = scrollTop + windowHeight * 0.8 >= elTop;
      const isBelow = scrollTop + windowHeight < elTop;

      if (isVisible && !$el.hasClass("on")) {
        setTimeout(() => {
          $el.addClass("on");
        }, i * 50);
      } else if (isBelow && $el.hasClass("on")) {
        $el.removeClass("on");
      }
    });

    ticking = false;
  }

  $(window).on("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  });

  // ✅ section3 롤링 애니메이션 (bigSwiper 없을 때만 실행)
  const section3 = document.querySelector("#section3");

  if (section3 && !section3.querySelector(".swiper_type")) {
    const marquee = section3.querySelector(".marquee");
    const track = marquee?.querySelector(".marquee-track");

    if (marquee && track) {
      track.innerHTML += track.innerHTML + track.innerHTML;

      const isMobile = window.innerWidth <= 768;
      const duration = isMobile ? 50 : 50;
      const distance = track.offsetWidth / 3;

      let anim = gsap.to(track, {
        x: `-=${distance}`,
        duration: duration,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % distance)
        }
      });

      Draggable.create(track, {
        type: "x",
        inertia: true,
        onPress() {
          anim.pause();
        },
        onDrag() {
          gsap.set(track, { x: this.x });
        },
        onRelease() {
          const currentX = gsap.getProperty(track, "x");
          anim.invalidate().restart().progress(0);
          gsap.set(track, { x: currentX });
        }
      });
    }
  }

  // ✅ bigSwiper가 존재할 때만 실행 (null 체크 추가)
  const swiperContainer = document.querySelector('.bigSwiper .swiper-wrapper');

  if (swiperContainer) {
    const originalSlides = swiperContainer.querySelectorAll('.swiper-slide');
    const totalOriginal = document.querySelectorAll('.txt_box').length;

    for (let i = 0; i < totalOriginal; i++) {
      const clone = originalSlides[i].cloneNode(true);
      swiperContainer.appendChild(clone);
    }

    const paginationEl = document.querySelector('.custom_pagination');
    for (let i = 0; i < totalOriginal; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      if (i === 0) dot.classList.add('active');
      dot.dataset.index = i;
      paginationEl.appendChild(dot);
    }

    const cuisineSwiper = new Swiper(".bigSwiper", {
      loop: true,
      speed: 700,
      slidesPerView: 'auto',
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      on: {
        slideChange: function () {
          const realIndex = this.realIndex % totalOriginal;

          document.querySelectorAll('.txt_box').forEach(el => el.classList.remove('active'));
          const activeTxt = document.querySelector(`.txt_box.n${realIndex + 1}`);
          if (activeTxt) activeTxt.classList.add('active');

          document.querySelectorAll('.custom_pagination .dot').forEach(dot => dot.classList.remove('active'));
          const currentDot = document.querySelector(`.custom_pagination .dot[data-index="${realIndex}"]`);
          if (currentDot) currentDot.classList.add('active');
        }
      }
    });

    document.querySelectorAll('.custom_pagination .dot').forEach(dot => {
      dot.addEventListener('click', function () {
        const index = parseInt(this.dataset.index, 10);
        cuisineSwiper.slideToLoop(index);
      });
    });
  }
});
