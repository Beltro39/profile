export const loginValidation = (values) => {
    let errors = {};

    if (!values.username) {
        errors.username = "Usuario requerido"
    } 
    if (!values.password) {
        errors.password = "Contraseña requerida"
    }
    return errors;
}