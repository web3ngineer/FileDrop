export interface User {
    id: number;
    full_name?: string;
    first_name?:string;
    last_name?:string;
    email: string;
    username: string;
    phone_number: string;
    is_superuser?: boolean;
    created_at: string;
    updated_at: string;
    last_login: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
}


