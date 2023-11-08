
// ---------------GERADOR DE SENHA------------------------------------------------------------------------------

// Seleção de Elementos
const generatePasswordButton = document.querySelector("#generate-password");
const generatedPasswordElement = document.querySelector("#generated-password");

const openCloseGeneratorButton = document.querySelector(
    "#open-generate-password"
);
const generatePasswordContainer = document.querySelector("#generate-options");
const lengthInput = document.querySelector("#length");
const lettersInput = document.querySelector("#letters");
const numbersInput = document.querySelector("#numbers");
const symbolsInput = document.querySelector("#symbols");
const copyPasswordButton = document.querySelector("#copy-password");


// Função para obter uma letra minúscula aleatória
const getLetterLowerCase = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
};

// Função para obter uma letra maiúscula aleatória
const getLetterUpperCase = () => {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
};

// Função para obter um número aleatório
const getNumber = () => {
    return Math.floor(Math.random() * 10).toString();
};

// Função para obter um símbolo aleatório
const getSymbol = () => {
    const symbols = "(){}[]=<>/,.!@#$%&*+-";
    return symbols[Math.floor(Math.random() * symbols.length)];
};

// Função para gerar uma senha com base nas opções escolhidas pelo usuário
const generatePassword = (
    getLetterLowerCase,
    getLetterUpperCase,
    getNumber,
    getSymbol,
    callback
) => {
    let password = "";

    // Obter o comprimento da senha a partir do valor do input de comprimento
    const passwordLength = +lengthInput.value;
    const generators = [];

    // Verificar se as opções de letras, números e símbolos estão marcadas e incluí-las na geração da senha
    if (lettersInput.checked) {
        generators.push(getLetterLowerCase, getLetterUpperCase);
    }

    if (numbersInput.checked) {
        generators.push(getNumber);
    }

    if (symbolsInput.checked) {
        generators.push(getSymbol);
    }

    // Se nenhuma opção estiver selecionada, encerre a função
    if (generators.length === 0) {
        callback('Selecione pelo menos uma opção para gerar senha.');
        return;
    }

    // Gere a senha com base nas opções escolhidas
    for (i = 0; i < passwordLength; i = i + generators.length) {
        generators.forEach(() => {
            const randomValue =
                generators[Math.floor(Math.random() * generators.length)]();

            password += randomValue;
        });
    }

    // Limite a senha ao comprimento especificado
    password = password.slice(0, passwordLength);

    // Exiba a senha gerada na interface do usuário
    generatedPasswordElement.style.display = "block";
    generatedPasswordElement.querySelector("h4").innerText = password;
    callback(null, password);
};


// Adicione um ouvinte de eventos ao botão "Gerar Senha"
generatePasswordButton.addEventListener("click", () => {
    generatePassword(
        getLetterLowerCase,
        getLetterUpperCase,
        getNumber,
        getSymbol, (error, password) => {
            if (error) {
                alert("Selecione pelo menos uma opção para gerar senha.");
            }
        });
});

// Adicione um ouvinte de eventos ao botão "Abrir/Fechar Gerador de Senha"
openCloseGeneratorButton.addEventListener("click", () => {
    generatePasswordContainer.classList.toggle("hide");
});

// Adicione um ouvinte de eventos ao botão "Copiar Senha"
copyPasswordButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Obtenha a senha gerada e copie para a área de transferência
    const password = generatedPasswordElement.querySelector("h4").innerText;

    navigator.clipboard.writeText(password).then(() => {
        copyPasswordButton.innerText = "Senha copiada com sucesso!";

        // Restaure o texto do botão após um curto período de tempo
        setTimeout(() => {
            copyPasswordButton.innerText = "Copiar";
        }, 1000);
    });
});

