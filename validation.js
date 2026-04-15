const form = document.getElementById('form')
const wrapper = document.querySelector('.wrapper')
const firstname_input = document.getElementById('firstname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')

function clearFieldErrors() {
  document.querySelectorAll('.field.incorrect').forEach((el) => {
    el.classList.remove('incorrect')
  })
  error_message.innerText = ''
  error_message.classList.remove('visible')
  if (wrapper) {
    wrapper.classList.remove('shake')
  }
}

function showErrorMessage(text) {
  error_message.classList.remove('visible')
  error_message.innerText = text
  requestAnimationFrame(() => {
    error_message.classList.add('visible')
  })
}

function triggerShake() {
  if (!wrapper) return
  wrapper.classList.remove('shake')
  void wrapper.offsetWidth
  wrapper.classList.add('shake')
  window.setTimeout(() => {
    wrapper.classList.remove('shake')
  }, 450)
}

function triggerCardTransition() {
  if (!wrapper) return
  wrapper.classList.remove('bg-transition')
  void wrapper.offsetWidth
  wrapper.classList.add('bg-transition')
  window.setTimeout(() => {
    wrapper.classList.remove('bg-transition')
  }, 1900)
}

form.addEventListener('submit', (e) => {
  clearFieldErrors()

  let errors = []

  if (firstname_input) {
    errors = getSignupFormErrors(
      firstname_input.value,
      email_input.value,
      password_input.value,
      repeat_password_input.value
    )
  } else {
    errors = getLoginFormErrors(email_input.value, password_input.value)
  }

  if (errors.length > 0) {
    e.preventDefault()
    showErrorMessage(errors.join('. '))
    triggerShake()
  }
})

function getSignupFormErrors(firstname, email, password, repeatPassword) {
  let errors = []

  if (firstname === '' || firstname == null) {
    errors.push('Firstname is required')
    firstname_input.parentElement.classList.add('incorrect')
  }
  if (email === '' || email == null) {
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect')
  }
  if (password === '' || password == null) {
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect')
  }
  if (password.length < 8) {
    errors.push('Password must have at least 8 characters')
    password_input.parentElement.classList.add('incorrect')
  }
  if (password !== repeatPassword) {
    errors.push('Password does not match repeated password')
    password_input.parentElement.classList.add('incorrect')
    repeat_password_input.parentElement.classList.add('incorrect')
  }

  return errors
}

function getLoginFormErrors(email, password) {
  let errors = []

  if (email === '' || email == null) {
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect')
  }
  if (password === '' || password == null) {
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect')
  }

  return errors
}

const allInputs = [firstname_input, email_input, password_input, repeat_password_input].filter(
  (input) => input != null
)

allInputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (input.parentElement.classList.contains('incorrect')) {
      input.parentElement.classList.remove('incorrect')
      error_message.innerText = ''
      error_message.classList.remove('visible')
    }
  })
})

function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach((btn) => {
    const eyeOn = btn.querySelector('.icon-eye')
    const eyeOff = btn.querySelector('.icon-eye-off')
    btn.addEventListener('click', () => {
      const field = btn.closest('.field')
      const input = field && field.querySelector('input')
      if (!input) return

      const revealing = input.type === 'password'
      input.type = revealing ? 'text' : 'password'
      btn.setAttribute('aria-pressed', revealing ? 'true' : 'false')
      btn.setAttribute('aria-label', revealing ? 'Hide password' : 'Show password')

      if (eyeOn && eyeOff) {
        eyeOn.toggleAttribute('hidden', revealing)
        eyeOff.toggleAttribute('hidden', !revealing)
      }
    })
  })
}

function initPageTransitions() {
  document.querySelectorAll('a[href$="login.html"], a[href$="signup.html"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      if (e.defaultPrevented) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const href = a.getAttribute('href')
      if (!href) return
      e.preventDefault()
      document.body.classList.add('page-exit')
      window.setTimeout(() => {
        window.location.href = href
      }, 280)
    })
  })
}

function initBackgroundSlideshow() {
  const layerA = document.querySelector('.bg-a')
  const layerB = document.querySelector('.bg-b')
  if (!layerA || !layerB) return

  const images = [
    'background.jpg',
    'background2.jpg',
    'viola (1).jpg',
    'viola (2).jpg',
    'viola (3).jpg'
  ]

  const transitions = ['t-fade', 't-zoom', 't-slide-left', 't-slide-up']
  let activeLayer = layerA
  let hiddenLayer = layerB
  let index = 0
  let transitionIndex = 0

  activeLayer.style.backgroundImage = `url("${images[index]}")`
  activeLayer.classList.add('incoming')

  window.setInterval(() => {
    index = (index + 1) % images.length
    const transitionClass = transitions[transitionIndex % transitions.length]
    transitionIndex += 1

    hiddenLayer.style.backgroundImage = `url("${images[index]}")`
    hiddenLayer.classList.remove('outgoing')
    hiddenLayer.classList.add('incoming', transitionClass)

    activeLayer.classList.remove('incoming')
    activeLayer.classList.add('outgoing', transitionClass)
    triggerCardTransition()

    window.setTimeout(() => {
      activeLayer.classList.remove('outgoing', transitionClass)
      hiddenLayer.classList.remove('incoming', transitionClass)

      const previousActive = activeLayer
      activeLayer = hiddenLayer
      hiddenLayer = previousActive
    }, 1900)
  }, 5000)
}

initPasswordToggles()
initPageTransitions()
initBackgroundSlideshow()
