// ✅ 슬롯 초기화 함수
function resetSlotAnimation() {
  const allSpans = [...document.querySelectorAll("#tunaNum span")];
  allSpans.forEach((span) => {
    if (span.dataset.final !== undefined) {
      span.textContent = "0";
    }
    span.style.opacity = 0;
  });
}

// ✅ 슬롯 애니메이션 함수
function runSlotAnimation() {
  const allSpans = [...document.querySelectorAll("#tunaNum span")];
  const digitSpans = allSpans.filter((el) => el.dataset.final !== undefined);

  allSpans.forEach((span) => {
    if (span.dataset.final !== undefined) {
      span.textContent = "0";
    }
    span.style.opacity = 0;
  });

  [...digitSpans].reverse().forEach((digit, i) => {
    const final = digit.dataset.final;

    setTimeout(() => {
      digit.style.opacity = 1;

      const next = digit.nextElementSibling;
      if (next && next.classList.contains("comma")) {
        next.style.opacity = 1;
      }

      let count = 0;
      const interval = setInterval(() => {
        digit.textContent = Math.floor(Math.random() * 10);
        count++;
        if (count > 10 + i * 2) {
          clearInterval(interval);
          digit.textContent = final;
        }
      }, 40); // ← 더 빠르게
    }, i * 60); // ← 자리 등장 속도도 빠르게
  });
}

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
        const id = $el.attr('id');
  
        if (isMobile && isInSection1) return; // 모바일 + section1이면 패스
  
        $el.removeClass('active');
        if (id === 'section2') resetSlotAnimation();
      });
      return;
    }
  
    // ✅ 일반 스크롤 처리
    part.each(function () {
      const $el = $(this);
      const offsetTop = $el.offset().top;
      const isInSection1 = $el.closest('#section1').length > 0;
      const id = $el.attr('id');
  
      // ✅ 모바일에서 section1 안은 스크롤 이벤트 제외
      if (isMobile && isInSection1) return;
  
      const triggerRatio = isMobile ? 0.8 : 0.7;
      const triggerPoint = scrollTop + windowHeight * triggerRatio;
  
      if (triggerPoint >= offsetTop) {
        if (!$el.hasClass('active')) {
          $el.addClass('active');
  
          if (id === 'section2') {
            setTimeout(() => {
              runSlotAnimation();
            }, 1000); // 1초 딜레이 후 실행
          }
        }
      } else {
        if ($el.hasClass('active')) {
          $el.removeClass('active');
  
          if (id === 'section2') {
            resetSlotAnimation(); // 다시 올라갔을 때 초기화
          }
        }
      }
    });
  });
  
  $(function () {
    const isMobile = $(window).width() <= 768;
  
    if (isMobile) {
      // ✅ 모바일: section1 trigger는 400ms 후 활성화
      setTimeout(function () {
        $('#section1 .trigger').addClass('active');
      }, 400);
  
      // ✅ 모바일: 클릭 시 flip 토글
      $('#section4 .box').on('click', function () {
        $(this).toggleClass('flip');
      });
    } else {
      // ✅ PC: hover 시 flip 토글
      $('#section4 .box').on('mouseenter', function () {
        $(this).addClass('flip');
      }).on('mouseleave', function () {
        $(this).removeClass('flip');
      });
    }
  });
  

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
        }, i * 50); // 살짝 더 빠르게 (원래는 80)
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
  

  // 초기 로딩 시 체크
  $(window).trigger("scroll");

  const marquee = document.querySelector(".marquee");
  const track = marquee.querySelector(".marquee-track");

  // ✅ 원본 + 2배 복제 = 총 3세트
  track.innerHTML += track.innerHTML + track.innerHTML;

  // ✅ 반응형 판단
  const isMobile = window.innerWidth <= 768;
  const duration = isMobile ? 70 : 70;

  // ✅ 총 너비 기준 한 세트 거리만큼만 이동
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

  // ✅ 드래그 (PC+모바일)
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

  const video = document.querySelector('.target_video');
  const btn   = document.querySelector('.btn_audio');

  // 초기 상태: muted
  video.muted = true;
  btn.classList.add('is_muted');

  btn.addEventListener('click', () => {
    video.muted = !video.muted;
    btn.classList.toggle('is_muted', video.muted);

    // 재생 안 되고 멈춰 있으면 재생시켜주기
    if (video.paused) {
      video.play().catch(()=>{});
    }
  });
});
