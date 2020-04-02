import chai from 'chai'
import chaiHttp from 'chai-http'
import * as rand from 'faker'
import {SERVER_URL, DEFAULT_PASSWORD} from "../constants";
import GenerateInfo from '../utils/generateInfo'
chai.use(chaiHttp);

class AuthHelper {
    static async login(email: string, password: string = DEFAULT_PASSWORD){
        const res = await chai.request(SERVER_URL)
            .post('/api/login')
            .send({email, password});
        return {
            token: res.body?.token,
            email: res.body?.email,
            text: res.text,
            user: res.body?.user,
        }
    }

    static async signup(email?: string){
        if(email === undefined){
            //email = GenerateInfo.generateRandomString(5) + rand.internet.email();
            email = GenerateInfo.generateRandomString(10) + '@gmail.com';
        }
        const res = await chai.request(SERVER_URL)
            .post('/api/signup')
            .send({email, password: DEFAULT_PASSWORD});
        console.log(res.text);
        return {
            email: res.body?.userData?.email,
            token: res.body?.token,
            text: res.text,
        }
    }

    static async signUpSecondStep(token: string, editionInfo: any){
        const res = await chai.request(SERVER_URL)
            .post('/api/signupSecondStep')
            .set('token', token)
            .send(editionInfo);
        return {
            message: res.body.message,
            status: res.status,
            text: res.text,
            errMsg: res.body.message[0]?.msg,
        }
    }

    static async logout(token: string) {
        const res = await chai.request(SERVER_URL)
            .get('/api/logout')
            .set('token', token);
        return res.text === `"You are successfully logged out"`;
    }
}

export default AuthHelper