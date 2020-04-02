import chai from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs';
import * as rand from 'faker'
import {DEFAULT_PASSWORD, SERVER_URL, TEST_IMG} from "../constants";

chai.use(chaiHttp);

class UserHelper {
    static async getProfile(token: string) {
        const res = await chai.request(SERVER_URL)
            .get('/api/user/profile')
            .set('token', token);
        return {
            id: res.body.userData?.id,
            email: res.body.userData?.email,
            role: res.body.userData?.role,
            text: res.text,
            status: res.status
        }
    }

    static async getDashboard(token: string) {
        const res = await chai.request(SERVER_URL)
            .get('/api/user/dashboard')
            .set('token', token);
        return {
            lists: res.body.lists,
            status: res.status,
            name: res.body.userData?.name,
            text: res.text,
            message: res.body.message,
        }
    }

    static async uploadProfileImage(token: string, withImage: boolean = true){
        let res: any;
        if(!withImage){
            res = await chai.request(SERVER_URL)
               .post('/api/user/profilePicture')
               .set('token',token)
               .type('form')
               .field({})
        } else {
             res = await chai.request(SERVER_URL)
                .post('/api/user/profilePicture')
                .set('token', token)
                .type('form')
                .field({})
                .attach('picture', fs.readFileSync(process.cwd() + `/src/test/api/srm/test-img/${TEST_IMG}`), TEST_IMG);
        }
        return {
            avatar: res.body.avatar,
            name: res.body.name,
            status: res.status,
            errStatus: res.body.status,
            text: res.text,
        }
    }

    static async changePassword(token: string, oldPassword: string) {
        const newPassword = DEFAULT_PASSWORD;
        const res = await chai.request(SERVER_URL)
            .post('/api/changePass')
            .set('token', token)
            .send({
                oldPassword,
                newPassword
            });
        return {
            status: res.status,
            text: res.text
        }
    }

    static async updateUser(token: string, updateUser: any) {
        const res = await chai.request(SERVER_URL)
            .post('/api/user/updateProfile')
            .set('token', token)
            .send(updateUser);
        return {
            linkedInUrl: res.body.linkedInUrl?.should.equal()
        }
    }

    static async someMagic(token: string) {
        const res = await chai.request(SERVER_URL)
            .get('/api/user/doMagic')
            .set('token', token);
        if(res.text !== `"Magic complete!"`){
            throw 'Magic is not working('
        }
    }
}

export default UserHelper