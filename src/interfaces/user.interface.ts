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
    gender: string,
    phone: string,
    confirmed: boolean,
    createdAt: Date,
    updatedAt: Date,
}

export default InterfaceModelUser;
