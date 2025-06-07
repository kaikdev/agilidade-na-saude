export const formatCPF = (cpf) => {
    const cpfDigits = String(cpf).replace(/\D/g, '');

    if (cpfDigits.length !== 11) {
        return cpf;
    }

    return cpfDigits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};