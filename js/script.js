"use strict"

//  ОС
const isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (
			isMobile.Android() ||
			isMobile.BlackBerry() ||
			isMobile.iOS() ||
			isMobile.Opera() ||
			isMobile.Windows());
	},
};

function isIE() {
	ua = navigator.userAgent;
	let is_ie = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;
	return is_ie;
}

if (isMobile.any()) {
	document.body.classList.add("_touch");
} else {
	document.body.classList.add("_pc");
}


function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
};

testWebP(function (support) {

    if (support == true) {
        document.querySelector('body').classList.add('webp');
    } else {
        document.querySelector('body').classList.add('no-webp');
    }
});
function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();
const iconMenu = document.querySelector('.icon-menu');
const menuBody = document.querySelector('.menu__body');
const iconMenuMobile = document.querySelector('.mobile-menu');
const menuBodyMobile = document.querySelector('.mobile-menu__body');
const headerWrapper = document.querySelector('.header__wrapper');
if (iconMenu) {
	iconMenu.addEventListener("click", function (e) {
		if (iconMenuMobile.classList.contains("_active")) {
			iconMenuMobile.classList.remove("_active");
			menuBodyMobile.classList.remove("_active");
			document.body.classList.remove("_lock");
			headerWrapper.classList.remove("_active");
		}
		document.body.classList.toggle("_lock");
		iconMenu.classList.toggle("_active");
		menuBody.classList.toggle("_active");
		headerWrapper.classList.toggle("_active");
	});
}
if (iconMenuMobile) {
	iconMenuMobile.addEventListener("click", function (e) {
		if (iconMenu.classList.contains("_active")) {
			iconMenu.classList.remove("_active");
			menuBody.classList.remove("_active");
			document.body.classList.remove("_lock");
			headerWrapper.classList.remove("_active");
		}
		document.body.classList.toggle("_lock");
		iconMenuMobile.classList.toggle("_active");
		menuBodyMobile.classList.toggle("_active");
		headerWrapper.classList.toggle("_active");
	});
}




// SPOLLERS
const spollersArray = document.querySelectorAll('[data-spollers]');
if (spollersArray.length > 0) {
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		return !item.dataset.spollers.split(",")[0];
	});
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		return item.dataset.spollers.split(',')[0];
	});


	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		let mediaQueries = breakpointsArray.map(function (item) {
			return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});


		mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});


			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}



	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener('click', setSpollerAction);
			}
		});
	}



	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}
	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 300);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 300);
		}
	}
}


//======================================================================
//SlideToggle

let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideDown = (target, duration = 100) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');

		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//======================================================================
