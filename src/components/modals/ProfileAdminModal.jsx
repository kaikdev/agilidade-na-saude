import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { formatCPF } from '../../utils/formatters';
import { validateCPF } from '../../utils/validators';
import './ProfileModal.css';

function ProfileAdminModal() {
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

    const fetchAdminProfile = useCallback(async () => {
        if (!user?.id || !token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/admin/${user.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data?.data && response.data.data.length > 0) {
                setProfileData(response.data.data[0]);
            }
            else {
                throw new Error("Dados do perfil de administrador não encontrados.");
            }
        }
        catch (err) {
            const errorMessage = err.response?.data?.error || err.message || "Erro ao buscar dados do perfil.";

            setError(errorMessage);

            Swal.fire('Erro!', errorMessage, 'error');
        }
        finally {
            setIsLoading(false);
        }
    }, [user?.id, token, API_BASE_URL]);

    useEffect(() => {
        const modalElement = document.getElementById('modalProfileAdmin');

        const handleShowModal = () => {
            fetchAdminProfile();
            setIsEditing(false);
        };

        modalElement.addEventListener('show.bs.modal', handleShowModal);

        return () => {
            modalElement.removeEventListener('show.bs.modal', handleShowModal);
        };
    }, [fetchAdminProfile]);

    // Handlers para o formulário de edição
    const handleEditClick = () => {
        setFormData({
            name: profileData?.name || '',
            email: profileData?.email || '',
            cpf: profileData?.cpf || '',
            crm: profileData?.crm || '',
            specialty: profileData?.specialty || '',
            presentation: profileData?.presentation || '',
        });

        handleRemoveImage();
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        handleRemoveImage();
    };

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setProfileImageFile(file);

            if (imagePreview) URL.revokeObjectURL(imagePreview);

            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);

        setProfileImageFile(null);

        setImagePreview(null);

        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        if (formData.cpf && formData.cpf !== profileData.cpf && !validateCPF(formData.cpf)) {
            Swal.fire({
                icon: 'error',
                title: 'Dados Inválidos',
                text: 'O CPF deve conter 11 dígitos.'
            });

            return;
        }

        setIsUpdating(true);

        const dataToSubmit = new FormData();

        if (formData.name && formData.name !== profileData.name) dataToSubmit.append('name', formData.name);
        if (formData.email && formData.email !== profileData.email) dataToSubmit.append('email', formData.email);
        if (formData.cpf && formData.cpf !== profileData.cpf) dataToSubmit.append('cpf', formData.cpf);
        if (formData.crm && formData.crm !== profileData.crm) dataToSubmit.append('crm', formData.crm);
        if (formData.specialty && formData.specialty !== profileData.specialty) dataToSubmit.append('specialty', formData.specialty);
        if (formData.presentation && formData.presentation !== profileData.presentation) dataToSubmit.append('presentation', formData.presentation);
        if (profileImageFile) dataToSubmit.append('profileImage', profileImageFile);

        if ([...dataToSubmit.entries()].length === 0) {
            Swal.fire('Nenhuma alteração', 'Você não modificou nenhum dado.', 'info');

            setIsUpdating(false);
            setIsEditing(false);

            return;
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/api/admin/update/${user.id}`, dataToSubmit, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
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
        const modalElement = document.getElementById('modalProfileAdmin');
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
            const deleteUrl = `${API_BASE_URL}/api/admin/delete/${user.id}`;

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

    const imageUrl = profileData?.profile_image_path ? `${API_BASE_URL}${profileData.profile_image_path}` : null;

    return (
        <div className="modal fade" id="modalProfileAdmin" tabIndex="-1" aria-labelledby="modalProfileAdminLabel" aria-hidden="true">
            <div className="modal-dialog modal-profile modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar" onClick={handleCancelClick}></button>

                        <h6 className="modal-title" id="modalProfileAdminLabel">{isEditing ? 'Editar Perfil' : 'Meu Perfil'}</h6>

                        {isLoading && <p>Carregando perfil...</p>}

                        {error && <div className="alert alert-danger">{error}</div>}

                        {profileData && !isLoading && (
                            !isEditing ? (
                                <div>
                                    <div>
                                        <p className="title-profile">Foto do Perfil</p>
                                        <div className="image-document">
                                            {imageUrl ? <img src={imageUrl} alt="Foto do Perfil" /> : <p>Nenhuma imagem.</p>}
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
                                        Especialidade: 
                                        <span>{profileData.specialty || 'Não informado'}</span>
                                    </p>

                                    <p className="title-profile">
                                        CRM: 
                                        <span>{profileData.crm || 'Não informado'}</span>
                                    </p>
                                    
                                    <p className="title-profile presentation">
                                        Apresentação:
                                        <span className="presentation-box">{profileData.presentation || 'Nenhuma apresentação disponível.'}</span>
                                    </p>
                                    
                                    <div className="actions-profile">
                                        <button className="btn-edit" type="button" onClick={handleEditClick}>
                                            <i className="fa-solid fa-pen-to-square"></i> 
                                            Editar Perfil
                                        </button>

                                        <button className="btn-delete" type="button" onClick={handleDeleteAccount}>
                                            <i className="fa-solid fa-trash-can"></i> 
                                            Excluir Perfil
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateSubmit}>
                                    <div className="item-input mb-3">
                                        <label htmlFor="adminProfileImage" className="form-label">Alterar Foto do Perfil</label>

                                        <input ref={fileInputRef} type="file" className="form-control" id="adminProfileImage" name="profileImage" onChange={handleFileChange} accept="image/*" />
                                    </div>

                                    {imagePreview && (
                                        <div className="image-preview-container mb-3">
                                            <button type="button" className="btn-remove-image" onClick={handleRemoveImage} title="Remover Imagem">
                                                &times;
                                            </button>

                                            <img src={imagePreview} alt="Pré-visualização" className="image-preview" />
                                        </div>
                                    )}

                                    <div className="item-input mb-3">
                                        <label>Nome</label>

                                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label>Email</label>
                                        
                                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label>CPF</label>
                                        
                                        <input type="text" className="form-control" name="cpf" value={formData.cpf} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label>CRM</label>
                                        
                                        <input type="text" className="form-control" name="crm" value={formData.crm} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label>Especialidade</label>
                                        
                                        <input type="text" className="form-control" name="specialty" value={formData.specialty} onChange={handleInputChange} />
                                    </div>

                                    <div className="item-input mb-3">
                                        <label>Apresentação</label>
                                        
                                        <textarea className="form-control" name="presentation" value={formData.presentation} onChange={handleInputChange} rows="3"></textarea>
                                    </div>

                                    <div className="actions-profile">
                                        <button type="submit" className="btn-save" disabled={isUpdating}>
                                            <i className="fa-solid fa-floppy-disk"></i> 
                                            {isUpdating ? 'Salvando...' : 'Salvar'}
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

export default ProfileAdminModal;