document.addEventListener('DOMContentLoaded', () => {
	const addToCartButtons = document.querySelectorAll('.add-to-cart')
	const cartItemCount = document.querySelector('.cart-icon span')
	const cartItemsList = document.querySelector('.cart-items')
	const cartTotal = document.querySelector('.cart-total')
	const cartIcon = document.querySelector('.cart-icon')
	const sidebar = document.getElementById('sidebar')
	const closeButton = document.querySelector('.sidebar-close')
	const checkoutBtn = document.getElementById('checkoutBtn') // "Ro'yxatni yuborish" tugmasi

	let cartItems = JSON.parse(localStorage.getItem('cart')) || [] // Eski haridlarni yuklash

	updateCartUI() // Sahifa yuklanganda savatni ko‘rsatish

	addToCartButtons.forEach((button, index) => {
		button.addEventListener('click', () => {
			const itemName =
				document.querySelectorAll('.card .card-title')[index].textContent
			const itemPrice = parseFloat(
				document
					.querySelectorAll('.price')
					[index].textContent.replace(/\D/g, '')
			)

			const existingItem = cartItems.find(item => item.name === itemName)
			if (existingItem) {
				existingItem.quantity++
			} else {
				cartItems.push({ name: itemName, price: itemPrice, quantity: 1 })
			}

			saveCart() // Ma'lumotlarni localStorage'ga saqlash
			updateCartUI()
		})
	})

	// Savatni localStorage'ga saqlash
	function saveCart() {
		localStorage.setItem('cart', JSON.stringify(cartItems))
	}

	// Savatni yangilash
	function updateCartUI() {
		updateCartItemCount()
		updateCartItemList()
		updateCartTotal()
	}

	// Savatdagi elementlar sonini yangilash
	function updateCartItemCount() {
		cartItemCount.textContent = cartItems.reduce(
			(sum, item) => sum + item.quantity,
			0
		)
	}

	// Savatdagi buyurtmalar ro'yxatini yangilash
	function updateCartItemList() {
		cartItemsList.innerHTML =
			cartItems.length === 0
				? `<div>Savatchingiz bo‘sh!</div>`
				: cartItems
						.map(
							item => `
	<div class="cart-item">
		<span>(${item.quantity}x) ${item.name}</span>
		<span class="cart-item-price">${(
			item.price * item.quantity
		).toLocaleString()} so‘m
			<button class="remove-item" data-name="${
				item.name
			}"><i class="fa-solid fa-times"></i></button></span>
	</div>
	`
						)
						.join('')
	}

	// Savatdagi jami summani yangilash
	function updateCartTotal() {
		const totalAmount = cartItems.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		)
		cartTotal.textContent = `${totalAmount.toLocaleString()} so‘m`
	}

	// Savatdagi mahsulotni olib tashlash
	cartItemsList.addEventListener('click', event => {
		if (event.target.closest('.remove-item')) {
			const itemName = event.target.closest('.remove-item').dataset.name
			removeItemFromCart(itemName)
		}
	})

	// Savatdagi mahsulotni olib tashlash
	function removeItemFromCart(itemName) {
		cartItems = cartItems.filter(item => item.name !== itemName)
		saveCart() // O‘zgartirilgan savatni saqlash
		updateCartUI()
	}

	// Savatni ko'rsatish
	cartIcon.addEventListener('click', () => {
		sidebar.classList.toggle('open')
	})

	// Sidebar'ni yopish
	closeButton.addEventListener('click', () => {
		sidebar.classList.remove('open')
	})

	// "Ro'yxatni yuborish" tugmasi bosilganda buyurtmalarni serverga yuborish
	checkoutBtn.addEventListener('click', () => {
		if (cartItems.length === 0) {
			alert("Savatingiz bo'sh, iltimos mahsulot tanlang.")
			return
		}

		const orderData = {
			items: cartItems,
			totalAmount: cartItems.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			),
		}

		// Serverga buyurtma yuborish
		fetch('http://localhost:3000/submit-order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(orderData),
		})
			.then(response => response.json())
			.then(data => {
				if (data.message === 'Buyurtma muvaffaqiyatli yuborildi!') {
					alert('Buyurtma muvaffaqiyatli yuborildi!')
					// Buyurtma muvaffaqiyatli yuborilgandan keyin savatni bo'shatish
					cartItems = []
					saveCart()
					updateCartUI()
				} else {
					alert('Buyurtma yuborishda xato yuz berdi.')
				}
			})
			.catch(error => {
				console.error('Xato:', error)
				alert("Xatolik yuz berdi, iltimos qayta urinib ko'ring.")
			})
	})
})
