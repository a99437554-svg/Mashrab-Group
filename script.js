
document.addEventListener("DOMContentLoaded", () => {
    // 1. Индикатор прокрутки
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

    // 2. Кнопка возврата наверх
    const topButton = document.createElement("button");
    topButton.className = "back-to-top";
    topButton.textContent = "↑";
    topButton.setAttribute("aria-label", "Вернуться наверх");
    document.body.appendChild(topButton);

    // 3. Обновление при прокрутке
    function updateScroll() {
        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;

        const percent = scrollable > 0
            ? (window.scrollY / scrollable) * 100
            : 0;

        progress.style.width = percent + "%";
        topButton.classList.toggle("show", window.scrollY > 400);
    }

    window.addEventListener("scroll", updateScroll, {
        passive: true
    });

    updateScroll();

    topButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 4. Появление блоков при прокрутке
    const revealElements = document.querySelectorAll(
        ".section-label, .about-content, .stats, " +
        ".section-heading, .project-card, " +
        ".advantages h2, .advantage, .contact-content"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    // 5. Анимированные счётчики
    const stats = document.querySelectorAll(".stat h3");

    function animateCounter(element) {
        if (element.dataset.animated) return;
        element.dataset.animated = "true";

        const original = element.textContent.trim();
        const match = original.match(/^([\d,]+)(.*)$/);

        // Не изменяем годы и символ бесконечности
        if (!match || original === "2020") return;

        const target = Number(match[1].replace(/,/g, ""));
        const suffix = match[2];
        const duration = 1600;
        const start = performance.now();

        function updateCounter(now) {
            const elapsed = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - elapsed, 4);
            const current = Math.floor(target * eased);

            element.textContent = current.toLocaleString("en-US") + suffix;

            if (elapsed < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = original;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        stats.forEach((stat) => counterObserver.observe(stat));
    }

    // 6. Плавная прокрутка по внутренним ссылкам
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const id = link.getAttribute("href");

            if (!id || id === "#") {
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
                return;
            }

            const target = document.querySelector(id);

            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // 7. Интерактивное меню на телефоне
    const header = document.querySelector(".header");
    const nav = document.querySelector(".header nav");

    if (header && nav) {
        const menuButton = document.createElement("button");
        menuButton.className = "menu-toggle";
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-label", "Открыть меню");
        menuButton.setAttribute("aria-expanded", "false");

        header.insertBefore(menuButton, nav);

        menuButton.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("menu-open");

            menuButton.textContent = isOpen ? "✕" : "☰";
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Закрыть меню" : "Открыть меню"
            );
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("menu-open");
                menuButton.textContent = "☰";
                menuButton.setAttribute("aria-expanded", "false");
            });
        });
    }

    // 8. Год внизу сайта
    const footerText = document.querySelector(".footer p");

    if (footerText) {
        footerText.textContent =
            "© " + new Date().getFullYear() + " MASHRAB GROUP";
    }
});
