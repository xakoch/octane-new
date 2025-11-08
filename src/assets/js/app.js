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
                slidesPerView: 1.2,
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
 * Инициализация анимации счётчика для фактов
 */
function initFactsCounter() {
    try {
        const counters = document.querySelectorAll('.counter');

        if (counters.length === 0) return;

        // Функция для форматирования чисел с запятыми
        function formatNumber(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        // Функция анимации счётчика
        function animateCounter(counter, delay) {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 секунды для более плавной анимации
            const startTime = performance.now() + (delay * 1000);
            let previousValue = 0;

            function update(currentTime) {
                if (currentTime < startTime) {
                    requestAnimationFrame(update);
                    return;
                }

                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Более плавная easing функция (easeOutQuart)
                const easeProgress = 1 - Math.pow(1 - progress, 4);

                const current = easeProgress * target;
                const rounded = Math.round(current);

                // Обновляем только если значение изменилось
                if (rounded !== previousValue) {
                    counter.textContent = formatNumber(rounded);
                    previousValue = rounded;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = formatNumber(target);
                }
            }

            requestAnimationFrame(update);
        }

        // Проверяем наличие GSAP
        if (typeof gsap === 'undefined') {
            console.warn('GSAP не найден, анимация счётчика не будет работать');
            return;
        }

        // Создаем Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const factsBottom = entry.target;
                    const items = factsBottom.querySelectorAll('.facts__item');

                    // GSAP анимация появления карточек снизу вверх
                    gsap.fromTo(items,
                        {
                            opacity: 0,
                            y: 30
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.15,
                            ease: 'power3.out',
                            onStart: function() {
                                // Запускаем счётчики с задержкой
                                items.forEach((item, index) => {
                                    const counter = item.querySelector('.counter');
                                    if (counter && !counter.classList.contains('animated')) {
                                        counter.classList.add('animated');
                                        animateCounter(counter, index * 0.15);
                                    }
                                });
                            }
                        }
                    );

                    // Прекращаем наблюдение после запуска
                    observer.unobserve(factsBottom);
                }
            });
        }, {
            threshold: 0.3 // Запускаем когда 30% блока видно
        });

        // Наблюдаем за контейнером
        const factsBottom = document.querySelector('.facts__bottom');
        if (factsBottom) {
            observer.observe(factsBottom);
        }

    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}

/**
 * Инициализация анимации для секции How it Works
 */
function initHowAnimation() {
    try {
        // Проверяем наличие GSAP
        if (typeof gsap === 'undefined') {
            console.warn('GSAP не найден, анимация How it Works не будет работать');
            return;
        }

        const howSection = document.querySelector('.how');
        if (!howSection) return;

        const howItems = howSection.querySelectorAll('.how__item');
        const howActions = howSection.querySelector('.how__actions');

        if (howItems.length === 0 || !howActions) return;

        // Создаем Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Timeline для последовательной анимации
                    const timeline = gsap.timeline();

                    // Анимация шагов по очереди (снизу вверх)
                    howItems.forEach((item, index) => {
                        timeline.fromTo(item,
                            {
                                opacity: 0,
                                y: 30
                            },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.6,
                                ease: 'power3.out'
                            },
                            index * 0.2 // Задержка между шагами
                        );
                    });

                    // После всех шагов - кнопки с эффектом bounce
                    timeline.fromTo(howActions,
                        {
                            opacity: 0,
                            y: 30
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'back.out(1.7)' // Эффект отскока
                        },
                        '+=0.1' // Небольшая пауза после последнего шага
                    );

                    // Прекращаем наблюдение после запуска
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5 // Запускаем когда 50% блока видно
        });

        observer.observe(howSection);

    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}

/**
 * Инициализация анимации для секции Table (сравнение)
 */
function initTableAnimation() {
    try {
        // Проверяем наличие GSAP
        if (typeof gsap === 'undefined') {
            console.warn('GSAP не найден, анимация Table не будет работать');
            return;
        }

        const tableSection = document.querySelector('.table');
        if (!tableSection) return;

        const sectionTitle = tableSection.querySelector('.section__title');
        const headerItems = tableSection.querySelectorAll('.header-item');
        const compTable = tableSection.querySelector('.comp-table');

        if (!sectionTitle || !compTable) return;

        // Получаем все строки из всех колонок
        const allRows = [];
        const compBodies = compTable.querySelectorAll('.comp-body');

        // Определяем количество строк
        const rowCount = compBodies[0]?.querySelectorAll('.comp-row').length || 0;

        // Группируем строки по индексу (одна строка = 3 элемента из разных колонок)
        for (let i = 0; i < rowCount; i++) {
            const rowGroup = [];
            compBodies.forEach(body => {
                const row = body.querySelectorAll('.comp-row')[i];
                if (row) rowGroup.push(row);
            });
            if (rowGroup.length > 0) {
                allRows.push(rowGroup);
            }
        }

        // Создаем Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Timeline для последовательной анимации
                    const timeline = gsap.timeline();

                    // 1. Появление заголовка
                    timeline.fromTo(sectionTitle,
                        {
                            opacity: 0,
                            y: 30
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'power3.out'
                        }
                    );

                    // 2. Одновременное появление заголовков колонок
                    timeline.fromTo(headerItems,
                        {
                            opacity: 0,
                            y: 20
                        },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.5,
                            ease: 'power3.out',
                            stagger: 0
                        },
                        '+=0.2' // Небольшая пауза после заголовка
                    );

                    // 3. Последовательное появление строк
                    allRows.forEach((rowGroup, index) => {
                        timeline.fromTo(rowGroup,
                            {
                                opacity: 0,
                                x: -20
                            },
                            {
                                opacity: 1,
                                x: 0,
                                duration: 0.4,
                                ease: 'power2.out',
                                stagger: 0
                            },
                            `-=${index === 0 ? 0.2 : 0.25}` // Первая строка с меньшей задержкой
                        );
                    });

                    // Прекращаем наблюдение после запуска
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2 // Запускаем когда 20% блока видно
        });

        observer.observe(tableSection);

    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}

