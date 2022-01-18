const toCurrency = (price) => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'uah',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach( node => {
    node.textContent = toCurrency(node.textContent)
})

const $cart = document.querySelector('#cart');

if ($cart) {
    $cart.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;

            fetch(`/cart/remove/${id}`, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf,
                }
            }).then(response => response.json())
                .then(cart => {
                    if (cart.courses.length) {
                        const html = cart.courses.map(
                            it => {
                                return`
                                    <tr>
                                        <td>${it.title}</td>
                                        <td>${it.count}</td>
                                        <td>
                                        <button class="btn btn-small js-remove" data-id="${it.id}">Delete</button>
                                    </td>
                                </tr>
                                `
                            }
                        ).join('');

                        $cart.querySelector('tbody').innerHTML = html;
                        $cart.querySelector('.price').textContent = toCurrency(cart.price);
                    } else {
                        $cart.innerHTML = '<p> Cart is empty</p>'
                    }
                })
        }
    })
}

const toDate = (date) => {
    return new Intl.DateTimeFormat('ru-Ru', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach( node => {
    node.textContent = toDate(node.textContent)
})

M.Tabs.init(document.querySelectorAll('.tabs'));

