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

// Função para mostrar login
function showLogin() { 
  formLogin.classList.remove('hidden'); 
  formCadastro.classList.add('hidden'); 
  clearErrors(); 
  resetPasswordValidation();
}

// Função para mostrar cadastro
function showCadastro() { 
  formCadastro.classList.remove('hidden'); 
  formLogin.classList.add('hidden'); 
  clearErrors(); 
  resetPasswordValidation();
}

// Limpar mensagens de erro
function clearErrors() { 
  hideError(loginError);
  hideError(cadError);
  hideError(confirmError);
  
  // Limpar erros dos campos
  document.querySelectorAll('input').forEach(input => {
    input.classList.remove('invalid');
  });
}

// Mostrar erro com animação
function showError(element, message) {
  element.textContent = message;
  element.classList.add('show');
}

// Esconder erro com animação
function hideError(element) {
  element.textContent = '';
  element.classList.remove('show');
}

// Resetar validação de senha
function resetPasswordValidation() {
  reqLength.classList.remove('valid', 'invalid');
  reqNumber.classList.remove('valid', 'invalid');
  reqSpecial.classList.remove('valid', 'invalid');
  
  cadSenha.value = '';
  cadConfirmarSenha.value = '';
  cadSenha.classList.remove('invalid');
  cadConfirmarSenha.classList.remove('invalid');
}

// Validar email
function validateEmail(email){ 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
}

// Validar força da senha
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

// Validar confirmação de senha
function validatePasswordConfirmation(password, confirmation) {
  const isValid = password === confirmation && password !== '';
  
  // Esconder mensagem de erro se as senhas coincidirem
  if (isValid) {
    hideError(confirmError);
    cadConfirmarSenha.classList.remove('invalid');
  }
  
  return isValid;
}

// Efeito visual para campo inválido
function showFieldError(field, errorElement, message) {
  field.classList.add('invalid');
  showError(errorElement, message);
  
  // Focar no campo com erro
  field.focus();
}

// Verificar se usuário existe
function userExists(email) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.some(user => user.email === email);
}

// Adicionar novo usuário
function addUser(user) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));
}

// Verificar credenciais de login
function validateLogin(email, password) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find(user => user.email === email && user.senha === password);
}

// Event listeners para alternar entre formulários
toCadastroBtn.addEventListener('click', showCadastro);
toLoginBtn.addEventListener('click', showLogin);

// Validação em tempo real da senha
cadSenha.addEventListener('input', () => {
  validatePassword(cadSenha.value);
  
  // Validar confirmação em tempo real também
  if (cadConfirmarSenha.value) {
    validatePasswordConfirmation(cadSenha.value, cadConfirmarSenha.value);
  }
});

// Validação em tempo real da confirmação de senha
cadConfirmarSenha.addEventListener('input', () => {
  validatePasswordConfirmation(cadSenha.value, cadConfirmarSenha.value);
});

// Submissão do formulário de cadastro
formCadastro.addEventListener('submit', e => {
  e.preventDefault(); 
  clearErrors();
  
  const nome = document.getElementById('cadNome').value.trim();
  const email = document.getElementById('cadEmail').value.trim();
  const senha = cadSenha.value;
  const confirmarSenha = cadConfirmarSenha.value;
  
  let isValid = true;
  
  // Validar nome
  if (!nome) {
    showFieldError(document.getElementById('cadNome'), cadError, 'Por favor, informe seu nome completo');
    isValid = false;
  }
  
  // Validar email
  if (!email) {
    showFieldError(document.getElementById('cadEmail'), cadError, 'Por favor, informe seu email');
    isValid = false;
  } else if (!validateEmail(email)) {
    showFieldError(document.getElementById('cadEmail'), cadError, 'Por favor, informe um email válido');
    isValid = false;
  } else if (userExists(email)) {
    showFieldError(document.getElementById('cadEmail'), cadError, 'Este email já está cadastrado');
    isValid = false;
  }
  
  // Validar senha
  if (!senha) {
    showFieldError(cadSenha, cadError, 'Por favor, crie uma senha');
    isValid = false;
  } else if (!validatePassword(senha)) {
    showError(cadError, 'A senha não atende a todos os requisitos');
    cadSenha.classList.add('invalid');
    isValid = false;
  }
  
  // Validar confirmação de senha
  if (!confirmarSenha) {
    showFieldError(cadConfirmarSenha, confirmError, 'Por favor, confirme sua senha');
    isValid = false;
  } else if (!validatePasswordConfirmation(senha, confirmarSenha)) {
    showError(confirmError, 'As senhas não coincidem');
    cadConfirmarSenha.classList.add('invalid');
    isValid = false;
  }
  
  if (!isValid) return;
  
  // Cadastro bem-sucedido
  addUser({ nome, email, senha });
  
  // Mostrar mensagem de sucesso
  cadError.style.color = '#4caf50';
  showError(cadError, 'Cadastro realizado com sucesso!');
  
  // Limpar formulário
  document.getElementById('cadNome').value = '';
  document.getElementById('cadEmail').value = '';
  cadSenha.value = '';
  cadConfirmarSenha.value = '';
  resetPasswordValidation();
  
  // Mudar para tela de boas-vindas após 2 segundos
  setTimeout(() => {
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userNameSpan.textContent = nome;
    hideError(cadError);
  }, 2000);
});

// Submissão do formulário de login
formLogin.addEventListener('submit', e => {
  e.preventDefault(); 
  clearErrors();
  
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  
  // Validar email
  if (!email) {
    showFieldError(document.getElementById('loginEmail'), loginError, 'Por favor, informe seu email');
    return;
  }
  
  if (!validateEmail(email)) {
    showFieldError(document.getElementById('loginEmail'), loginError, 'Por favor, informe um email válido');
    return;
  }
  
  // Validar senha
  if (!senha) {
    showFieldError(document.getElementById('loginSenha'), loginError, 'Por favor, informe sua senha');
    return;
  }
  
  // Verificar credenciais
  const user = validateLogin(email, senha);
  
  if (!user) {
    showError(loginError, 'Email ou senha incorretos');
    document.getElementById('loginSenha').classList.add('invalid');
    return;
  }
  
  // Login bem-sucedido
  localStorage.setItem('currentUser', JSON.stringify(user));
  authSection.classList.add('hidden');
  userSection.classList.remove('hidden');
  userNameSpan.textContent = user.nome;
  
  // Limpar formulário
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginSenha').value = '';
});

// Logout
btnLogout.addEventListener('click', () => {
  localStorage.removeItem('currentUser');
  userSection.classList.add('hidden');
  authSection.classList.remove('hidden');
  showLogin();
});

// Verificar se usuário já está logado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('currentUser');
  
  if (userData) {
    const user = JSON.parse(userData);
    authSection.classList.add('hidden');
    userSection.classList.remove('hidden');
    userNameSpan.textContent = user.nome;
  } else {
    showLogin();
  }
});
