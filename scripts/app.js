const hamburgerBtn = document.getElementById('menu-btn');
const navbar = document.getElementById('navbar');
const nav = document.querySelector('.globalnav');
const navList = document.querySelector('.globalnav__list');
const navItems = [...document.querySelectorAll('.globalnav__item')];
const navItemsReversed = navItems.slice().reverse();
const videoModalBtn = document.getElementById('video-modal-btn');
const videoModal = document.getElementById('video-modal');
const closeVideoModalBtn = document.getElementById('close-video-btn');
const importantInfoBtn = document.getElementById('important-info-btn');
const importantInfoBlock = document.getElementById('important-info');
const collapseImportantInfoBtn = document.getElementById('collapse-important-info-btn');

const sections = [document.getElementById('hero-slider'), ...document.querySelectorAll('section')].reverse();
const globalnavItems = [document.createElement("li"), ...document.querySelectorAll('.globalnav__item')];


let lastElementFocused;
let firstTabStop;
let lastTabStop;
let lastViewportWidth = window.innerWidth;
let navItemActiveIdx = 0;






function setDocHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight/100}px`);
}

function resizeWindowHandler() {
    setDocHeight();

    const currentViewportWidth = window.innerWidth;

    if(lastViewportWidth < 992 && currentViewportWidth >= 992) { // from mobile to desktop
        if (navbar.classList.contains('mobile-navbar-expanded')) {
            if (navList.classList.contains('is-visible') && !importantInfoBlock.classList.contains('is-visible')) { // only nav
                document.body.classList.remove('lock-scroll');
                nav.setAttribute('hidden', true);
                hamburgerBtn.setAttribute("aria-expanded", false);
                hamburgerBtn.classList.remove('is-active');
                navList.classList.remove('is-visible');
                navItems.forEach(link => {
                    link.classList.remove('is-visible');
                });
                navbar.classList.remove('mobile-navbar-expanded');
                navbar.removeEventListener('keydown', trapTabKey);
                hamburgerBtn.removeEventListener('click', closeMainMenu);
                hamburgerBtn.addEventListener('click', openMainMenu);
            } else if (navList.classList.contains('is-visible') && importantInfoBlock.classList.contains('is-visible')) { // nav slided, block showed
                nav.setAttribute('hidden', true);
                navList.style = '';
                navList.classList.remove('is-visible');
                navList.classList.remove('is-slided-down');
                navbar.classList.remove('mobile-navbar-expanded');
                navbar.classList.add('desktop-navbar-expanded');
                navbar.removeEventListener('keydown', trapTabKey);
                hamburgerBtn.setAttribute("aria-expanded", false);
                hamburgerBtn.classList.remove('is-active');
                hamburgerBtn.removeEventListener('click', closeMainMenu);
                hamburgerBtn.addEventListener('click', openMainMenu);
            } else { // only info block showed
                navbar.classList.remove('mobile-navbar-expanded');
                navbar.classList.add('desktop-navbar-expanded');
            }
        } else if(nav.hasAttribute('hidden')) {
            nav.removeAttribute('hidden');
        }
    } else if(lastViewportWidth >= 992 && currentViewportWidth < 992) { // from desktop to mobile
        if (navbar.classList.contains('desktop-navbar-expanded')) {
            navbar.classList.remove('desktop-navbar-expanded');
            navbar.classList.add('mobile-navbar-expanded');
        }
        nav.setAttribute('hidden', true);
    }

    lastViewportWidth = currentViewportWidth;
}

function scrollHandler() {
    const currentSectionIdx = sections.length - sections.findIndex(section => window.scrollY >= section.offsetTop - 100) - 1;

    if(currentSectionIdx !== navItemActiveIdx) {
        globalnavItems[navItemActiveIdx].classList.remove('is-active');
        globalnavItems[currentSectionIdx].classList.add('is-active');
        navItemActiveIdx = currentSectionIdx;
    }
}



function trapTabKey(e) {
    // Check for TAB key press
    if (e.keyCode === 9) {

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

      // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.keyCode === 27) {
        if (navbar.classList.contains('mobile-navbar-expanded')) {
            closeMainMenu();
        } else if (!videoModal.classList.contains('is-hidden')) {
            closeVideoModal();
        }
    }
}




function openMainMenu() {
    // Accessibility and focus
    // Save current focus
    lastElementFocused = document.activeElement;

    hamburgerBtn.setAttribute("aria-expanded", true);
    // Unregister hamburger button from current event listener
    hamburgerBtn.removeEventListener('click', openMainMenu);
    // Register new event listener to close main menu
    hamburgerBtn.addEventListener('click', closeMainMenu);

    // Find all focusable children
    let focusableElements = document.querySelectorAll('.globalnav__item a');
    // Convert NodeList to Array
    focusableElements = Array.prototype.slice.call(focusableElements);
    focusableElements.unshift(hamburgerBtn);

    firstTabStop = focusableElements[0];
    lastTabStop = focusableElements[focusableElements.length - 1];
    
    // Listen for and trap the keyboard
    navbar.addEventListener('keydown', trapTabKey);


    // Openinig transition
    document.body.classList.add('lock-scroll');
    hamburgerBtn.classList.add('is-active');
    navbar.classList.add('mobile-navbar-expanded');
    nav.removeAttribute('hidden');
    /*
        Force a browser re-paint so the browser will realize the
        element is no longer `hidden` and allow transitions.
    */
    const reflow = nav.offsetHeight;
    
    navList.classList.add('is-visible');
    navItemsReversed.forEach((link, idx) => {
        setTimeout(() => {
            link.classList.add('is-visible');
        }, (idx/15 + 0.2)*1000);
    });


    // Focus first child
    firstTabStop.focus();
}

function closeMainMenu() {
    // Accessibility stuff
    setTimeout(() => {
        nav.setAttribute('hidden', true);
    }, 400);
    document.body.classList.remove('lock-scroll');
    hamburgerBtn.setAttribute("aria-expanded", false);


    // Closing transition
    hamburgerBtn.classList.remove('is-active');
    navItems.forEach((link, idx) => {
        setTimeout(() => {
            link.classList.remove('is-visible');
        }, (idx/10 + 0.1)*1000);
    });
    setTimeout(() => {
        navbar.classList.remove('mobile-navbar-expanded');
    }, 200);
    setTimeout(() => {
        navList.classList.remove('is-visible');
    }, 100);


    // Event listeners reset
    navbar.removeEventListener('keydown', trapTabKey);
    hamburgerBtn.removeEventListener('click', closeMainMenu);
    hamburgerBtn.addEventListener('click', openMainMenu);
}


function openVideoModal() {
    // Accessibility and focus
    // Save current focus
    lastElementFocused = document.activeElement;
    // Make elements focusable for keyboard tab users when modal show
    videoModal.inert = false;

    // Find all focusable children
    var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    var focusableElements = videoModal.querySelectorAll(focusableElementsString);
    // Convert NodeList to Array
    focusableElements = Array.prototype.slice.call(focusableElements);

    firstTabStop = focusableElements[0];
    lastTabStop = focusableElements[focusableElements.length - 1];
    
    // Listen for and trap the keyboard
    videoModal.addEventListener('keydown', trapTabKey);


    document.body.classList.add('lock-scroll');
    videoModal.setAttribute("aria-hidden", "false");
    videoModal.classList.remove('is-hidden');

    closeVideoModalBtn.addEventListener('click', closeVideoModal);

    // Focus first child
    firstTabStop.focus();
}

function closeVideoModal() {
    // Unregister event listeners from modal and close button
    videoModal.removeEventListener('keydown', trapTabKey);
    closeVideoModalBtn.removeEventListener('click', closeVideoModal);

    // Hide modal
    document.body.classList.remove('lock-scroll');
    videoModal.setAttribute("aria-hidden", "true");
    videoModal.classList.add('is-hidden');

    // Set focus back to element that had it before the modal was opened
    lastElementFocused.focus();
    // Make elements unfocusable for keyboard tab users when modal hidden
    videoModal.inert = true;
}

function expandImportantInfo() {
    // Accessibility and focus
    // Save current focus
    lastElementFocused = document.activeElement;

    // Make elements focusable for keyboard tab users when block show
    importantInfoBlock.inert = false;

    importantInfoBtn.setAttribute("aria-expanded", true);
    // Unregister hamburger button from current event listener
    importantInfoBtn.removeEventListener('click', expandImportantInfo);
    // Register new event listener to collapse imortant info block
    importantInfoBtn.addEventListener('click', collapseImportantInfo);
    collapseImportantInfoBtn.addEventListener('click', collapseImportantInfo);

    // Find all focusable children
    var focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
    var focusableElements = importantInfoBlock.querySelectorAll(focusableElementsString);
    // Convert NodeList to Array
    focusableElements = Array.prototype.slice.call(focusableElements);

    firstTabStop = focusableElements[0];
    lastTabStop = focusableElements[focusableElements.length - 1];
    
    // Listen for and trap the keyboard
    importantInfoBlock.addEventListener('keydown', trapTabKey);


    // Openinig transition
    if(navbar.classList.contains('mobile-navbar-expanded')) {
        navItemsReversed.forEach((link, idx) => {
            setTimeout(() => {
                link.classList.remove('is-visible');
            }, (idx/10 + 0.1)*1000);
        });
        navList.classList.add('is-slided-down');
        setTimeout(() => {
            navList.style.display = 'none';
            importantInfoBlock.classList.remove('is-hidden');
            importantInfoBlock.classList.add('is-visible');
        }, 450);
    } else if (window.innerWidth >= 992) {
        document.body.classList.add('lock-scroll');
        navbar.classList.add('desktop-navbar-expanded');
        importantInfoBlock.classList.remove('is-hidden');
        importantInfoBlock.classList.add('is-visible');
    } else {
        document.body.classList.add('lock-scroll');
        navbar.classList.add('mobile-navbar-expanded');
        importantInfoBlock.classList.remove('is-hidden');
        importantInfoBlock.classList.add('is-visible');
    }
    importantInfoBlock.setAttribute('aria-hidden', false);
    hamburgerBtn.setAttribute('hidden', true);
    hamburgerBtn.classList.add('is-hidden');


    // Focus first child
    firstTabStop.focus();
}

function collapseImportantInfo() {
    // Unregister event listeners from info block and collapse button
    importantInfoBlock.removeEventListener('keydown', trapTabKey);
    collapseImportantInfoBtn.removeEventListener('click', collapseImportantInfo);
    importantInfoBtn.removeEventListener('click', collapseImportantInfo);
    importantInfoBtn.addEventListener('click', expandImportantInfo);

    // Hide block
    if(navList.classList.contains('is-visible')) {
        setTimeout(() => {
            navList.style = '';
            /*
                Force a browser re-paint so the browser will realize the
                element is no longer `hidden` and allow transitions.
            */
            const reflow = navList.offsetHeight;

            navItems.forEach((link, idx) => {
                setTimeout(() => {
                    link.classList.add('is-visible');
                }, (idx/15 + 0.2)*1000);
            });
            navList.classList.remove('is-slided-down');
            importantInfoBlock.classList.add('is-hidden');
            hamburgerBtn.setAttribute('hidden', false);
            hamburgerBtn.classList.remove('is-hidden');
        }, 300);
        importantInfoBlock.classList.remove('is-visible');
    } else if(window.innerWidth >= 992) {
        navbar.classList.remove('desktop-navbar-expanded');
        setTimeout(() => {
            importantInfoBlock.classList.add('is-hidden');
        }, 300);
        setTimeout(() => {
            importantInfoBlock.classList.remove('is-visible');
        }, 100);
        hamburgerBtn.setAttribute('hidden', false);
        hamburgerBtn.classList.remove('is-hidden');
        document.body.classList.remove('lock-scroll');
    } else {
        setTimeout(() => {
            importantInfoBlock.classList.add('is-hidden');
            hamburgerBtn.setAttribute('hidden', false);
            hamburgerBtn.classList.remove('is-hidden');
        }, 300);
        navbar.classList.remove('mobile-navbar-expanded');
        importantInfoBlock.classList.remove('is-visible');
        document.body.classList.remove('lock-scroll');
    }
    importantInfoBlock.setAttribute("aria-hidden", true);
    importantInfoBtn.setAttribute("aria-expanded", false);
    
    

    // Set focus back to element that had it before the modal was opened
    lastElementFocused.focus();
    // Make elements unfocusable for keyboard tab users when modal hidden
    importantInfoBlock.inert = true;
}






//
//
// App initiazlization
// Make elements unfocusable for keyboard tab users when modal hidden
videoModal.inert = true;
importantInfoBlock.inert = true;


if (window.innerWidth >= 992) {
    if (nav.hasAttribute('hidden')) {
        nav.removeAttribute('hidden')
    }
}

setDocHeight();


// Add event listeners to elements
window.addEventListener('orientationchange', setDocHeight);
window.addEventListener('resize', resizeWindowHandler);
window.addEventListener('scroll', scrollHandler);
hamburgerBtn.addEventListener('click', openMainMenu);
importantInfoBtn.addEventListener('click', expandImportantInfo);
videoModalBtn.addEventListener('click', openVideoModal);










// Weekend Date
(function () {
    function nextDayOfWeek(dayIdx) {
        function getNextDate() {
            const today = new Date();
            let nextDate = new Date();
            nextDate.setDate(today.getDate() + (dayIdx - 1 - today.getDay() + 7) % 7 + 1);
            return nextDate;
        }
        return getNextDate;
    }
    const nextSaturday = nextDayOfWeek(6);
    const nextSunday = nextDayOfWeek(7);


    const dateHolder = document.getElementById('callout-info-date');

    let startOfWeekend;
    let endOfWeekend;
    const today = new Date();
    if(today.getDay() === 6) {  // case: is Saturday
        startOfWeekend = new Date(today);
        endOfWeekend = new Date(today);
        endOfWeekend.setDate(today.getDate() + 1);
    } else if(today.getDate() === 0) {  // case: is Sunday
        startOfWeekend = new Date(today);
        startOfWeekend.setDate(today.getDate() - 1);
        endOfWeekend = new Date(today);
    } else {    // case: any other weekday
        startOfWeekend = new Date(nextSaturday());
        endOfWeekend = new Date(nextSunday());
    }

    if(startOfWeekend.getMonth() === endOfWeekend.getMonth()) {
        dateHolder.textContent = `(${startOfWeekend.getDate().toString().padStart(2, '0')}-${endOfWeekend.getDate().toString().padStart(2, '0')}.${(startOfWeekend.getMonth()+1).toString().padStart(2, '0')})`;
    } else {
        dateHolder.textContent = `(${startOfWeekend.getDate().toString().padStart(2, '0')}.${(startOfWeekend.getMonth()+1).toString().padStart(2, '0')}-${endOfWeekend.getDate().toString().padStart(2, '0')}.${(endOfWeekend.getMonth()+1).toString().padStart(2, '0')})`;
    }
})();



// Hero Slider
(function () {
    const slides = Array.from(document.querySelectorAll('.hero-slider__slide'));
    let activeSlideIdx = 0;
    let lastSlideIdx = slides.length - 1;

    function nextSlide() {
        slides[activeSlideIdx].classList.remove('hero-slider__slide--active');
        if(activeSlideIdx === lastSlideIdx) {
            activeSlideIdx = 0;
        }
        else {
            activeSlideIdx++;
        }
        slides[activeSlideIdx].classList.add('hero-slider__slide--active');
    }

    setInterval(nextSlide, 6000);
})();


// Testimonials Slider
(function () {
    const testimonialsSlider = document.getElementById('testimonials-slider');

    const slider = new Glider(testimonialsSlider, {
        slidesToScroll: 1,
        slidesToShow: 1,
        draggable: true,
        scrollLock: true,
        rewind: true,
        dots: '#dots',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 3,
                  slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              }
          ]
    });

    const autoplayDelay = 7000;
    
    const autoplay = setInterval(() => {
        slider.scrollItem('next')
    }, autoplayDelay);


    testimonialsSlider.addEventListener('mouseover', (event) => {
        if (autoplay != null) {
          clearInterval(autoplay);
          autoplay = null;
        }
    }, 300);
    testimonialsSlider.addEventListener('mouseout', (event) => {
        if (autoplay == null) {
          autoplay = setInterval(() => {
              slider.scrollItem('next')
          }, autoplayDelay);
        }
    }, 300);
    
})();


// Logotypes Slider
(function () {
    const logotypesSlider = document.getElementById('partners-logos-slider');

    const slider = new Glider(logotypesSlider, {
        slidesToScroll: 1,
        slidesToShow: 1,
        draggable: true,
        scrollLock: true,
        rewind: true,
        responsive: [
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3
              }
            },
            {
              breakpoint: 576,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2
              }
            }
          ]
    });
    
    const autoplayDelay = 5000;
    
    const autoplay = setInterval(() => {
        slider.scrollItem('next')
    }, autoplayDelay);


    logotypesSlider.addEventListener('mouseover', (event) => {
        if (autoplay != null) {
          clearInterval(autoplay);
          autoplay = null;
        }
    }, 300);
    logotypesSlider.addEventListener('mouseout', (event) => {
        if (autoplay == null) {
          autoplay = setInterval(() => {
              slider.scrollItem('next')
          }, autoplayDelay);
        }
    }, 300);
})();


