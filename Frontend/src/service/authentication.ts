import { showSnackbar } from "../utils";

const apiUrlPrefix = 'http://localhost:8080/auth/';
function hello(params: any) {
    console.log(params?.id);
}

const helloObject = { id: 1 } as { id: number };
hello(helloObject || { id: 1 })

export const signHome = async () => {
    const localSessionToken = localStorage.sessionToken || '';
    if (localSessionToken === '') return location.href = '/new';

    const response = await fetch(apiUrlPrefix + 'token', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            token: localSessionToken
        }),
    }).then(x => x.json());

    if (!response.ok) return location.href = '/new';

    return response;
}

export const signOtp = async () => {
    const localSessionToken = localStorage.sessionToken || '';
    const localCurrentEmail = localStorage.currentEmail || '';

    if (localSessionToken === '' && localCurrentEmail) return null;
    if (!localCurrentEmail) return location.href = '/new';

    const response = await fetch(apiUrlPrefix + 'token', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            token: localSessionToken
        }),
    }).then(x => x.json());

    if (!response.ok) return null;

    return location.href = '/';
}

export const signNew = async () => {
    const localSessionToken = localStorage.sessionToken || '';
    if (localSessionToken === '') return null;

    const response = await fetch(apiUrlPrefix + 'token', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            token: localSessionToken
        }),
    }).then(x => x.json());

    if (!response.ok) return null;

    return location.href = '/';
}

export const signIn = async (formData: Record<string, any>) => {
    const response = await fetch(apiUrlPrefix + 'login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData),
    }).then(x => x.json());

    if (!response.ok) return showSnackbar(response.message);

    if (!response.existingUser.isActive) {
        await fetch(apiUrlPrefix + 're-verification', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                email: formData.email
            }),
        }).then(x => x.json());

        showSnackbar('Email kayıtlı ancak email onaylanmamış. Onaylanma sayfasına yönlendiriliyorsunuz..');
        localStorage.currentEmail = formData.email;

        setTimeout(() => {
            location.href = '/new/otp';
        }, 2500);

        return;
    }

    localStorage.sessionToken = response.existingUser.authentication.sessionToken;
    showSnackbar('giriş başarılı');

    setTimeout(() => {
        location.href = '/';
    }, 1500);
}

export const againSendEmail = async () => {
    const response = await fetch(apiUrlPrefix + 're-verification', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: localStorage.currentEmail
        }),
    }).then(x => x.json());

    if (!response.ok) return showSnackbar(response.message);
    return showSnackbar('email yeniden gönderildi');
}

export const signUp = async (formData: Record<string, any>) => {
    const response = await fetch(apiUrlPrefix + 'register', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData),
    }).then(x => x.json());

    if (!response.ok) return showSnackbar(response.message);

    if (response.existingUser && !response.existingUser.isActive) {
        await fetch(apiUrlPrefix + 're-verification', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                email: formData.email
            }),
        }).then(x => x.json());

        showSnackbar('Email kayıtlı ancak email onaylanmamış. Onaylanma sayfasına yönlendiriliyorsunuz..');

        localStorage.currentEmail = formData.email;

        setTimeout(() => {
            location.href = '/new/otp';
        }, 2500);

        return;
    }

    showSnackbar('kayıt işlemi başarılı, email onaylama sayfasına yönlendiriliyorsunuz..');

    localStorage.currentEmail = formData.email;

    setTimeout(() => {
        location.href = '/new/otp';
    }, 1500);
}

export const emailVerification = async (otp: string[]) => {
    const response = await fetch(apiUrlPrefix + 'verification', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            otp: Number(otp.join('')),
            email: localStorage.currentEmail
        }),
    }).then(x => x.json());

    console.log(otp.join(''));

    if (!response.ok) return showSnackbar(response.message);

    localStorage.sessionToken = response.user.authentication.sessionToken;

    showSnackbar('Email onaylama başarılı');

    setTimeout(() => {
        localStorage.removeItem('currentEmail');
        location.href = '/'
    }, 1500);
}

export const forgotPassword = async (formData: Record<string, any>) => {
    const response = await fetch(apiUrlPrefix + 'forgot-password', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email: formData.email
        }),
    }).then(x => x.json());

    if (!response.ok) return showSnackbar(response.message);

    localStorage.currentEmail = formData.email;
    showSnackbar(response.message);
}

export const forgotPasswordVerification = async (formData: Record<string, any>, id: number) => {
    const response = await fetch(apiUrlPrefix + 'forgot-password-verification', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            id: Number(id),
            password: formData.password,
            email: localStorage.currentEmail
        }),
    }).then(x => x.json());

    if (!response.ok) return showSnackbar(response.message);

    showSnackbar(response.message);

    setTimeout(() => {
        location.href = '/new/login';
    }, 1500);
}