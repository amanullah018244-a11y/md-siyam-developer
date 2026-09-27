// ১. কাস্টম কার্সার
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.innerWidth > 767) {
    window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorOutline.style.left = `${e.clientX}px`;
        cursorOutline.style.top = `${e.clientY}px`;
    });
}

// ২. আল্ট্রা-লাইট পার্টিকেল (ল্যাগ দূর করার জন্য O(N) কমপ্লেক্সিটি ও হালকা রেন্ডারিং)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const isMobile = window.innerWidth < 768;
const numberOfParticles = isMobile ? 12 : 22;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        for (let j = i + 1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = dx * dx + dy * dy; // Math.sqrt সরিয়ে দেওয়া হয়েছে পারফর্মেন্সের জন্য

            if (distance < 9000) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 242, 254, ${0.3 - distance / 30000})`;
                ctx.lineWidth = 0.4;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
        init();
    }, 200);
});

init();
animate();

// ৩. অটো টাইপিং এফেক্ট
const words = ["ইলেকট্রিক সাইন্স প্রজেক্ট মেকার।", "ইউটিউব ও ফেসবুক থাম্বনেল ডিজাইনার।", "ওয়েব ডেভেলপার।", "ভিডিও এডিটর।"];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

(function type() {
    if (count === words.length) count = 0;
    currentText = words[count];
    letter = currentText.slice(0, ++index);

    document.querySelector(".typing-text").textContent = letter;

    if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000);
    } else {
        setTimeout(type, 90);
    }
})();

// ৪. পেজ রিফ্রেশ ছাড়া ইমেইল সার্ভিস (AJAX)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'পাঠানো হচ্ছে...';

        const formData = new FormData(contactForm);

        fetch("https://formspree.io/f/myeggwyw", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#00f2fe';
                formStatus.textContent = '✅ আপনার তথ্য ও মোবাইল নম্বর সফলভাবে পাঠানো হয়েছে, আপনার সাথে খুব দ্রুত যোগাযোগ করা হবে!';
                contactForm.reset();
            } else {
                formStatus.style.display = 'block';
                formStatus.style.color = '#ff4d4d';
                formStatus.textContent = '❌ কোনো সমস্যা হয়েছে! আবার চেষ্টা করুন।';
            }
        }).catch(error => {
            formStatus.style.display = 'block';
            formStatus.style.color = '#ff4d4d';
            formStatus.textContent = '❌ নেটওয়ার্ক ত্রুটি! আবার চেষ্টা করুন।';
        }).finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'মেসেজ পাঠান';
        });
    });
}