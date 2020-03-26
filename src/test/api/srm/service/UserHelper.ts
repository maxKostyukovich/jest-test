import chai from 'chai'
import chaiHttp from 'chai-http'
import * as rand from 'faker'
import {SERVER_URL, DEFAULT_PASSWORD} from "../constants";

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
}

export default UserHelper