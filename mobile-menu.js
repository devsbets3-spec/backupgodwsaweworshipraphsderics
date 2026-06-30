const clearHashFromUrl = () => {
    if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    clearHashFromUrl();

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        const targetId = link.getAttribute('href')?.slice(1);
        if (targetId) {
            link.setAttribute('href', 'javascript:void(0)');
            link.setAttribute('data-scroll-target', targetId);
        }
    });

    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('a[data-scroll-target], a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('data-scroll-target') || link.getAttribute('href')?.slice(1);
            const targetSection = targetId ? document.getElementById(targetId) : null;

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            const headerOffset = document.querySelector('.ksf-header')?.offsetHeight || 0;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }

            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('[data-modal], [data-modal-target]').forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            const modalId = trigger.getAttribute('data-modal') || trigger.getAttribute('data-modal-target');
            if (modalId) {
                event.preventDefault();
                openModal(modalId);
            }
        });
    });

    document.querySelectorAll('[data-close-modal]').forEach((closer) => {
        closer.addEventListener('click', () => {
            const modalId = closer.getAttribute('data-close-modal');
            if (modalId) {
                closeModal(modalId);
            }
        });
    });

    document.querySelectorAll('.modal-link-alert').forEach((link) => {
        link.addEventListener('click', (event) => {
            const message = link.getAttribute('data-alert-message');
            if (message) {
                event.preventDefault();
                window.alert(message);
            }
        });
    });

    const contactForm = document.getElementById('institutionalContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const feedback = document.getElementById('submissionStatusFeedback');
            if (feedback) {
                feedback.textContent = 'Thank you. Your message context has been received.';
            }
            contactForm.reset();
        });
    }

    const copyButton = document.querySelector('[data-copy-giving-number]');
    if (copyButton) {
        copyButton.addEventListener('click', copyGivingNumber);
    }
});

function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) {
        return;
    }

    targetModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) {
        return;
    }

    targetModal.classList.remove('active');
    if (!document.querySelector('.ksf-modal-overlay-backdrop.active')) {
        document.body.style.overflow = '';
    }
}

function copyGivingNumber() {
    const number = '3252712983';
    const message = document.getElementById('copyMessage');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(number).catch(() => {});
    }

    if (message) {
        message.textContent = '✓ Giving number copied successfully!';
        window.setTimeout(() => {
            message.textContent = '';
        }, 3000);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('ksf-modal-overlay-backdrop')) {
        closeModal(event.target.id);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.querySelectorAll('.ksf-modal-overlay-backdrop.active').forEach((modal) => {
            closeModal(modal.id);
        });
    }
});
