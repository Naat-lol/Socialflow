// -----------------------
// AUTENTICAÇÃO
// -----------------------
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');
const loginError = document.getElementById('loginError');
const cadError = document.getElementById('cadError');
const toCadastroBtn = document.getElementById('toCadastro');
const toLoginBtn = document.getElementById('toLogin');

const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const userNameSpan = document.getElementById('userName');
const btnLogout = document.getElementById('btnLogout');

function showLogin() { formLogin.classList.remove('hidden'); formCadastro.classList.add('hidden'); clearErrors(); }
function showCadastro() { formCadastro.classList.remove('hidden'); formLogin.classList.add('hidden'); clearErrors(); }
function clearErrors() { loginError.textContent=''; cadError.textContent=''; }
function validateEmail(email){ return /\S+@\S+\.\S+/.test(email); }

toCadastroBtn.addEventListener('click', showCadastro);
toLoginBtn.addEventListener('click', showLogin);

formCadastro.addEventListener('submit', e => {
  e.preventDefault(); clearErrors();
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById
