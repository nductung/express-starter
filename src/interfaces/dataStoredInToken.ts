interface DataStoredInToken {
    _id: string;
    exp: number;
    iat: number;
    role: string;
}

export default DataStoredInToken;
