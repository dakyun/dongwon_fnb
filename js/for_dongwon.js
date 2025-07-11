$(function () {
  // const part = $('.trigger');
  
  // $(window).on('scroll', function () {
  //   let scrollTop = $(window).scrollTop();
  //   let windowHeight = $(window).height();
  
  //   if (scrollTop === 0) {
  //     part.removeClass('active');
  //     return; // 아래 검사 안 하고 종료
  //   }
    
  //   part.each(function () {
  //     const $el = $(this);
  //     const offsetTop = $el.offset().top;
  
  //     const triggerPoint = scrollTop + windowHeight * 0.7;
  
  //     if (triggerPoint >= offsetTop) {
  //       $el.addClass('active');
  //     } else {
  //       $el.removeClass('active');
  //     }
  //   });
  // });
  

  const boxLines = $('.product_boxs .box.line');

  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();

    boxLines.each(function () {
      const $line = $(this);
      const offsetTop = $line.offset().top;

      const $group = $line.nextUntil('.box.line').addBack().slice(0, 3);

      // ✅ 뷰포트 하단이 요소 상단에 도달하면 active 추가
      if (scrollTop + windowHeight * 0.7 > offsetTop) {
        $group.addClass('active');
      }
      // ✅ 뷰포트 상단이 요소 하단보다 위에 있으면 active 제거
      else if (scrollTop + windowHeight < offsetTop + 50) {
        $group.removeClass('active');
      }
    });
  });
  
});
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

      // 모바일일 경우 section1 안의 요소는 유지
      if (isMobile && isInSection1) return;

      $el.removeClass('active');
    });
    return;
  }

  part.each(function () {
    const $el = $(this);
    const offsetTop = $el.offset().top;

    // ✅ 모바일에서 section1 안은 스크롤 이벤트 제외 (초기화 제외됨)
    if (isMobile && $el.closest('#section1').length) return;

    // ✅ 모바일: 80%, PC: 70%
    const triggerRatio = isMobile ? 0.8 : 0.7;
    const triggerPoint = scrollTop + windowHeight * triggerRatio;

    if (triggerPoint >= offsetTop) {
      $el.addClass('active');
    } else {
      $el.removeClass('active');
    }
  });
});

// ✅ 모바일에서 section1 trigger는 400ms 후 활성화
$(function () {
  const isMobile = $(window).width() <= 769;

  if (isMobile) {
    setTimeout(function () {
      $('#section1 .trigger').addClass('active');
    }, 400);
  }
});

const marquee = document.querySelector(".brandSwiper");
  const track = marquee.querySelector(".marquee-track");

  // ✅ 3배 복제
  track.innerHTML += track.innerHTML + track.innerHTML;

  // ✅ 반응형 속도
  const isMobile = window.innerWidth <= 768;
  const duration = isMobile ? 45 : 50;

  // ✅ 1세트 거리 계산
  const distance = track.offsetWidth / 3;

  // ✅ 무한 롤링 애니메이션
  let anim = gsap.to(track, {
    x: `-=${distance}`,
    duration: duration,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % distance)
    }
  });

  // ✅ 드래그 지원
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