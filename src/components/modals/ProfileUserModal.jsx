import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { formatCPF, formatDateBR } from '../../utils/formatters';
import { validateCPF, validateBirthDate } from '../../utils/validators';
import './ProfileModal.css';

function ProfileUserModal() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user, token, logout } = useAuth();

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const fetchUserProfile = useCallback(async () => {
        if (!user?.id || !token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(response.data);
        }
        catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao buscar dados do perfil.";
            setError(errorMessage);
            Swal.fire('Erro!', errorMessage, 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [user?.id, token, API_BASE_URL]);

    useEffect(() => {
        const modalElement = document.getElementById('modalProfileUser');

        const handleShowModal = () => {
            fetchUserProfile();
            setIsEditing(false);
        };

        modalElement.addEventListener('show.bs.modal', handleShowModal);

        return () => {
            modalElement.removeEventListener('show.bs.modal', handleShowModal);
        };
    }, [fetchUserProfile]);

    const handleEditClick = () => {
        setFormData({
            name: profileData?.name || '',
            email: profileData?.email || '',
            cpf: profileData?.cpf || '',
            birth_date: profileData?.birth_date ? profileData.birth_date.split('T')[0] : '',
        });

        setProfileImageFile(null);
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false); 
        handleRemoveImage();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfileImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setProfileImageFile(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const errors = [];
        
        if (formData.cpf && formData.cpf !== profileData.cpf && !validateCPF(formData.cpf)) {
            errors.push('O CPF informado é inválido.');
        }
        
        if (formData.birth_date && formData.birth_date !== profileData.birth_date.split('T')[0] && !validateBirthDate(formData.birth_date)) {
            errors.push('A data de nascimento não pode ser uma data futura.');
        }

        if (errors.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Dados Inválidos',
                html: errors.join('<br>'),
            });
            return; 
        }

        setIsUpdating(true);

        const dataToSubmit = new FormData();

        if (formData.name !== profileData.name) dataToSubmit.append('name', formData.name);
        if (formData.email !== profileData.email) dataToSubmit.append('email', formData.email);
        if (formData.cpf !== profileData.cpf) dataToSubmit.append('cpf', formData.cpf);
        if (formData.birth_date !== profileData.birth_date.split('T')[0]) dataToSubmit.append('birth_date', formData.birth_date);

        if (profileImageFile) {
            dataToSubmit.append('profileImage', profileImageFile);
        }

        if ([...dataToSubmit.entries()].length === 0) {
            Swal.fire('Nenhuma alteração', 'Você não modificou nenhum dado.', 'info');

            setIsUpdating(false);
            setIsEditing(false);

            return;
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/api/users/update/${user.id}`, dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            setProfileData(response.data.user);

            Swal.fire('Sucesso!', 'Seu perfil foi atualizado.', 'success');
            handleRemoveImage();
            setIsEditing(false);
        }
        catch (err) {
            const errorMessage = err.response?.data?.error || "Ocorreu um erro ao atualizar seu perfil.";
            Swal.fire('Erro!', errorMessage, 'error');
        }
        finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteAccount = async () => {
        const modalElement = document.getElementById('modalProfileUser');
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);

        const result = await Swal.fire({
            title: 'Você tem certeza?',
            text: "Esta ação é irreversível e todos os seus dados serão deletados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            const deleteUrl = `${API_BASE_URL}/api/users/delete/${user.id}`;

            try {
                await axios.delete(deleteUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (modalInstance) {
                    modalInstance.hide();
                }

                await Swal.fire(
                    'Excluída!',
                    'Sua conta foi excluída com sucesso.',
                    'success'
                );

                setTimeout(() => {
                    logout(false);
                }, 200);
            }
            catch (err) {
                const errorMessage = err.response?.data?.error || "Ocorreu um erro ao excluir sua conta.";
                Swal.fire('Erro!', errorMessage, 'error');
            }
        }
    };

    const defaultProviderImage = null;
    const imageUrl = profileData?.profile_image_path
        ? `${API_BASE_URL}${profileData.profile_image_path}`
        : defaultProviderImage;

    return (
        <div className="modal fade" id="modalProfileUser" tabIndex="-1" aria-labelledby="modalProfileUserLabel" aria-hidden="true">
            <div className="modal-dialog modal-profile modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalProfileUserLabel">
                            {isEditing ? 'Editar Perfil' : 'Meu Perfil'}
                        </h6>

                        {isLoading && <p>Carregando perfil...</p>}

                        {error && <div className="alert alert-danger">{error}</div>}

                        {profileData && !isLoading && (
                            !isEditing ? (
                                <div>
                                    <div>
                                        <p className="title-profile">Foto do Documento</p>
                                        <div className="image-document">
                                            {imageUrl ? <img src={imageUrl} alt="Foto do Documento" /> : <p>Nenhuma imagem.</p>}
                                        </div>
                                    </div>

                                    <p className="title-profile">
                                        Nome:
                                        <span>{profileData.name}</span>
                                    </p>

                                    <p className="title-profile">
                                        Email:
                                        <span>{profileData.email}</span>
                                    </p>

                                    <p className="title-profile">
                                        CPF:
                                        <span>{formatCPF(profileData.cpf)}</span>
                                    </p>

                                    <p className="title-profile">
                                        Data de Nascimento:
                                        <span>{formatDateBR(profileData.birth_date)}</span>
                                    </p>

                                    <div className="actions-profile">
                                        <button className="btn-edit" type="button" onClick={handleEditClick}>
                                            <i className="fa-solid fa-pen-to-square"></i> Editar Perfil
                                        </button>

                                        <button className="btn-delete" type="button" onClick={handleDeleteAccount}>
                                            <i className="fa-solid fa-trash-can"></i> Excluir Perfil
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className="item-input mb-3">
                                        <label htmlFor="profileImage" className="form-label">Alterar Foto do Documento</label>

                                        <input ref={fileInputRef} type="file" className="form-control" id="profileImage" name="profileImage" onChange={handleFileChange} />
                                    </div>

                                    {imagePreview && (
                                        <div className="image-preview-container mb-3">
                                            <button type="button" className="btn-remove-image" onClick={handleRemoveImage} title="Remover Imagem">
                                                &times;
                                            </button>

                                            <img src={imagePreview} alt="Pré-visualização do documento" className="image-preview" />
                                        </div>
                                    )}

                                    <div className="item-input mb-3">
                                        <label htmlFor="name" className="form-label">Nome</label>

                                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>

                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label htmlFor="cpf" className="form-label">CPF</label>

                                        <input type="text" className="form-control" id="cpf" name="cpf" value={formData.cpf} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label htmlFor="birth_date" className="form-label">Data de Nascimento</label>

                                        <input type="date" className="form-control" id="birth_date" name="birth_date" value={formData.birth_date} onChange={handleInputChange} />
                                    </div>

                                    <div className="actions-profile">
                                        <button type="submit" className="btn-save" disabled={isUpdating}>
                                            <i className="fa-solid fa-floppy-disk"></i>
                                            {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>

                                        <button type="button" className="btn-delete" onClick={handleCancelClick}>
                                            <i className="fa-solid fa-xmark"></i>
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileUserModal;