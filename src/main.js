import './style.css'

// Build the login page
document.querySelector('#app').innerHTML = `
  <div class="login-container">
    <div class="login-card">
      <div class="logo-section">
        <svg class="telegram-icon" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tg-grad" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stop-color="#2AABEE"/>
              <stop offset="100%" stop-color="#229ED9"/>
            </linearGradient>
          </defs>
          <circle cx="120" cy="120" r="120" fill="url(#tg-grad)"/>
          <path d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 170 80" fill="#C8DAEA"/>
          <path d="M98 175c3 0 4.3-1.4 6-3l16-15.6-20-12" fill="#A9C9DD"/>
          <path d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1l19.7-92.8c2-8.1-3.1-11.7-8.4-9.3L67 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3" fill="#fff"/>
        </svg>
        <h1>Telegram Login</h1>
        <p class="subtitle">Sign in with your Telegram account</p>
      </div>
      
      <div class="widget-section" id="telegram-widget"></div>
      
      <div class="user-info" id="user-info" style="display:none;">
        <div class="avatar" id="user-avatar"></div>
        <h2 id="user-name"></h2>
        <p class="user-handle" id="user-handle"></p>
        <p class="user-id" id="user-id"></p>
        <button class="logout-btn" id="logout-btn">Logout</button>
      </div>
    </div>
  </div>
`

// Telegram auth callback — runs when user logs in via widget
window.onTelegramAuth = function (user) {
  console.log('Telegram user data:', user)

  // Hide widget, show user info
  document.getElementById('telegram-widget').style.display = 'none'
  const info = document.getElementById('user-info')
  info.style.display = 'flex'

  // Avatar
  const avatar = document.getElementById('user-avatar')
  if (user.photo_url) {
    avatar.innerHTML = `<img src="${user.photo_url}" alt="avatar" />`
  } else {
    avatar.innerHTML = `<span>${user.first_name.charAt(0)}</span>`
  }

  // Name & handle
  document.getElementById('user-name').textContent =
    `${user.first_name}${user.last_name ? ' ' + user.last_name : ''}`
  document.getElementById('user-handle').textContent =
    user.username ? `@${user.username}` : ''
  document.getElementById('user-id').textContent = `ID: ${user.id}`

  // Save to localStorage
  localStorage.setItem('tg_user', JSON.stringify(user))
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('tg_user')
  document.getElementById('user-info').style.display = 'none'
  document.getElementById('telegram-widget').style.display = 'flex'
  loadWidget()
})

// Inject Telegram widget script
function loadWidget() {
  const container = document.getElementById('telegram-widget')
  container.innerHTML = '' // clear old widget
  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', 'sampleoauthbot')
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  script.async = true
  container.appendChild(script)
}

// On page load: restore session or show widget
const saved = localStorage.getItem('tg_user')
if (saved) {
  window.onTelegramAuth(JSON.parse(saved))
} else {
  loadWidget()
}
