function validateEmail(element) {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const errorElement = document.getElementById(`error-${element.name}`)

    if (!regEx.test(element.value)) {
        errorElement.innerHTML = `Please enter a valid email address.`
        return false
    }
    errorElement.innerHTML = ``
    return true
}

function validateName(element) {
    const regEx = /^([a-öA-Ö\u00C0-\u017F]+(([' -][a-öA-Ö])?[a-öA-Ö]*)){2,}$/
    const errorElement = document.getElementById(`error-${element.name}`)
    if (!regEx.test(element.value)) {
        errorElement.innerHTML = `Please enter a valid name.`
        return false
    }
    errorElement.innerHTML = ``
    return true
}

function validateComment(element) {
    const errorElement = document.getElementById(`error-${element.name}`)
    if (element.value.trim() === '') {
        errorElement.innerHTML = `How can you contact us without a comment?.`
        return false
    }
    errorElement.innerHTML = ``
    return true
}

function validate(event) {
    document.getElementById("error-submit").innerHTML = '';
    switch (event.target.name) {
        case 'email':
            validateEmail(event.target)
            break;
        case 'name':
            validateName(event.target)
            break;
        case 'comment':
            validateComment(event.target)
            break;
    }
}

async function handleSubmit(e) {
    e.preventDefault()
    const errors = []
    const errorMessage = document.getElementById('error-submit')
    errorMessage.innerHTML = ''
    for (let element of e.target) {
        if (element.required) {
            const errorElement = document.getElementById(`error-${element.name}`)
            if (element.value.length === 0) {
                switch (element.name) {
                    case 'email':
                        errorElement.innerHTML = `You must provide an valid ${element.name} adress.`
                        break
                    case 'name':
                        errorElement.innerHTML = `You must provide a valid ${element.name}.`
                        break
                    case 'comment':
                        errorElement.innerHTML = `You must provide a ${element.name}.`
                        break
                }
                errors.push(false)
            } else {
                errorElement.innerHTML = ``
                switch (element.name) {
                    case 'email':
                        errors.push(validateEmail(element))
                        break
                    case 'name':
                        errors.push(validateName(element))
                        break
                    case 'comment':
                        errors.push(validateComment(element))
                        break
                }
            }
        }
    }

    if (!errors.includes(false)) {
        let inputName = document.getElementById('name');
        let inputEmail = document.getElementById('email');
        let inputComment = document.getElementById('comment');
        let submit = document.getElementById("error-submit")

        const form = {
            name: e.target[0].value,
            email: e.target[1].value,
            comments: e.target[2].value
        }

        const res = await fetch(`https://kyh-net22.azurewebsites.net/api/contacts`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        })

        if (res.status === 200) {
            submit.style.color = "#000000";
            inputName.value = '';
            inputEmail.value = '';
            inputComment.value = '';
            submit.innerHTML = 'Thank you for your time!'
            console.log('Success')
        }
        else {
            inputName.value = '';
            inputEmail.value = '';
            inputComment.value = '';
            submit.innerHTML = 'Oh No...Something broke...'
            console.log('Error: ')
        }
    }
}

//product.js
async function getProducts(target, tag) {
    const element = document.querySelector(target)
  
    const res = await fetch(`https://kyh-net22.azurewebsites.net/api/products/${tag}`)
    const data = await res.json()
  
    for(let item of data) {
        element.innerHTML += 
        `
            <div class="product-card">
                <div class="product-card-img">
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="product-card-menu">
                    <nav class="menu-icons">
                        <a class="menu-link" href="#"><i class="fa-regular fa-code-compare"></i></a>
                        <a class="menu-link" href="#"><i class="fa-regular fa-heart"></i></a>
                        <a class="menu-link" href="#"><i class="fa-regular fa-bag-shopping"></i></a>                   
                    </nav>
                    <a href="#" class="btn-theme">QUICK VIEW</a>
                    </div>
                <div class="product-card-body">
                    <p class="product-card-category">${item.category}</p>
                    <p class="product-card-title">${item.name}</p>
                    <div class="product-card-ranking">
                        <i class="fa-solid fa-sharp fa-star"></i>
                        <i class="fa-solid fa-sharp fa-star"></i>
                        <i class="fa-solid fa-sharp fa-star"></i>
                        <i class="fa-solid fa-sharp fa-star"></i>
                        <i class="fa-regular fa-sharp fa-star"></i>
                    </div>
                    <p class="product-card-price">${item.originalPrice} ${item.currency}</p>
                </div>
            </div>
        </div>
        `
    }
  }

//script
const arrow = document.querySelector('#totop-arrow')
arrow.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: "smooth"})
})