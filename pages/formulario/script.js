// Máscara do CPF e do CEP
const masks = {
  cpf(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})(\d+?$)/, '$1')
  },
  cep(value) {
    return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})(\d+?$)/, '$1')
  }
}

// Validação do CEP
const cep = document.getElementById('cep');
const address = document.getElementById('address');
cep.addEventListener('input', async (e) => {
  e.target.value = masks["cep"](e.target.value);
  var validarCep = cep.value.replaceAll('.', '').replace('-', '');
  if(validarCep.length == 8){
    var cepValido = await buscaCEP(validarCep);
    console.log(cepValido);
    
    if (!cepValido) {
      cep.classList.add("errorInput");
      return;
    } else {
      cep.classList.remove("errorInput");
    }
    address.value = cepValido.logradouro;

  }
}, false)


// Utilização de fetch para consumir API de CEP
async function buscaCEP(cep) {
  let busca = cep.replace('-', '');
  const option = {
      method: 'get',
      mode: 'cors',
      cache: 'default'
  }
  const response = await fetch(`https://viacep.com.br/ws/${busca}/json/`, option);

    const cepInfo = await response.json();
    if(cepInfo.erro){
      return false;
    }

    return cepInfo;
}

// Validação do CPF
const cpf = document.getElementById('cpf');
cpf.addEventListener('input', (e) => {
    e.target.value = masks["cpf"](e.target.value);
    var validarCpf = cpf.value.replaceAll('.', '').replace('-', '');
    if(validarCpf.length == 11){
      var cpfValido = TestaCPF(validarCpf);
      
      if (!cpfValido) {
        cpf.classList.add("errorInput");
      } else {
        cpf.classList.remove("errorInput");
      }
    }
  }, false)

function TestaCPF(validarCpf) {
  var Soma;
  var Resto;
  Soma = 0;
  if (validarCpf == "00000000000") return false;

  for (i = 1; i <= 9; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(validarCpf.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if ((Resto == 10) || (Resto == 11)) Resto = 0;
  if (Resto != parseInt(validarCpf.substring(10, 11))) return false;
  return true;
}

// Seleção de Elementos
const generatePasswordButton = document.querySelector("#generate-password");
const generatedPasswordElement = document.querySelector("#generated-password");

// Novas funcionalidades
const openCloseGeneratorButton = document.querySelector(
  "#open-generate-password"
);
const generatePasswordContainer = document.querySelector("#generate-options");
const lengthInput = document.querySelector("#length");
const lettersInput = document.querySelector("#letters");
const numbersInput = document.querySelector("#numbers");
const symbolsInput = document.querySelector("#symbols");
const copyPasswordButton = document.querySelector("#copy-password");

// Funções
const getLetterLowerCase = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
};

const getLetterUpperCase = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
};

const getNumber = () => {
  return Math.floor(Math.random() * 10).toString();
};

const getSymbol = () => {
  const symbols = "(){}[]=<>/,.!@#$%&*+-";
  return symbols[Math.floor(Math.random() * symbols.length)];
};

const generatePassword = (
  getLetterLowerCase,
  getLetterUpperCase,
  getNumber,
  getSymbol
) => {
  let password = "";

  //   Segunda versão
  const passwordLength = +lengthInput.value;

  const generators = [];

  if (lettersInput.checked) {
    generators.push(getLetterLowerCase, getLetterUpperCase);
  }

  if (numbersInput.checked) {
    generators.push(getNumber);
  }

  if (symbolsInput.checked) {
    generators.push(getSymbol);
  }

  console.log(generators.length);

  if (generators.length === 0) {
    return;
  }

  for (i = 0; i < passwordLength; i = i + generators.length) {
    generators.forEach(() => {
      const randomValue =
        generators[Math.floor(Math.random() * generators.length)]();

      password += randomValue;
    });
  }

  password = password.slice(0, passwordLength);

  generatedPasswordElement.style.display = "block";
  generatedPasswordElement.querySelector("h4").innerText = password;
};

// Eventos
generatePasswordButton.addEventListener("click", () => {
  generatePassword(
    getLetterLowerCase,
    getLetterUpperCase,
    getNumber,
    getSymbol
  );
});

openCloseGeneratorButton.addEventListener("click", () => {
  generatePasswordContainer.classList.toggle("hide");
});

copyPasswordButton.addEventListener("click", (e) => {
  e.preventDefault();

  const password = generatedPasswordElement.querySelector("h4").innerText;

  navigator.clipboard.writeText(password).then(() => {
    copyPasswordButton.innerText = "Senha copiada com sucesso!";

    setTimeout(() => {
      copyPasswordButton.innerText = "Copiar";
    }, 1000);
  });
});
