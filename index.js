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

function showLogin() {
  formLogin.classList.remove('hidden');
  formCadastro.classList.add('hidden');
  clearErrors();
}

function showCadastro() {
  formCadastro.classList.remove('hidden');
  formLogin.classList.add('hidden');
  clearErrors();
}

function clearErrors() {
  loginError.textContent = '';
  cadError.textContent = '';
}

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

toCadastroBtn.addEventListener('click', showCadastro);
toLoginBtn.addEventListener('click', showLogin);

formCadastro.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();

  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim().toLowerCase();
  const senha = document.getElementById('cadSenha').value;

  if(nome.length < 2){ cadError.textContent = 'Nome deve ter pelo menos 2 caracteres.'; return; }
  if(!validateEmail(email)){ cadError.textContent = 'Email inválido.'; return; }
  if(senha.length < 6){ cadError.textContent = 'Senha deve ter no mínimo 6 caracteres.'; return; }

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  if(usuarios.some(u => u.email===email)){ cadError.textContent = 'Este email já está cadastrado.'; return; }

  usuarios.push({nome,email,senha});
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  alert('Cadastro realizado com sucesso! Agora faça login.');

  showLogin();
  formCadastro.reset();
});

formLogin.addEventListener('submit', e => {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const senha = document.getElementById('loginSenha').value;

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.email===email && u.senha===senha);

  if(usuario){
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    showUserSection(usuario);
  } else { loginError.textContent='Email ou senha incorretos.'; }
});

function showUserSection(usuario){
  authSection.classList.add('hidden');
  userSection.classList.remove('hidden');
  userNameSpan.textContent = usuario.nome;
}

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('usuarioLogado');
  userSection.classList.add('hidden');
  authSection.classList.remove('hidden');
  showLogin();
  formLogin.reset();
  formCadastro.reset();
});

window.addEventListener('load', () => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  if(usuarioLogado){ showUserSection(usuarioLogado); }
  else { showLogin(); }
});
