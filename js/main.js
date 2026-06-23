/**
 * main.js — Delta Schools Portal
 * Page interactions: hamburger menu, scroll-reveal, language toggle.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Hamburger ─────────────────────────────────────────────────────────────
    const ham  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (ham && mobileMenu) {
        ham.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('a').forEach(a =>
            a.addEventListener('click', () => mobileMenu.classList.remove('open'))
        );
    }

    // ── Scroll-reveal ─────────────────────────────────────────────────────────
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // ── Language toggle ───────────────────────────────────────────────────────
    document.querySelectorAll('[data-lang-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = I18N.currentLang() === 'en' ? 'ar' : 'en';
            I18N.setLang(next);
        });
    });

});

//! Back-End Don't Touch
emailjs.init({
    publicKey: "O73WVa3w8Y19tLK0Q"
});

const form = document.getElementById("registerForm");

form.addEventListener("submit", function (e) {


    e.preventDefault();

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerText = "جاري الإرسال...";

    const templateParams = {

        full_name: document.getElementById("fullName").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value
    };

    emailjs.send(
        "service_6t1vnw7",
        "template_s8gmg2h",
        templateParams
    )

        .then(() => {

            alert("تم التسجيل بنجاح ✅");

            form.reset();

        })

        .catch((error) => {

            console.error("EmailJS Error:", error);

            alert("حدث خطأ أثناء الإرسال ❌");

        })

        .finally(() => {

            submitBtn.disabled = false;
            submitBtn.innerText = "تسجيل";

        });


});


