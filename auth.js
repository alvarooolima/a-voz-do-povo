const USERS_KEY = 'avozdopovo_users';
const SESSION_KEY = 'avozdopovo_session';

// ---------- Máscaras ----------
function maskCPF(value){
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}
function maskPhone(value){
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if(digits.length <= 10){
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}
function isValidCPF(cpfRaw){
  const cpf = cpfRaw.replace(/\D/g, '');
  if(cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for(let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let rev = (sum * 10) % 11;
  if(rev === 10 || rev === 11) rev = 0;
  if(rev !== parseInt(cpf[9])) return false;
  sum = 0;
  for(let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  rev = (sum * 10) % 11;
  if(rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf[10]);
}
function isValidPhone(phoneRaw){
  const digits = phoneRaw.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}
function isValidEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function attachMask(input, maskFn){
  if(!input) return;
  input.addEventListener('input', () => {
    input.value = maskFn(input.value);
  });
}

// ---------- Usuários (demo local) ----------
function loadUsers(){
  try{ return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }catch(e){ return []; }
}
function saveUsers(list){
  try{ localStorage.setItem(USERS_KEY, JSON.stringify(list)); }catch(e){}
}

// ---------- Alternância de abas ----------
function showLogin(){
  document.getElementById('loginForm').hidden = false;
  document.getElementById('registerForm').hidden = true;
  document.getElementById('forgotPanel').hidden = true;
  document.getElementById('tabLogin').classList.add('is-active');
  document.getElementById('tabRegister').classList.remove('is-active');
  document.getElementById('tabLogin').setAttribute('aria-selected', 'true');
  document.getElementById('tabRegister').setAttribute('aria-selected', 'false');
}
function showRegister(){
  document.getElementById('loginForm').hidden = true;
  document.getElementById('registerForm').hidden = false;
  document.getElementById('forgotPanel').hidden = true;
  document.getElementById('tabLogin').classList.remove('is-active');
  document.getElementById('tabRegister').classList.add('is-active');
  document.getElementById('tabLogin').setAttribute('aria-selected', 'false');
  document.getElementById('tabRegister').setAttribute('aria-selected', 'true');
}
function showForgot(){
  document.getElementById('loginForm').hidden = true;
  document.getElementById('registerForm').hidden = true;
  document.getElementById('forgotPanel').hidden = false;
}

function setMsg(el, text, isError){
  el.textContent = text;
  el.classList.toggle('is-error', !!isError);
}

document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.getElementById('tabLogin').addEventListener('click', showLogin);
  document.getElementById('tabRegister').addEventListener('click', showRegister);
  document.getElementById('goRegister').addEventListener('click', showRegister);
  document.getElementById('goLogin').addEventListener('click', showLogin);

  if(window.location.hash === '#criar-conta') showRegister();

  // Esqueci a senha
  document.getElementById('forgotLink').addEventListener('click', showForgot);
  document.getElementById('forgotBack').addEventListener('click', showLogin);

  // Máscaras
  attachMask(document.getElementById('loginCpf'), maskCPF);
  attachMask(document.getElementById('loginTelefone'), maskPhone);
  attachMask(document.getElementById('regCpf'), maskCPF);
  attachMask(document.getElementById('regTelefone'), maskPhone);

  // Mostrar/ocultar senha
  document.querySelectorAll('.pw-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if(!target) return;
      const isPw = target.type === 'password';
      target.type = isPw ? 'text' : 'password';
      btn.textContent = isPw ? '🙈' : '👁';
    });
  });

  // ---------- Login ----------
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('loginMsg');
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    const cpf = document.getElementById('loginCpf').value.trim();
    const telefone = document.getElementById('loginTelefone').value.trim();

    if(!isValidEmail(email)){ setMsg(msg, 'Informe um e-mail válido.', true); return; }
    if(senha.length < 6){ setMsg(msg, 'A senha deve ter pelo menos 6 caracteres.', true); return; }
    if(!isValidCPF(cpf)){ setMsg(msg, 'Informe um CPF válido.', true); return; }
    if(!isValidPhone(telefone)){ setMsg(msg, 'Informe um telefone válido, com DDD.', true); return; }

    // Demo: aceita qualquer combinação válida (não há backend real conectado)
    const session = { nome: email.split('@')[0], email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setMsg(msg, 'Login realizado! Redirecionando...', false);
    setTimeout(() => { window.location.href = 'index.html'; }, 700);
  });

  // ---------- Cadastro ----------
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('registerMsg');
    const nome = document.getElementById('regNome').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const senha = document.getElementById('regSenha').value;
    const senha2 = document.getElementById('regSenha2').value;
    const cpf = document.getElementById('regCpf').value.trim();
    const telefone = document.getElementById('regTelefone').value.trim();
    const termos = document.getElementById('regTermos').checked;

    if(nome.length < 3){ setMsg(msg, 'Informe seu nome completo.', true); return; }
    if(!isValidEmail(email)){ setMsg(msg, 'Informe um e-mail válido.', true); return; }
    if(senha.length < 6){ setMsg(msg, 'A senha deve ter pelo menos 6 caracteres.', true); return; }
    if(senha !== senha2){ setMsg(msg, 'As senhas não coincidem.', true); return; }
    if(!isValidCPF(cpf)){ setMsg(msg, 'Informe um CPF válido.', true); return; }
    if(!isValidPhone(telefone)){ setMsg(msg, 'Informe um telefone válido, com DDD.', true); return; }
    if(!termos){ setMsg(msg, 'É preciso aceitar os termos de uso.', true); return; }

    const users = loadUsers();
    if(users.some(u => u.email === email)){
      setMsg(msg, 'Já existe uma conta com esse e-mail.', true);
      return;
    }
    users.push({ nome, email, cpf, telefone });
    saveUsers(users);

    const session = { nome, email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setMsg(msg, 'Conta criada com sucesso! Redirecionando...', false);
    setTimeout(() => { window.location.href = 'index.html'; }, 700);
  });

  // ---------- Esqueci a senha ----------
  document.getElementById('forgotForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('forgotMsg');
    const email = document.getElementById('forgotEmail').value.trim();
    if(!isValidEmail(email)){ setMsg(msg, 'Informe um e-mail válido.', true); return; }
    setMsg(msg, 'Se esse e-mail estiver cadastrado, enviamos um link de recuperação.', false);
    document.getElementById('forgotForm').reset();
  });
});