/*
Для родителя спойллера  data-spollers
Для заголовков спойлера data-spoller
Если нужно влючать/выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и типа брейкпоинта.
Например:
		data-spoller="992,max" - спойлеры будут работать только на экранах
меньше или равно 992px
		data-spoller="768,min" - спойлеры будут работать только на экранах
больше или равно 768px

если нужно чтобы в блоке открывался только один спойлер добавляем атрибут
data-one-spoller
*/

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
	for (let i = 0; i < popupLinks.length; i++) {
		const popupLink = popupLinks[i];
		popupLink.addEventListener("click", function (e) {
			const popupName = popupLink.getAttribute('href').replace("#", '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

const popupCloseIcon = document.querySelectorAll('.popup__close');
if (popupCloseIcon.length > 0) {
	for (let i = 0; i < popupCloseIcon.length; i++) {
		const el = popupCloseIcon[i];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');

		curentPopup.addEventListener('click', function (e) {
			if (!e.target.closest('.popup__body')) {
				popupClose(e.target.closest('.popup'));
			}
		})
	}
}

function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}


function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for (let i = 0; i < lockPadding.length; i++) {
			const el = lockPadding[i];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	body.classList.add('_lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let i = 0; i < lockPadding.length; i++) {
				const el = lockPadding[i];
				el.style.paddingRight = "0px";
			}
		}
		body.style.paddingRight = "0px";
		body.classList.remove('_lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}


document.addEventListener('keydown', function (e) {
	if (e.key === "Escape") {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});

(function () {

	if (!Element.prototype.closest) {

		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();

(function () {

	if (!Element.prototype.matches) {

		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msmatchesSelector;
	}
})();



// const { default: Swiper } = require("swiper");

const market = document.querySelector('.markets-slider');

if (market) {
	const marketsSlider = new Swiper(".markets-slider", {

		simulateTouch: false,
		autoHeight: true,
		slidesPerView: 10,
		slidesPerGroup: 1,
		autoplay: {
			delay: 1500,
		},
		initialSlide: 0,
		loop: true,
		speed: 800,
		breakpoints: {
			320: {
				slidesPerView: 4,
			},
			480: {
				slidesPerView: 8,
			},
		},
		// =========================
	});
}

const profit = document.querySelector('.profit');

if (profit) {
	const profitSlider = new Swiper(".profit-slider", {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		simulateTouch: true,
		slidesPerView: 3,
		spaceBetween: -30,
		grabCursor: true,
		slidesPerGroup: 1,
		slideToClickedSlide: true,
		centeredSlides: true,
		initialSlide: 1,
		loop: true,
		speed: 800,
		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
			},
			1200: {
				spaceBetween: -150,
			},
			1562: {
				spaceBetween: -200,
			},

		},
	});
}

const serviceSliders = document.querySelector('.service-item__content');

if (serviceSliders) {
	const sliderService = new Swiper(".slider", {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		simulateTouch: true,
		slidesPerView: 3,
		spaceBetween: 0,
		slidesPerGroup: 1,
		slideToClickedSlide: true,
		centeredSlides: true,
		initialSlide: 1,
		loop: true,
		speed: 800,
		breakpoints: {
			320: {
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
			}
		},
	});
}

const navSlid = document.querySelector('.nav-slider');

if (navSlid) {
	const navSldier = new Swiper(".nav-slider", {
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev'
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		simulateTouch: true,
		slidesPerView: 3,
		spaceBetween: 30,
		slidesPerGroup: 1,
		slideToClickedSlide: true,

		initialSlide: 1,
		loop: true,
		speed: 800,
		breakpoints: {
			480: {
				centeredSlides: true,
			}
		},
	});
}

const navSldier = new Swiper(".price-slider", {
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	initialSlide: 0,
	slidesPerGroup: 1,
	speed: 800,
	//правка для ширины экрана в 480opx
	spaceBetween: 250,
	breakpoints: {
		1025: {
			spaceBetween: 10,
		},
	},
});


const whySlider = new Swiper(".benefit__list-container", {
	initialSlide: 0,
	slidesPerGroup: 1,
	speed: 800,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	//правка для ширины экрана в 480px
	spaceBetween: 200,
	breakpoints: {
		480: {
			spaceBetween: 10,
		},
	},
});

let menuLinks = document.querySelectorAll('.menu__link[data-goto]');

if (menuLinks.length > 0) {
	menuLinks.forEach(menuLink => {
		menuLink.addEventListener("click", onMenuLinkClick);
	});

	function onMenuLinkClick(e) {
		const menuLink = e.target;
		if (menuLink.dataset.goto && document.querySelector(menuLink.dataset.goto)) {
			const gotoBlock = document.querySelector(menuLink.dataset.goto);
			const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY - document.querySelector("header").offsetHeight;

			if (menuBody.classList.contains("_active")) {
				document.body.classList.remove("_lock");
				iconMenu.classList.remove("_active");
				menuBody.classList.remove("_active");
			}

			window.scrollTo({
				top: gotoBlockValue,
				behavior: "smooth"
			});
			e.preventDefault();
		}
	}
}

// header observer
const headerElement = document.querySelector('.header');

const callback = function (entries, observer) {
	if (entries[0].isIntersecting) {
		headerElement.classList.remove('_scroll');
	} else {
		headerElement.classList.add('_scroll');
	}
};

const headerObserver = new IntersectionObserver(callback);
headerObserver.observe(headerElement);

// 2 layout menu
if (body.classList.contains('_touch')) {
	const arrow = document.querySelectorAll('._arrow');
	for (let i = 0; i < arrow.length; i++) {
		const thisLink = arrow[i];
		const subMenu = arrow[i].nextElementSibling;
		const thisArrow = arrow[i];

		thisLink.classList.add('parent');
		arrow[i].addEventListener('click', function (e) {
			subMenu.classList.toggle('open');
			thisArrow.classList.toggle('_open');
		});
	}
}
// 2 layout menu

// animation items
const AnimItems = document.querySelectorAll('._anim');

if (AnimItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);

	function animOnScroll() {
		for (let i = 0; i < AnimItems.length; i++) {
			const AnimItem = AnimItems[i];
			const animHeight = AnimItem.offsetHeight;
			const animOffset = offset(AnimItem).top - 2;
			const animStart = 1;

			let animItemPoint = window.innerHeight - animHeight / animStart;
			if (animHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((scrollY > animOffset - animItemPoint) && scrollY < (animOffset + animHeight)) {
				AnimItem.classList.add('_active');
			} else {
				AnimItem.classList.remove('_active');
			}
		}
		function offset(e) {
			const rect = e.getBoundingClientRect();
			const scrollTop = scrollY || document.documentElement.scrollTop;
			return {
				top: rect.top + scrollTop
			}
		}
	}
}

// animation items

// pagination
if (body.classList.contains('_touch')) {
	if (document.querySelectorAll('.benefit__pag').length > 0) {
		const tabs = (headerSelector, tabSelector, contentSelector, activeClass, display = 'grid') => {
			const header = document.querySelector(headerSelector);
			const tab = document.querySelectorAll(tabSelector);
			const content = document.querySelectorAll(contentSelector);

			function hideTabContent() {
				content.forEach(item => {
					item.style.display = 'none';
				});

				tab.forEach(item => {
					item.classList.remove(activeClass);
				});
			}

			function showTabContent(i = 0) {
				content[i].style.display = display;
				tab[i].classList.add(activeClass);
			}

			hideTabContent();
			showTabContent();

			header.addEventListener('click', (e) => {
				const target = e.target;
				if (target &&
					(target.classList.contains(tabSelector.replace(/\./, "")) ||
						target.parentNode.classList.contains(tabSelector.replace(/\./, "")))) {
					tab.forEach((item, i) => {
						if (target == item || target.parentNode == item) {
							hideTabContent();
							showTabContent(i);
						}
					});
				}
			});
		};

		tabs('.benefit__pag', '.pag__item', '.benefit__list', '_active');
	}

}

//выдвежной лист 

if (document.querySelector('#cost-btn')) {
	const btn360 = document.querySelector('#cost-btn'),
		list360 = document.querySelector('#cost-list');
	btn360.addEventListener('click', () => {
		if (!list360.classList.contains('active-list')) {
			list360.classList.add('active-list');
		} else {
			list360.classList.remove('active-list');
		}
	});
}


//touch событие для heade
const mediaQuery768 = window.matchMedia('(max-width: 768px)'),
	contentMenu = document.querySelector('#content-menu'),
	contentList = document.querySelector('#content-list');

function touchMenu() {
	contentMenu.addEventListener('touchstart', myTouch);
	contentMenu.href = "#";
	function myTouch() {
		if (contentList.style.display !== 'block') {
			contentList.href = '#';
			contentList.style.display = 'block';
		} else {
			contentList.style.display = 'none';
		}
	}
}
if (mediaQuery768.matches) {
	touchMenu();
}
console.log(mediaQuery768);
window.addEventListener('resize', function () {
	if (mediaQuery768.matches) {
		touchMenu();
	}
});

//кнопка актина при заполнении всех полей фопмы
let calcForm = document.querySelectorAll('form > [placeholder]');
console.log(calcForm);


