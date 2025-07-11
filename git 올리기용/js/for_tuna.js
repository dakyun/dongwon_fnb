  const part = $('.trigger');

  $(window).on('scroll', function () {
    let scrollTop = $(window).scrollTop();
    let windowHeight = $(window).height();
    const isMobile = $(window).width() <= 768;

    part.each(function () {
      const $el = $(this);
      const offsetTop = $el.offset().top;
      const isInSection1 = $el.closest('#section1').length > 0;
      const id = $el.attr('id');

      if (scrollTop === 0) {
        if (isMobile && isInSection1) return;
        $el.removeClass('active');
        if (id === 'section2') resetSlotAnimation();
        return;
      }

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

  // ✅ 슬롯 초기화 함수
  function resetSlotAnimation() {
    const allSpans = [...document.querySelectorAll("#tunaNum span")];
    allSpans.forEach(span => {
      if (span.dataset.final !== undefined) {
        span.textContent = '0';
      }
      span.style.opacity = 0;
    });
  }

  // ✅ 슬롯 애니메이션 함수
  function runSlotAnimation() {
    const allSpans = [...document.querySelectorAll("#tunaNum span")];
    const digitSpans = allSpans.filter(el => el.dataset.final !== undefined);

    allSpans.forEach(span => {
      if (span.dataset.final !== undefined) {
        span.textContent = '0';
      }
      span.style.opacity = 0;
    });

    [...digitSpans].reverse().forEach((digit, i) => {
      const final = digit.dataset.final;

      setTimeout(() => {
        digit.style.opacity = 1;
      
        const next = digit.nextElementSibling;
        if (next && next.classList.contains('comma')) {
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