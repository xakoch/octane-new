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
 * Запускает все скрипты на новой странице
 */
function initScript() {
    try {
        initLenis();
        initWindowInnerheight();
        initFaq();
    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}