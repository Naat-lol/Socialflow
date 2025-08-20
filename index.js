// -----------------------
// AUTENTICAÇÃO
// -----------------------
const formLogin = document.getElementById('formLogin');
const formCadastro = document.getElementById('formCadastro');
const loginError = document.getElementById('loginError');
const cadError = document.getElementById('cadError');
const confirmError = document.getElementById('confirmError');
const toCadastroBtn = document.getElementById('toCadastro');
const toLoginBtn = document.getElementById('toLogin');

const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const userNameSpan = document.getElementById('userName');
const btnLogout = document.getElementById('btnLogout');

// Elementos para validação de senha
const cadSenha = document.getElementById('cadSenha');
const cadConfirmarSenha = document.getElementById('cadConfirmarSenha');
const reqLength = document.getElementById('req-length');
const reqNumber = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

function showLogin() { 
  formLogin.classList.remove('hidden'); 
  formCadastro.classList.add('hidden'); 
  clearErrors(); 
  resetPasswordValidation();
}

function showCadastro() { 
  formCadastro.classList.remove('hidden'); 
  formLogin.classList.add('hidden'); 
  clearErrors(); 
  resetPasswordValidation();
}

function clearErrors() { 
  loginError.textContent = ''; 
  cadError.textContent = ''; 
  confirmError.textContent = '';
}

function resetPasswordValidation() {
  // Resetar validações visuais
  reqLength.classList.remove('valid', 'invalid');
  reqNumber.classList.remove('valid', 'invalid');
  reqSpecial.classList.remove('valid', 'invalid');
  
  // Limpar campos
  cadSenha.value = '';
  cadConfirmarSenha.value = '';
  cadSenha.classList.remove('invalid');
  cadConfirmarSenha.classList.remove('invalid');
}

function validateEmail(email){ 
  return /\S+@\S+\.\S+/.test(email); 
}

// Funções de validação de senha
function validatePassword(password) {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Atualizar visualmente os requisitos
  reqLength.classList.toggle('valid', hasMinLength);
  reqLength.classList.toggle('invalid', !hasMinLength);
  
  reqNumber.classList.toggle('valid', hasNumber);
  reqNumber.classList.toggle('invalid', !hasNumber);
  
  reqSpecial.classList.toggle('valid', hasSpecial);
  reqSpecial.classList.toggle('invalid', !hasSpecial);
  
  return hasMinLength && hasNumber && hasSpecial;
}

function validatePasswordConfirmation(password, confirmation) {
  return password === confirmation;
}

// Efeito visual para campo inválido
function showFieldError(field, message) {
  field.classList.add('invalid');
  
  // Remover a classe após a animação
  setTimeout(() => {
    field.classList.remove('invalid');
  }, 2000);
  
  return message;
}

toCadastroBtn.addEventListener('click', showCadastro);
toLoginBtn.addEventListener('click', showLogin);

// Ouvinte de eventos para validação em tempo real da senha
cadSenha.addEventListener('input', () => {
  validatePassword(cadSenha.value);
});

formCadastro.addEventListener('submit', e => {
  e.preventDefault(); 
  clearErrors();
  
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = cadSenha.value;
  const confirmarSenha = cadConfirmarSenha.value;
  
  let isValid = true;
  let errorMessage = '';
  
  // Validar nome
  if (!nome) {
    errorMessage = 'Por favor, informe seu nome';
    showFieldError(document.getElementById('cadNome'), errorMessage);
    isValid = false;
  }
  
  // Validar email
  if (!validateEmail(email)) {
    errorMessage = 'Por favor, informe um email válido';
    showFieldError(document.getElementById('cadEmail'), errorMessage);
    isValid = false;
  }
  
  // Validar senha
  if (!validatePassword(senha)) {
    errorMessage = 'A senha não atende a todos os requisitos';
    cadError.textContent = errorMessage;
    showFieldError(cadSenha, errorMessage);
    isValid = false;
  }
  
  // Validar confirmação de senha
  if (!validatePasswordConfirmation(senha, confirmarSenha)) {
    errorMessage = 'As senhas não coincidem';
    confirmError.textContent = errorMessage;
    showFieldError(cadConfirmarSenha, errorMessage);
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Simulando cadastro bem-sucedido
  localStorage.setItem('user', JSON.stringify({ nome, email, senha }));
  
  // Mostrar mensagem de sucesso
  cadError.style.color = 'green';
  cadError.textContent = 'Cadastro realizado com sucesso!';
  
  // Limpar formulário
  document.getElementById('cadNome').value = '';
  document.getElementById('cadEmail').value = '';
  cadSenha.value = '';
  cadConfirmarSenha.value = '';
  resetPasswordValidation();
  
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
    showFieldError(document.getElementById('loginEmail'), 'Email inválido');
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
    showFieldError(document.getElementById('loginSenha'), 'Credenciais inválidas');
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
