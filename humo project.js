document.addEventListener('DOMContentLoaded', () => {
	const navLinks = document.querySelectorAll('.nav-menu .nav-link')
	const menuOpenButton = document.querySelector('#menu-open-button')
	const menuCloseButton = document.querySelector('#menu-close-button')
	const mobileMenu = document.body // 'show-mobile-menu' klassi bodyga qo'shiladi

	// Menyu ochish
	menuOpenButton.addEventListener('click', () => {
		mobileMenu.classList.toggle('show-mobile-menu') // Menyu ko'rsatiladi yoki yashiriladi
	})

	// Menyu yopish (close button bosilganda)
	menuCloseButton.addEventListener('click', () => {
		mobileMenu.classList.remove('show-mobile-menu') // Menyu yopiladi
	})

	// Menyu tashqarisiga bosganda ham menyu yopilishi kerak
	document.addEventListener('click', event => {
		if (
			!event.target.closest('.nav-menu') &&
			!event.target.closest('#menu-open-button') &&
			mobileMenu.classList.contains('show-mobile-menu')
		) {
			mobileMenu.classList.remove('show-mobile-menu') // Menyu yopiladi
		}
	})

	// Menyu havolalarini bosganda ham menyu yopilsin
	navLinks.forEach(link => {
		link.addEventListener('click', () => {
			mobileMenu.classList.remove('show-mobile-menu') // Menyu yopiladi
		})
	})
})

//  ✅🚨Xona buyurtma qilish bo'limi
// Formani yuborishdan oldin tekshirish
const form = document.getElementById('bookingForm')
form.addEventListener('submit', function (event) {
	event.preventDefault() // Formaning avtomatik yuborilishini to'xtatish

	const name = document.getElementById('name').value
	const phone = document.getElementById('phone').value
	const email = document.getElementById('email').value
	const date = document.getElementById('date').value
	const time = document.getElementById('time').value
	const room = parseInt(document.getElementById('room').value)
	const guests = parseInt(document.getElementById('guests').value)
	const specialRequest = document.getElementById('specialRequest').value

	// Barcha maydonlarni to'ldirishni tekshirish
	if (!name || !phone || !email || !date || !time || !room || !guests) {
		alert("Iltimos, barcha maydonlarni to'ldiring!")
		return
	}

	// Mehmonlar soni va xonalar sonini tekshirish
	if (guests > 20) {
		alert("Mehmonlar soni maksimal 20 ta bo'lishi mumkin!")
		return
	}

	if (room > 20) {
		alert("Xonalar soni maksimal 20 ta bo'lishi mumkin!")
		return
	}

	// Hozirgi yilni olish va kiritilgan sananing yilini tekshirish
	const currentYear = new Date().getFullYear() // Hozirgi yil
	const selectedYear = new Date(date).getFullYear() // Foydalanuvchi kiritgan yil

	if (selectedYear !== currentYear) {
		alert('Iltimos, faqat hozirgi yilni tanlang!')
		return
	}

	// Ma'lumotlarni serverga yuborish
	console.log({
		name,
		phone,
		email,
		date,
		time,
		room,
		guests,
		specialRequest,
	})

	fetch('http://localhost:3001/book-table', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
			phone,
			email,
			date,
			time,
			room,
			guests,
			specialRequest,
		}),
	})
		.then(response => response.json())
		.then(data => {
			if (data.message) {
				alert(data.message) // Serverdan javobni ko'rsatish
			} else {
				alert('Buyurtma muvaffaqiyatli yuborildi!')
			}
		})
		.catch(error => {
			alert('Xatolik yuz berdi!')
			console.error(error)
		})
})

// ✅🚨Xona buyurtma qilish bo'limi

//✅🚨 Savatchadan zakaz qilish
//✅🚨 Savatchadan zakaz qilish
