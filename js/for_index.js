$(function () {
    $('.node1.active').removeClass('active');
    // submenu_wrap.sub01이 표시되면 첫 번째 .depth2에 .on 추가
    const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (
        mutation.target.matches('.submenu_wrap.sub01') &&
        $(mutation.target).is(':visible')
        ) {
        $(mutation.target).find('.depth2').removeClass('on'); // 기존 on 제거
        $(mutation.target).find('.depth2').first().addClass('on');
        }
    });
    });

    // 해당 요소 감시 시작
    const target = document.querySelector('.submenu_wrap.sub01');
    if (target) {
    observer.observe(target, {
        attributes: true,
        attributeFilter: ['style'], // style 속성만 감시
    });
    }

    $('.submenu .depth2').on('mouseenter', function () {
        $(this).addClass('on');
    });

    $('.submenu .depth2').on('mouseleave', function () {
        $(this).removeClass('on');
    });

  // 탭 전환 기능
    $('.brand_tabs .tab').on('click', function () {
    const target = $(this).data('target');

    $('.brand_tabs .tab').removeClass('active');
    $(this).addClass('active');

    $('.tab_content').removeClass('active');
    $('#' + target).addClass('active');

    // ✅ 모바일에서 클릭 시 좌측으로 포커싱
    if (window.innerWidth <= 768) {
        const container = document.querySelector('.brand_tabs');
        const tab = this;

        container.scrollTo({
        left: tab.offsetLeft - 16, // padding 고려
        behavior: 'smooth'
        });
    }
    });


  // Swiper 인스턴스 저장용 객체
    const swiperInstances = {};

    function initSwiper(selector, onlyMobile = false) {
    const $el = $(selector);
    const count = $el.find('.swiper-slide').length;

    if (onlyMobile && window.innerWidth >= 769) {
        // PC 환경에서는 destroy
        if (swiperInstances[selector]) {
        swiperInstances[selector].destroy(true, true);
        swiperInstances[selector] = null;
        }
        return;
    }

    if (swiperInstances[selector]) return; // 이미 초기화돼 있으면 패스

    const pagination = count > 4 ? {
        el: selector + ' .swiper-pagination',
        clickable: true
    } : false;

    swiperInstances[selector] = new Swiper(selector, {
        slidesPerView: onlyMobile ? 'auto' : 4,
        loop: false,
        spaceBetween: onlyMobile ? 12 : 12,
        pagination: pagination,
        breakpoints: !onlyMobile ? {
        0: {
            slidesPerView: 'auto',
            centeredSlides: false,
            pagination: false,
        },
        769: {
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 12,
            pagination: pagination,
        }
        } : undefined
    });
    }

    // 초기화 함수
    function setupSwipers() {
    initSwiper('.ocean-swiper', true);    // 모바일 전용
    initSwiper('.healthy-swiper', true);  // 모바일 전용
    initSwiper('.land-swiper');           // 반응형 그대로
    initSwiper('.beverage-swiper');       // 반응형 그대로
    }

    // 초기 실행 + 리사이즈 대응
    $(function () {
    setupSwipers();
    $(window).on('resize', function () {
        setupSwipers();
    });
    });

});

$(function () {
    const textPairs = [
    ['매일 맛있는 경험', 'Everyday Good Food'],
    ['고객 건강을 위한 식문화', 'First & Best, 동원F&B'],
    ['건강에 대한 새로운 생각', '동원F&B'],
    ['좋은 음식, 좋은 약의 근원', '‘의식동원’(醫食同源)'],
    ['정직한 재료, 건강한 제품', '건강한 식생활의 시작, 동원F&B']
    ];

    const randomIndex = Math.floor(Math.random() * textPairs.length);
    const [left, right] = textPairs[randomIndex];

    $('#leftText').text(left);
    $('#rightText').text(right);
});