import chai from 'chai'
import chaiHttp from 'chai-http'
import {SERVER_URL} from "../constants";
import GenerateInfo from '../utils/generateInfo'

chai.use(chaiHttp);

class ListHelper {
    static async createInitialList(token: string) {
        const res = await chai.request(SERVER_URL)
            .post('/api/initial')
            .set('token', token)
            .send(GenerateInfo.generateInitialList());
        return {
            text: res.text,
            status: res.status,
            ownerId: res.body.ownerId,
            urls: res.body.urls
        }
    }

    static async getInitialList(token: string) {
        const res = await chai.request(SERVER_URL)
            .get('/api/initial')
            .set('token', token);
        return {
            status: res.status,
            text: res.text,
            list: res.body.list
        }
    }

    static async getInitialListById(token: string, id: number){
        const res = await chai.request(SERVER_URL)
            .get(`/api/initial/${id}`)
            .set('token', token);
        return {
            status: res.status,
            SendTos: res.body.SendTos,
            Contacts: res.body.Contacts,
            text: res.text,
            id: res.body.id,
        }
    }

    static async updateInitialList(token: string, newData: any){
        const res = await chai.request(SERVER_URL)
            .put('/api/initial')
            .set('token', token)
            .send(newData);
        return {
            status: res.status,
            text: res.text,
            id: res.body.id,
            SendTos: res.body.SendTos
        }
    }
}
export default ListHelper