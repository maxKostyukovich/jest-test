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

}
export default GenerateInfo