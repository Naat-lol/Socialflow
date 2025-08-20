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
  loginError.textContent=''; 
  cadError.textContent=''; 
}

function validateEmail(email){ 
  return /\S+@\S+\.\S+/.test(email); 
}

toCadastroBtn.addEventListener('click', showCadastro);
toLoginBtn.addEventListener('click', showLogin);

formCadastro.addEventListener('submit', e => {
  e.preventDefault(); 
  clearErrors();
  
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = document.getElementById('cadSenha').value;
  
  if (!nome) {
    cadError.textContent = 'Por favor, informe seu nome';
    return;
  }
  
  if (!validateEmail(email)) {
    cadError.textContent = 'Por favor, informe um email válido';
    return;
  }
  
  if (senha.length < 6) {
    cadError.textContent = 'A senha deve ter pelo menos 6 caracteres';
    return;
  }
  
  // Simulando cadastro bem-sucedido
  localStorage.setItem('user', JSON.stringify({ nome, email, senha }));
  
  // Mostrar mensagem de sucesso
  cadError.style.color = 'green';
  cadError.textContent = 'Cadastro realizado com sucesso!';
  
  // Limpar formulário
  document.getElementById('cadNome').value = '';
  document.getElementById('cadEmail').value = '';
  document.getElementById('cadSenha').value = '';
  
  // Mudar para tela de login após 2 segundos
  setTimeout(() => {
    cadError.style.color = '#d32f2f';
    showLogin();
  }, 2000);
});

formLogin.addEventListener('submit', e => {
  e.preventDefault(); 
  clearErrors();
  
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  
  if (!validateEmail(email)) {
    loginError.textContent = 'Por favor, informe um email válido';
    return;
  }
  
  // Verificar se usuário existe
  const userData = localStorage.getItem('user');
  
  if (!userData) {
    loginError.textContent = 'Nenhuma conta encontrada. Cadastre-se primeiro.';
    return;
  }
  
  const user = JSON.parse(userData);
  
  if (user.email !== email || user.senha !== senha) {
    loginError.textContent = 'Email ou senha incorretos';
    return;
  }
  
  // Login bem-sucedido
  authSection.classList.add('hidden');
  userSection.classList.remove('hidden');
  userNameSpan.textContent = user.nome;
  
  // Limpar formulário
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginSenha').value = '';
});

btnLogout.addEventListener('click', () => {
  userSection.classList.add('hidden');
  authSection.classList.remove('hidden');
  showLogin();
});

// Verificar se usuário já está logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('user');
  
  if (userData) {
    const user = JSON.parse(userData);
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userNameSpan.textContent = user.nome;
  } else {
    showLogin();
  }
});
