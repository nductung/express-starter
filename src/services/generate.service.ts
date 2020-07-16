class GenerateService {

    public generateOtp() {
        return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    }

    public generateUsername(username: string) {
        let match: any = username.match(/\D/g);
        match = match.join("");
        const random = String(Math.floor(Math.random() * (999 - 100 + 1)) + 100);
        return match + random;
    }

}

export default GenerateService
