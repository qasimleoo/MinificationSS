let theToggle = document.getElementById("toggle"), theNavBar = document.getElementById("nav");
let dropDown = document.querySelectorAll(".dropdown");

function hasClass(e, a) {
    return new RegExp(" " + a + " ").test(" " + e.className + " ")
}

function toggleClass(e, a) {
    let s = " " + e.className.replace(/[\t\r\n]/g, " ") + " ";
    if (hasClass(e, a)) {
        for (; s.indexOf(" " + a + " ") >= 0;) s = s.replace(" " + a + " ", " ");
        e.className = s.replace(/^\s+|\s+$/g, ""), theNavBar.className = s.replace(/^\s+|\s+$/g, "")
    } else e.className += " " + a, theNavBar.className = "navMenuResponsive navMenuResponsiveUp"
}

theToggle.onclick = function () {
    return toggleClass(this, "on"), !1
};

dropDown.forEach((element)=> {
    element.onclick = ()=> {
        let content = element.querySelector(".dropdown-content");
        if (content.classList.contains("visible")) {
            content.classList.remove("visible");
        } else {
            let contents = document.querySelectorAll(".dropdown-content");
            contents.forEach((element) => {
                element.classList.remove("visible");
            })
            content.classList.toggle("visible");
        }
    }
})

function setItemWithExpiration(key, value, ttl) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getItemWithExpiration(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

async function fetchGeoLocationData() {
    const cachedData = getItemWithExpiration('geoLocationData');
    if (cachedData) {
        return;
    }

    try {
        const response = await fetch('https://us-central1-ipgeolocation-414906.cloudfunctions.net/ipgeo');
        const data = await response.json();

        setItemWithExpiration('geoLocationData', data, 86400000);

        postGeoLocationData(data);
    } catch (error) {
    }
}

async function postGeoLocationData(data) {
    try {
        await fetch('https://ipgeo.ipgeolocation.io/ipgeo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
    }
}

if (document.readyState !== 'loading') {
    fetchGeoLocationData();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        fetchGeoLocationData();
    });
}

let temporalCoverageDaily = document.querySelectorAll(".temporalCoverageDaily");
if (temporalCoverageDaily.length > 0) {
    temporalCoverageDaily.forEach((t) => {
        t.setAttribute('content', new Date().toISOString().split('T')[0]);
    });
}

let drop_list = ['doc', 'products', 'tools', 'blog'];

drop_list.forEach((element) => {
    if (document.getElementById('drop-opened-' + element) && document.getElementById('dropdown-hovers-' + element)) {
        const dropdownContent = document.getElementById('drop-opened-' + element);
        const dropdownHover = document.getElementById('dropdown-hovers-' + element);
        const openedResponsive = document.getElementById('drop-opened-up-in-' + element);
        const closeDD = document.getElementById('close-n-' + element);

        const nonDDHovers = document.querySelectorAll('.non-dd-hovers');
        const arrow = document.getElementById('arrow-' + element);
        let count = 0;

        dropdownContent.addEventListener('mouseenter', () => {
            dropdownHover.classList.add('active');
            arrow.style.transform = 'rotate(-135deg)';
            dropdownContent.style.opacity = '1';
            dropdownContent.style.display = 'block';
        });

        dropdownContent.addEventListener('mouseleave', () => {
            dropdownHover.classList.remove('active');
            arrow.style.transform = 'rotate(45deg)';
            dropdownContent.style.opacity = '0';
            count++;
            document.querySelectorAll('.drop-opened-up-in').forEach(element => {
                element.classList.remove('show');
            });
            document.querySelectorAll(".drop-opened-up").forEach((element) => {
                element.style.display = 'none';
            });
            setTimeout(() => {
                if (count % 2  === 0) {
                    dropdownContent.style.display = 'none';
                }
            }, 200);
        });

        dropdownHover.addEventListener('click', () => {
            count++;
            if (dropdownContent.classList.contains("closeNavBar")) {
                dropdownContent.classList.remove("closeNavBar");
            } else if (count % 2 === 0) {
                dropdownContent.classList.add("closeNavBar");
            }
        });

        dropdownHover.addEventListener('mouseenter', () => {
            dropdownContent.classList.remove("closeNavBar");
            arrow.style.transform = 'rotate(-135deg)';
            document.querySelectorAll(".drop-opened-up").forEach((element) => {
                element.style.display = 'none';
            })
            setTimeout(() => {
                dropdownContent.style.opacity = '1';
                dropdownContent.style.display = 'block';
            }, 200);
        });

        nonDDHovers.forEach((element) => {
            element.addEventListener('mouseenter', () => {
                dropdownContent.style.display = 'none';
            });
        })

        dropdownHover.addEventListener('mouseleave', () => {
            arrow.style.transform = 'rotate(45deg)';
            document.querySelectorAll(".drop-opened-up").forEach((element) => {
                element.style.display = 'none';
            });
        });

        document.querySelectorAll(".scroll-down").forEach((element) => {
            element.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        });

        document.querySelectorAll(".close-subnav").forEach((element) => {
            element.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        });

        closeDD.addEventListener('click', () => {
            dropdownContent.classList.remove("visible");
        });
    }
});


