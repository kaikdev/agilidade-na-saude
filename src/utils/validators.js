export const validateCPF = (cpf) => {
    const cpfLimpo = String(cpf).replace(/\D/g, '');

    if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
        return false;
    }

    let soma = 0;
    let resto;

    // Cálculo do primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) {
        return false;
    }

    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
        resto = 0;
    }
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) {
        return false;
    }

    return true;
};

export const validateBirthDate = (dateString) => {
    if (!dateString) return true;

    const hoje = new Date();
    const dataNascimento = new Date(dateString);

    hoje.setHours(0, 0, 0, 0);

    dataNascimento.setMinutes(dataNascimento.getMinutes() + dataNascimento.getTimezoneOffset());

    return dataNascimento <= hoje;
};