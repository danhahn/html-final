const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');

let isOpen = false;

const toggleNav = () => {
	if (isOpen) {
		navList.style.maxHeight = "0";
		isOpen = false;
	} else {
		navList.style.maxHeight = "292px";
		isOpen = true;
	}
	console.log(isOpen)
}

hamburger.addEventListener('click', toggleNav);
