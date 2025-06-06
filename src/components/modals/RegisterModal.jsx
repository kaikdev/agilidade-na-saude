import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';
import Swal from 'sweetalert2';
import usePasswordToggle from '../../hooks/usePasswordToggle';

function RegisterModal() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [cadastroNome, setCadastroNome] = useState('');
    const [cadastroEmail, setCadastroEmail] = useState('');
    const [cadastroCpf, setCadastroCpf] = useState('');
    const [cadastroData, setCadastroData] = useState('');
    const [cadastroSenha, setCadastroSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [selectedRole, setSelectedRole] = useState('user');

    // Campos para Médico (Admin)
    const [crm, setCrm] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [presentation, setPresentation] = useState('');

    // Campos Imagem
    const [imageFile, setImageFile] = useState(null);
    const imageInputRef = useRef(null);

    // Loading
    const [cadastroLoading, setCadastroLoading] = useState(false);

    const [showPasswordStates, togglePasswordVisibility] = usePasswordToggle({
        cadastroSenha: false,
        confirmarSenha: false,
    });

    useEffect(() => {
        setImageFile(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = null;
        }
    }, [selectedRole]);

    const formatBirthDateForAPI = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleCpfChange = (e) => {
        let value = e.target.value;

        value = value.replace(/\D/g, '');
        value = value.substring(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        setCadastroCpf(value);
    };

    const isValidCpf = (cpf) => {
        const cpfDigits = cpf.replace(/\D/g, '');
        return cpfDigits.length === 11;
    };

    const handleCadastroSubmit = async (e) => {
        e.preventDefault();

        setCadastroLoading(true);

        if (cadastroSenha !== confirmarSenha) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'As senhas não coincidem. Por favor, verifique.',
            });
            setCadastroLoading(false);
            return;
        }

        if (!isValidCpf(cadastroCpf)) {
            Swal.fire({ 
                icon: 'error', 
                title: 'CPF Inválido', 
                text: 'Por favor, insira um CPF válido com 11 dígitos.' 
            });
            setCadastroLoading(false);
            return;
        }

        const cpfParaApi = cadastroCpf.replace(/\D/g, '');

        const formData = new FormData();
        formData.append('name', cadastroNome);
        formData.append('email', cadastroEmail);
        formData.append('cpf', cpfParaApi);
        formData.append('password', cadastroSenha);

        let apiUrl = '';

        if (selectedRole === 'user') { // Cadastro de Paciente
            apiUrl = `${API_BASE_URL}/api/users`;

            formData.append('birth_date', formatBirthDateForAPI(cadastroData));
            formData.append('role', 'user');

            if (!cadastroData || !imageFile) {
                Swal.fire({
                    icon: 'error',
                    title: 'Atenção!',
                    text: 'Data de Nascimento e Foto do Documento são obrigatórios para Pacientes.',
                });
                setCadastroLoading(false);
                return;
            }

            formData.append('documentImage', imageFile); 
        } 
        else if (selectedRole === 'admin') { // Cadastro de Médico (Admin)
            apiUrl = `${API_BASE_URL}/api/admin`;

            if (!crm || !specialty || !presentation || !imageFile) {
                Swal.fire({
                    icon: 'error',
                    title: 'Atenção!',
                    text: 'Todos os campos (CRM, Especialidade, Apresentação e Imagem de Perfil) são obrigatórios para Médicos.',
                });

                setCadastroLoading(false);
                return;
            }

            formData.append('crm', crm);
            formData.append('specialty', specialty);
            formData.append('presentation', presentation);
            formData.append('profileImage', imageFile);
        } 
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Por favor, selecione o tipo de cadastro (Paciente ou Médico).',
            });
            setCadastroLoading(false);
            return;
        }

        try {
            const response = await axios.post(apiUrl, formData);

            Swal.fire({
                icon: 'success',
                title: 'Cadastro Realizado!',
                text: `${selectedRole === 'user' ? 'Paciente' : 'Médico'} cadastrado com sucesso!`,
                confirmButtonText: 'Ok'
            });

            console.log('Cadastro realizado com sucesso:', response.data);

            // Limpar formulário
            setCadastroNome('');
            setCadastroEmail('');
            setCadastroCpf('');
            setCadastroData('');
            setCadastroSenha('');
            setConfirmarSenha('');
            setSelectedRole('user');
            setCrm('');
            setSpecialty('');
            setPresentation('');
            setImageFile(null);
            if (imageInputRef.current) {
                imageInputRef.current.value = null;
            }
        } 
        catch (error) {
            console.error('Erro no cadastro:', error);

            let errorMessage = 'Ocorreu um erro inesperado.';

            if (error.response) {
                errorMessage = error.response.data.error || 'Erro no servidor ao cadastrar.';
            }
            else if (error.request) {
                errorMessage = 'Erro de rede: Servidor não responde. Verifique sua conexão ou tente novamente mais tarde.';
            } 
            
            Swal.fire({
                icon: 'error',
                title: 'Erro no Cadastro!',
                text: errorMessage,
                confirmButtonText: 'Tentar Novamente'
            });
        } 
        finally {
            setCadastroLoading(false);
        }
    };

    const imageInputLabel = selectedRole === 'admin' ? 'Foto de Perfil' : 'Foto do Documento';
    const imageInputId = selectedRole === 'admin' ? 'adminImage' : 'userDocumentImage';

    return (
        /* Modal de Cadastro */
        <div className="modal fade" id="modalCadastro" tabIndex="-1" aria-labelledby="modalCadastroLabel" aria-hidden="true">
            <div className="modal-dialog modal-login modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalCadastroLabel">Cadastro</h6>

                        <form onSubmit={handleCadastroSubmit}>
                            <div className="item-input-user mb-3">
                                <label>Tipo de Cadastro:</label>

                                <div className="btn-group" role="group" aria-label="Tipo de Cadastro">
                                    {/* Botão Paciente */}
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="cadastroTipo"
                                        id="radioPaciente"
                                        value="user"
                                        checked={selectedRole === 'user'}
                                        onChange={() => setSelectedRole('user')}
                                        autoComplete="off"
                                    />
                                    <label className={`btn btn-outline-primary ${selectedRole === 'user' ? 'active' : ''}`} htmlFor="radioPaciente">
                                        Paciente
                                    </label>

                                    {/* Botão Médico */}
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="cadastroTipo"
                                        id="radioMedico"
                                        value="admin"
                                        checked={selectedRole === 'admin'}
                                        onChange={() => setSelectedRole('admin')}
                                        autoComplete="off"
                                    />

                                    <label className={`btn btn-outline-primary ${selectedRole === 'admin' ? 'active' : ''}`} htmlFor="radioMedico">
                                        Médico
                                    </label>
                                </div>
                            </div>

                            {/* Campos Comuns */}
                            <div className="item-input mb-3">
                                <label htmlFor="cadastroNome">Nome</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="cadastroNome"
                                    placeholder="Digite seu nome completo"
                                    value={cadastroNome}
                                    onChange={(e) => setCadastroNome(e.target.value)}
                                    required
                                    disabled={cadastroLoading}
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="cadastroEmail">Email</label>

                                <input
                                    type="email"
                                    className="form-control"
                                    id="cadastroEmail"
                                    placeholder="Digite seu email"
                                    value={cadastroEmail}
                                    onChange={(e) => setCadastroEmail(e.target.value)}
                                    required
                                    disabled={cadastroLoading}
                                />
                            </div>

                            <div className="item-input mb-3">
                                <label htmlFor="cadastroCpf">CPF</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    id="cadastroCpf"
                                    placeholder="000.000.000-00"
                                    value={cadastroCpf}
                                    onChange={handleCpfChange}
                                    required
                                    disabled={cadastroLoading}
                                    maxLength="14"
                                />
                            </div>

                            {/* Campos para Médico (Admin) */}
                            {selectedRole === 'admin' && (
                                <>
                                    <div className="item-input mb-3">
                                        <label htmlFor="crm">CRM</label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            id="crm"
                                            placeholder="Digite seu CRM"
                                            value={crm}
                                            onChange={(e) => setCrm(e.target.value)}
                                            required
                                            disabled={cadastroLoading}
                                        />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label htmlFor="specialty">Especialidade</label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            id="specialty"
                                            placeholder="Ex: Cardiologia"
                                            value={specialty}
                                            onChange={(e) => setSpecialty(e.target.value)}
                                            required
                                            disabled={cadastroLoading}
                                        />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label htmlFor="presentation">Apresentação</label>

                                        <textarea
                                            className="form-control"
                                            id="presentation"
                                            rows="2"
                                            placeholder="Uma breve apresentação sobre você"
                                            value={presentation}
                                            onChange={(e) => setPresentation(e.target.value)}
                                            required
                                            disabled={cadastroLoading}
                                        ></textarea>
                                    </div>
                                </>
                            )}

                            {/* Data de Nascimento (Paciente) */}
                            {selectedRole === 'user' && (
                                <div className="item-input mb-3">
                                    <label htmlFor="cadastroData">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="cadastroData"
                                        value={cadastroData}
                                        onChange={(e) => setCadastroData(e.target.value)}
                                        required
                                        disabled={cadastroLoading}
                                    />
                                </div>
                            )}

                            {(selectedRole === 'user' || selectedRole === 'admin') && (
                                <div className="item-input mb-3">
                                    <label htmlFor={imageInputId}>{imageInputLabel}</label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        id={imageInputId}
                                        accept="image/*"
                                        ref={imageInputRef}
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        required
                                        disabled={cadastroLoading}
                                    />
                                </div>
                            )}

                            <div className="item-input password mb-3">
                                <label htmlFor="cadastroSenha">Senha</label>

                                <input
                                    type={showPasswordStates.cadastroSenha ? 'text' : 'password'}
                                    className="form-control"
                                    id="cadastroSenha"
                                    placeholder="Crie uma senha"
                                    value={cadastroSenha}
                                    onChange={(e) => setCadastroSenha(e.target.value)}
                                    required
                                    disabled={cadastroLoading}
                                />

                                <button className="show-password" type="button" onClick={() => togglePasswordVisibility('cadastroSenha')}>
                                    {showPasswordStates.cadastroSenha ? 
                                        (<i className="fa-solid fa-eye-slash"></i>) : 
                                        (<i className="fa-solid fa-eye"></i>)
                                    }
                                </button>
                            </div>

                            <div className="item-input password mb-3">
                                <label htmlFor="confirmarSenha">Confirmar senha</label>

                                <input
                                    type={showPasswordStates.confirmarSenha ? 'text' : 'password'}
                                    className="form-control"
                                    id="confirmarSenha"
                                    placeholder="Repita a senha"
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    required
                                    disabled={cadastroLoading}
                                />

                                <button className="show-password" type="button" onClick={() => togglePasswordVisibility('confirmarSenha')}>
                                    {showPasswordStates.confirmarSenha ? 
                                        (<i className="fa-solid fa-eye-slash"></i>) : 
                                        (<i className="fa-solid fa-eye"></i>)
                                    }
                                </button>
                            </div>

                            <button type="submit" className="btn-default" disabled={cadastroLoading}>
                                {cadastroLoading ? 'Cadastrando...' : 'Cadastrar'}
                            </button>
                        </form>

                        <div className="footer-login">
                            <span>
                                Já tem uma conta?

                                <a href="#" data-bs-toggle="modal" data-bs-target="#modalLogin" data-bs-dismiss="modal">
                                    Entrar
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterModal;