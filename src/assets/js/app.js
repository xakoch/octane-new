// Ждем загрузку DOM перед инициализацией скриптов
document.addEventListener('DOMContentLoaded', function() {
    initScript();
    requestAnimationFrame(() => {
    });
});

// Инициализация Lenis для плавного скролла
let lenis;

function initLenis() {
    try {
        if (typeof Lenis === 'undefined') {
            return;
        }
        
        // Уничтожаем предыдущий экземпляр Lenis, если он существует
        if (lenis) {
            lenis.destroy();
            lenis = null;
        }
        
        // Создаем новый экземпляр Lenis
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: true,
            touchMultiplier: 2,
            infinite: false,
            wrapper: window,
            content: document.documentElement
        });

        // Экспортируем в глобальную область для доступа из других скриптов
        window.lenis = lenis;

        // Привязываем Lenis к requestAnimationFrame для обновления
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);


    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
        
    }
}

/**
 * Устанавливает CSS-переменную для мобильных устройств
 */
function initWindowInnerheight() {
    try {
        $(document).ready(() => {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
        
    }
}

/**************************************************************
* Swiper Sliders
**************************************************************/
function initSwiperSlider() {
    try {
        if (typeof Swiper === 'undefined') {
            console.warn('Swiper не найден');
            return;
        }

        // Offers Slider
        const offersSlider = document.querySelector('.offers__slider');
        if (offersSlider) {
            const swiper = new Swiper('.offers__slider', {
                slidesPerView: "auto",
                centeredSlides: true,
                spaceBetween: 30,
                // loop: true,
                // autoplay: {
                //     delay: 3000,
                //     disableOnInteraction: false,
                // },
                navigation: {
                    nextEl: '.offers__arrows-right',
                    prevEl: '.offers__arrows-left',
                },
                breakpoints: {
                    // 768: {
                    //     slidesPerView: 2,
                    //     spaceBetween: 20,
                    // },
                    // 1024: {
                    //     slidesPerView: 3,
                    //     spaceBetween: 20,
                    // },
                    1200: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    }
                },
                on: {
                    init: function() {
                        // Добавляем класс при инициализации
                        this.wrapperEl.classList.add('swiper-wrapper-reset');

                        // Автоматически переключаем на следующий слайд и убираем класс
                        setTimeout(() => {
                            this.wrapperEl.classList.remove('swiper-wrapper-reset');
                            this.slideNext(0); // 0 = без анимации
                        }, 100);
                    }
                }
            });
        }

        console.log('Swiper sliders initialized successfully');
    } catch (error) {
        console.error('Error in initSwiperSlider:', error);
    }
}

/**
 * Инициализация FAQ аккордеона
 */
function initFaq() {
    try {
        const faqItems = document.querySelectorAll('.faq__item');

        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const header = item.querySelector('.faq__header');
            const text = item.querySelector('.faq__text');

            if (!header || !text) return;

            // Обработчик клика на header
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Закрываем все остальные элементы (accordion mode)
                // Если хотите чтобы могло быть открыто несколько элементов одновременно - удалите этот блок
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Переключаем состояние текущего элемента
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');

                    // Если используется Lenis, обновляем его после открытия
                    if (window.lenis) {
                        setTimeout(() => {
                            window.lenis.resize();
                        }, 300);
                    }
                }
            });
        });

    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}

/**
 * Инициализация раскрытия Special Offers
 */
function initSpecials() {
    try {
        const specialsItems = document.querySelectorAll('.specials__item');

        if (specialsItems.length === 0) return;

        specialsItems.forEach(item => {
            const link = item.querySelector('.link');

            if (!link) return;

            // Сохраняем оригинальный текст
            const originalText = link.textContent;
            const expandedText = 'hide';

            // Обработчик клика на link
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const isExpanded = item.classList.contains('expanded');

                if (isExpanded) {
                    // Закрываем
                    item.classList.remove('expanded');
                    link.textContent = originalText;
                } else {
                    // Открываем
                    item.classList.add('expanded');
                    link.textContent = expandedText;
                }

                // Если используется Lenis, обновляем его после анимации
                if (window.lenis) {
                    setTimeout(() => {
                        window.lenis.resize();
                    }, 400);
                }
            });
        });

    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}

/**
 * Запускает все скрипты на новой странице
 */
function initScript() {
    try {
        initLenis();
        initWindowInnerheight();
        initSwiperSlider();
        initFaq();
        initSpecials();
    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}