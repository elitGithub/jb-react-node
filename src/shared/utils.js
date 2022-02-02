const USER_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const validateUserName = (string) => {
    return USER_REGEX.test(string);
}

export const validatePassword = (string) => {
    return string.length >= 7 && PWD_REGEX.test(string);
}

export const validateAndMatchPasswords = (password, confirmPass) => {
    if (!password || !confirmPass) {
        return false;
    }
    const passwordIsValid = validatePassword(password);
    const passwordMatchIsValid = validatePassword(confirmPass);
    const passwordsAreIdentical = confirmPass === password;
    return passwordIsValid && passwordMatchIsValid && passwordsAreIdentical;
};

export const validateAlphanumeric = (string) =>  {
    return /^[\w\-\s]+$/.test(string);
}