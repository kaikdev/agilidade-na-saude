import { useState } from 'react';

const usePasswordToggle = (initialState = {}) => {
    const [showPasswordStates, setShowPasswordStates] = useState(initialState);

    const togglePasswordVisibility = (inputId) => {
        setShowPasswordStates(prevState => ({
            ...prevState,
            [inputId]: !prevState[inputId]
        }));
    };
    
    return [showPasswordStates, togglePasswordVisibility];
};

export default usePasswordToggle;