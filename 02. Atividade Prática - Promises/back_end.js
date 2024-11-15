const button = document.getElementById('consultarButton');
const cepInput = document.getElementById('cepInput');
const resultado = document.getElementById('resultado');
const mensagemErro = document.getElementById('mensagemErro');
const cep = document.getElementById('cep');
const logradouro = document.getElementById('logradouro');
const bairro = document.getElementById('bairro');
const cidade = document.getElementById('cidade');
const uf = document.getElementById('uf');

cepInput.addEventListener('input', function () {
    let valor = cepInput.value;
    valor = valor.replace(/\D/g, ''); 
    if (valor.length > 5) { 
        valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }
    cepInput.value = valor;
});


button.addEventListener('click', async () => {
    const cepValue = cepInput.value.replace(/\D/g, '');


    if (cepValue.length !== 8) {
        mensagemErro.innerText = 'CEP INVÁLIDO! Digite um CEP válido com 8 dígitos.';
        resultado.style.display = 'none';
        return;
    }

    try {

        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }


        cep.innerText = data.cep;
        logradouro.innerText = data.logradouro;
        bairro.innerText = data.bairro;
        cidade.innerText = data.localidade;
        uf.innerText = data.uf;


        resultado.style.display = 'block';
        mensagemErro.innerText = ''; 
    } catch (error) {

        mensagemErro.innerText = 'Erro ao consultar o CEP. Tente novamente.';
        resultado.style.display = 'none';
    }
});
