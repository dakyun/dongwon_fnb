$(document).ready(function(){
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

    // 스크롤 이벤트
    const part = $('.section');

    $(window).on('scroll', function () {
        let scrollTop = $(window).scrollTop();

        // ✅ 스크롤 최상단이면 fixed 해제 + active 제거
        if (scrollTop <= 10) {
            $(".nav").removeClass("fixed");
            $(".nav a").removeClass("active");
            return;
        }

        // ✅ 그 외엔 무조건 fixed 유지
        $(".nav").addClass("fixed");

        // 섹션 별 active 처리
        part.each(function (i) {
            if (scrollTop >= part.eq(i).offset().top - 200) {
                const $currentNav = $(".nav a").eq(i);

                if (!$currentNav.hasClass("active")) {
                    $(".nav a").removeClass("active");
                    $currentNav.addClass("active");

                    if (window.innerWidth <= 768) {
                        const container = document.querySelector(".nav .inner");
                        const link = $currentNav.get(0);

                        container.scrollTo({
                            left: link.offsetLeft - 16,
                            behavior: "smooth"
                        });
                    }
                }
            }
        });
    });


    $(".nav a").on("click", function (e) {
        e.preventDefault();
    
        const $this = $(this);
        const target = $($this.attr("href"));
    
        // active 처리
        $(".nav a").removeClass("active");
        $this.addClass("active");
    
        // 모바일 포커싱 처리
        if (window.innerWidth <= 768) {
            const container = document.querySelector(".nav .inner");
            const link = this;
    
            container.scrollTo({
                left: link.offsetLeft - 16,
                behavior: "smooth"
            });
        }
    
        // ✅ 먼저 강제로 fixed 붙여놓기
        $(".nav").addClass("fixed");
    
        // 보정 위치 계산
        let offsetTop = target.offset().top;
    
        if (window.innerWidth <= 768) {
            const navHeight = $(".nav").outerHeight() || 0;
            const headerHeight = $("#Header").outerHeight() || 0;
            offsetTop -= (navHeight + headerHeight - 20);
        } else {
            const navHeight = $(".nav").outerHeight() || 0;
            offsetTop -= (navHeight);
        }
    
        // 스크롤 이동
        setTimeout(() => {
            $("html, body").animate(
                {
                    scrollTop: offsetTop
                },
                300
            );
        }, 100);
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