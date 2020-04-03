import * as rand from 'faker';

class GenerateInfo {
    static generateSecondStepSignUpInfo(withLink: boolean = true){
        if(!withLink){
            return {
                name: rand.name.firstName(),
                phone: rand.phone.phoneNumber(),
                title: "Title",
            }
        }
        return {
            name: rand.name.firstName(),
            phone: rand.phone.phoneNumber(),
            title: "Title",
            linkedInProfileLink: rand.internet.url()
        }
    }

    static generateInitialList() {
        return {
            name: rand.hacker.phrase(),
            instruction: rand.lorem.words(5),
            sendTo: [rand.internet.email()],
            urls: [rand.internet.url(), rand.internet.url(), rand.internet.url(), rand.internet.url()]
        }
    }

    static generateDataForUpdateInitialList(id: number, receiverFirstEmail: string) {
        return {
            listId: id,
            prospect: [
                {
                    prospectUrl: rand.internet.url()
                }
            ],
            receiver: [
                {
                    email: receiverFirstEmail
                },
                {
                    email: this.generateRandomString(3) + rand.internet.email()
                }
            ],
        }
    }


    static generateRandomString(length: number) {
        let text = "";
        const possible = "abcdefghijklmnopqrstuvwxyz";
        for( let i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
}
export default GenerateInfo