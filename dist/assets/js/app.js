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
 * Запускает все скрипты на новой странице
 */
function initScript() {
    try {
        initLenis();
        initWindowInnerheight();
    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}