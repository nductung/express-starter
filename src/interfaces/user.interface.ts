interface InterfaceModelUser {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string,
    picture: string,
    male: string,
    phone: string,
    confirmed: boolean,
    ref_facebook: string,
    createdAt: Date,
    updatedAt: Date,
}

export default InterfaceModelUser;
