import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { formatCPF } from '../../utils/formatters';
import './ProfileModal.css';

function ProfileAdminModal() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { user, token, logout } = useAuth();

    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
            } else {
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
        };

        modalElement.addEventListener('show.bs.modal', handleShowModal);

        return () => {
            modalElement.removeEventListener('show.bs.modal', handleShowModal);
        };
    }, [fetchAdminProfile]);

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

    const imageUrl = profileData?.profile_image_path
        ? `${API_BASE_URL}${profileData.profile_image_path}`
        : null;

    return (
        <div className="modal fade" id="modalProfileAdmin" tabIndex="-1" aria-labelledby="modalProfileAdminLabel" aria-hidden="true">
            <div className="modal-dialog modal-profile modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>

                        <h6 className="modal-title" id="modalProfileAdminLabel">Meu Perfil</h6>

                        {isLoading && <p>Carregando perfil...</p>}

                        {error && <div className="alert alert-danger">{error}</div>}

                        {profileData && !isLoading && (
                            <div>
                                <div>
                                    <p className="title-profile">Foto do Perfil</p>

                                    <div className="image-document">
                                        <img src={imageUrl} alt="Foto do Perfil" />
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
                                    <span className="presentation-box">
                                        {profileData.presentation || 'Nenhuma apresentação disponível.'}
                                    </span>
                                </p>

                                <div className="actions-profile">
                                    <button className="btn-edit" type="button">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                        Editar Perfil
                                    </button>

                                    <button className="btn-delete" type="button" onClick={handleDeleteAccount}>
                                        <i className="fa-solid fa-trash-can"></i>
                                        Excluir Perfil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileAdminModal;