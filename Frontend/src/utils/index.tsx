export const showSnackbar = (msg: string) => {
    const snackbar = document.createElement('div');
    snackbar.textContent = msg;
    snackbar.classList.add('snackbar');
    document.body.appendChild(snackbar);
    snackbar.addEventListener('animationend', () => {
        document.body.removeChild(snackbar);
    });
}

export const checkEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const checkPassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
}

export const hiddenEmail = (email: string) => {
    const emailParts = email.split('@');
    const [username, domain] = emailParts;
    const usernameLength = username.length;
    const visibleChars = Math.min(2, Math.floor(usernameLength / 3));

    const visiblePart = username.slice(0, visibleChars);
    const hiddenPart = '*'.repeat(usernameLength - visibleChars * 2);

    return `${visiblePart}${hiddenPart}@${domain}`;
}