/**
 * Инициализация lazy load для изображений
 */
function initLazyLoad() {
    try {
        const lazyImages = document.querySelectorAll('img.lazy-load');

        if (lazyImages.length === 0) return;

        // Функция для определения мобильного устройства
        const isMobile = () => window.innerWidth <= 768;

        // Создаем Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const desktopSrc = img.getAttribute('data-src');
                    const mobileSrc = img.getAttribute('data-mobile');

                    // Выбираем источник в зависимости от размера экрана
                    const highResSrc = (isMobile() && mobileSrc) ? mobileSrc : desktopSrc;

                    if (highResSrc) {
                        // Создаем новое изображение для предзагрузки
                        const highResImage = new Image();

                        highResImage.onload = () => {
                            // Когда изображение загружено, плавно заменяем
                            img.style.opacity = '0';

                            setTimeout(() => {
                                img.src = highResSrc;
                                img.removeAttribute('data-src');
                                img.removeAttribute('data-mobile');
                                img.classList.add('loaded');

                                setTimeout(() => {
                                    img.style.opacity = '1';
                                }, 50);
                            }, 300);
                        };

                        highResImage.src = highResSrc;

                        // Прекращаем наблюдение за этим изображением
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px' // Начинаем загрузку за 50px до появления в viewport
        });

        // Наблюдаем за всеми ленивыми изображениями
        lazyImages.forEach(img => {
            imageObserver.observe(img);
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
 * Универсальная инициализация всех попапов через data-атрибуты
 */
function initPopups() {
    try {
        // Получаем все попапы
        const popups = {
            'app': document.getElementById('appPopup'),
            'form': document.getElementById('formPopup'),
            'card': document.getElementById('cardPopup')
        };

        // Функция открытия попапа
        function openPopup(popupElement) {
            requestAnimationFrame(() => {
                popupElement.classList.add('active');
                document.body.style.overflow = 'hidden';

                if (window.lenis) {
                    window.lenis.stop();
                }
            });
        }

        // Функция закрытия попапа
        function closePopup(popupElement) {
            popupElement.classList.remove('active');

            setTimeout(() => {
                document.body.style.overflow = '';

                if (window.lenis) {
                    window.lenis.start();
                }
            }, 300);
        }

        // Обработчик кликов на кнопки с data-popup атрибутом
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-popup]');

            if (target) {
                e.preventDefault();
                const popupType = target.getAttribute('data-popup');
                const popup = popups[popupType];

                if (popup) {
                    openPopup(popup);
                }
            }
        });

        // Инициализация закрытия для каждого попапа
        Object.values(popups).forEach(popup => {
            if (!popup) return;

            const overlay = popup.querySelector('.app-popup__overlay, .form-popup__overlay');
            const closeBtn = popup.querySelector('.app-popup__close, .form-popup__close');

            // Закрытие по клику на overlay
            if (overlay) {
                overlay.addEventListener('click', () => closePopup(popup));
            }

            // Закрытие по клику на кнопку close
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closePopup(popup));
            }
        });

        // Закрытие по клавише ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Object.values(popups).forEach(popup => {
                    if (popup && popup.classList.contains('active')) {
                        closePopup(popup);
                    }
                });
            }
        });

        // Обработка форм
        const forms = [
            { id: 'savingForm', message: 'Thank you! We will contact you shortly.' },
            { id: 'cardForm', message: 'Thank you! Your card application has been submitted. We will contact you shortly.' }
        ];

        forms.forEach(({ id, message }) => {
            const form = document.getElementById(id);
            if (!form) return;

            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const submitBtn = form.querySelector('.form-popup__submit');
                const originalText = submitBtn.textContent;

                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                try {
                    // Имитация отправки на сервер
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    console.log(`Form ${id} submitted:`, data);

                    alert(message);

                    form.reset();
                    const popup = form.closest('.form-popup');
                    if (popup) closePopup(popup);

                } catch (error) {
                    console.error('Form submission error:', error);
                    alert('Something went wrong. Please try again.');
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        });

    } catch (error) {
        console.error("Error in initPopups:", error);
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
        initLazyLoad();
        initFactsCounter();
        initHowAnimation();
        initTableAnimation();
        initPopups();
    } catch (error) {
        console.error("Error in " + arguments.callee.name + ":", error);
    }
}