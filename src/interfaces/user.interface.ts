interface InterfaceModelUser {
    _id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    email: string;
    password: string;
    role: string,
    session: number,
    createdAt: Date,
    updatedAt: Date,
}

export default InterfaceModelUser;
