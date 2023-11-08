
// ---------------MASCARA DO CPF E CEP------------------------------------------------------------------------------
const masks = {
  cpf(value) {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os primeiros 3 dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os próximos 3 dígitos
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Adiciona hífen e os últimos dígitos
      .replace(/(-\d{2})(\d+?$)/, '$1') // Remove caracteres após os últimos 2 dígitos
  },
  cep(value) {
    return value
      .replace(/\D/g, '') // Remove caracteres não numéricos
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona hífen após os primeiros 5 dígitos
      .replace(/(-\d{3})(\d+?$)/, '$1') // Remove caracteres após os últimos 3 dígitos
  }
}


// ---------------VALIDAÇÃO DOS CEP------------------------------------------------------------------------------
const cep = document.getElementById('cep');
const address = document.getElementById('address');
const msgError = document.querySelector('#cepError');

cep.addEventListener('input', async (e) => {
  e.target.value = masks["cep"](e.target.value); // Aplica a máscara de CEP
  var validarCep = cep.value.replaceAll('.', '').replace('-', ''); // Remove caracteres especiais
  if (validarCep.length == 8) { // Se o CEP tiver 8 dígitos...
    var cepValido = await buscaCEP(validarCep); // Busca informações de endereço com base no CEP

    if (!cepValido) {
      msgError.innerHTML = '*Insira um CEP válido';
      cep.classList.add("errorInput");
      return;
    } else {
      msgError.innerHTML = '';
      cep.classList.remove("errorInput");
    }
    address.value = cepValido.logradouro + ', ' + cepValido.bairro + ', ' + cepValido.localidade + ' - ' + cepValido.uf; // Preenche os campos de endereço
  }
}, false)



// ---------------UTILIZAÇÃO DO FETCH PARA CONSUMIR A API DA VIACEP--------------------------------------------------
async function buscaCEP(cep) {
  let busca = cep.replace('-', '');
  const option = {
    method: 'get',
    mode: 'cors',
    cache: 'default'
  }
  const response = await fetch(`https://viacep.com.br/ws/${busca}/json/`, option);

  const cepInfo = await response.json();
  if (cepInfo.erro) {
    return false;
  }

  return cepInfo;
}



// ---------------VERIFICAÇÃO NÚMERICA DO CPF------------------------------------------------------------------------------
function TestaCPF(validarCpf) {
  var Soma;
  var Resto;
  Soma = 0;
  if (validarCpf == "00000000000") return false; // CPF com todos os dígitos iguais é inválido

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(validarCpf.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(validarCpf.substring(10, 11))) return false;

  return true; // Se a validação for bem-sucedida, o CPF é considerado válido
}



// ---------------VALIDAÇÃO DO CPF------------------------------------------------------------------------------
const cpf = document.getElementById('cpf');

cpf.addEventListener('input', (e) => {
  const msgError = document.querySelector('#cpfError');
  e.target.value = masks["cpf"](e.target.value); // Aplica a máscara de CPF
  var validarCpf = cpf.value.replaceAll('.', '').replace('-', ''); // Remove caracteres especiais
  if (validarCpf.length == 11) { // Se o CPF tiver 11 dígitos...
    var cpfValido = TestaCPF(validarCpf); // Realiza a validação do CPF

    if (!cpfValido) {
      msgError.innerHTML = '*Insira um CPF válido';
      cpf.classList.add("errorInput");
    } else {
      msgError.innerHTML = '';
      cpf.classList.remove("errorInput");
    }
  }
}, false)



// ---------------VALIDAÇÃO DOS CAMPOS------------------------------------------------------------------------------
class FormCampo { // Classe base para campos do formulário
  constructor(inputId) {
    this.input = document.querySelector(`#${inputId}`);
  }

  // Verifica se o campo está vazio
  isEmpty() {
    return this.input.value.trim() === '';
  }

  // Define o estado de erro do campo
  setErrorState(hasError) {
    if (hasError) {
      this.input.classList.add("errorInput");
      this.input.classList.add('red-placeholder');
    } else {
      this.input.classList.remove("errorInput");
      this.input.classList.remove('red-placeholder');
    }
  }
}

// Classes derivadas para tipos de campos específicos
class TextCampo extends FormCampo { }
class DateCampo extends FormCampo { }
class CpfCampo extends FormCampo { }
class EmailCampo extends FormCampo { }
class CepCampo extends FormCampo { }
class AddressCampo extends FormCampo { }
class PasswordCampo extends FormCampo { }


// Função para validar o preenchimento dos campos
function enviar() {
  // Cria uma lista de objetos representando os campos do formulário
  const campos = [
    new TextCampo('name'),
    new CpfCampo('cpf'),
    new DateCampo('date'),
    new EmailCampo('email'),
    new CepCampo('cep'),
    new AddressCampo('address'),
    new PasswordCampo('password'),
  ];

  // Elemento para exibir mensagens de erro
  let hasErrors = false;

  // Itera sobre os campos para verificar se estão preenchidos
  campos.forEach((campo) => {
    if (campo.isEmpty()) {
      campo.setErrorState(true);
      hasErrors = true;
    } else {
      campo.setErrorState(false);
    }
  });

  // Evita o alert e o "envio" do cadastro
  if (hasErrors) {
    campos[0].input.focus();
  } else {
    // Exibe uma mensagem de sucesso se todos os campos estiverem preenchidos
    alert('Cadastro feito com sucesso!');
  }
}