const elements = document.querySelectorAll('.drop-opened-up-in');
if(elements){
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    }, {
        threshold: 0.5
    });

    elements.forEach((element) => {
        observer.observe(element);
    });
}

function tilt (e, tilt_scale) {
    e.forEach((element) => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const cardCenterX = rect.width / 2;
            const cardCenterY = rect.height / 2;

            const tiltX = (cardCenterX - mouseX) / cardCenterX * tilt_scale;
            const tiltY = (cardCenterY - mouseY) / cardCenterY * tilt_scale;

            element.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${-tiltX}deg)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            element.style.backgroundColor = '#FAEBD7FF';
        });

        element.addEventListener('mouseenter', () => {
            element.style.backgroundColor = '#fff5e2';
        });
    });
}

let card = document.querySelectorAll('.index-card');
let whois_db = document.querySelectorAll('.whois-db');
if(card){
    tilt(card, 10);
}
if(whois_db){
    tilt(whois_db, 0.5);
}

let text = document.getElementById('index-code-block');
if (text){
    text = document.getElementById('index-code-block').textContent
    document.getElementById('index-code-block').textContent = '';
    let index = 0;
    function type() {
        document.getElementById('index-code-block').textContent += text[index];
        index++;
        if (index < text.length) {
            setTimeout(type, 0.75);
        }
    }
    type();
}

const cursor = document.querySelector('.bg__gradient');
if (cursor) {
    let mouseX = 0;
    let mouseY = 0;

    let cursorX = 0;
    let cursorY = 0;

    let speed = 0.1;

    function animate() {
        let distX = mouseX - cursorX;
        let distY = mouseY - cursorY;

        cursorX = cursorX + (distX * speed);
        cursorY = cursorY + (distY * speed);

        cursor.style.left = cursorX  + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animate);
    }

    animate();
    document.addEventListener('mousemove', (event) => {
        mouseX = event.pageX;
        mouseY = event.pageY;
    })
}


const observerY = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport-y');
        } else {
            entry.target.classList.remove('in-viewport-y');
        }
    });
}, {threshold: 0.25});

let elementsY = document.querySelectorAll('.index-bg-animations div, .vertical-obs, .vertical-observer');
if (elementsY) {
    let delayY = 0;
    elementsY.forEach(element => {
        setTimeout(() => {
            observerY.observe(element);
        }, delayY);
        delayY += 100;
    });
}

const observerX = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport-x');
        } else {
            entry.target.classList.remove('in-viewport-x');
        }
    });
}, {threshold: 0.25});

const elementsX = document.querySelectorAll('.horizontal-obs');
if(elementsX) {
    let delayX = 0;
    elementsX.forEach(element => {
        setTimeout(() => {
            observerX.observe(element);
        }, delayX);
        delayX += 200;
    });
}

const observerReverseX = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport-anti-x');
        } else {
            entry.target.classList.remove('in-viewport-anti-x');
        }
    });
}, {threshold: 0.25});

const elementsReverseX = document.querySelectorAll('.horizontal-anti-obs');
if(elementsX) {
    let delayX = 0;
    elementsReverseX.forEach(element => {
        setTimeout(() => {
            observerReverseX.observe(element);
        }, delayX);
        delayX += 200;
    });
}

const images = document.querySelectorAll('.image');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.35 });

images.forEach(image => {
    observer.observe(image);
});

const updateHeights = () => {
    const setHeight = (element, variable) => {
        if(element) {
            document.documentElement.style.setProperty(variable, `${element.offsetHeight}px`);
        }
    }

    setHeight(document.querySelector('.portfolio-card'), '--portfolio-height');
    setHeight(document.querySelector('.in-cards'), '--card-height');
    setHeight(document.querySelector('.db-height'), '--db-line-height');
    setHeight(document.querySelector('.utility-height'), '--utility-line-height');
    setHeight(document.querySelector('.use-cases-height'), '--cases-line-height');
    setHeight(document.querySelector('.app-height'), '--app-line-height');
    setHeight(document.querySelector('.scale-height'), '--scale-line-height');
    setHeight(document.querySelector('.ease-height'), '--ease-line-height');
    setHeight(document.querySelector('.service-height'), '--service-line-height');
};

updateHeights();
window.addEventListener('resize', updateHeights);

const overlay = document.getElementById("banner");
if (overlay) {
    overlay.addEventListener('click', () => {
        document.querySelectorAll(".drop-opened-up").forEach((element) => {
            element.style.display = 'none';
        });
    });
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        document.querySelectorAll(".drop-opened-up").forEach((element) => {
            element.style.display = 'none';
        });
    }
});


