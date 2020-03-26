import chai from 'chai'
import chaiHttp from 'chai-http'
import {should} from 'chai'
import AuthHelper from '../../service/AuthHelper';
import UserHelper from '../../service/UserHelper';
import GenerateInfo from '../../utils/generateInfo';
import {SERVER_URL} from "../../constants";

should();
chai.use(chaiHttp);

describe('User test suite', () => {
    describe('Profile test', () => {
        test('Get profile', async () => {
            const user = await AuthHelper.signup();
            const res = await UserHelper.getProfile(user.token);
            res.status.should.equal(200);
            res.role.should.equal('invitedUser');
            res.email.should.equal(user.email);
        });

        test('Get profile with invalid token', async () => {
            const res = await UserHelper.getProfile('InvalidToken');
            res.text.should.equal('Unauthorized');
            res.status.should.equal(401);
        });

        test('Get profile without token', async () => {
            const res = await chai.request(SERVER_URL)
                .get('/api/user/profile');
            res.text.should.equal(`"You are not authorized"`);
            res.status.should.equal(401);
        })
    });

    describe('Dashboard test', () => {
        test('Get dashboard', async () => {
            const user = await AuthHelper.signup();
            await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
            const res = await UserHelper.getDashboard(user.token);
            res.status.should.equal(200);
            res.lists.should.to.be.an('array');
            res.name.should.to.be.a('string');
        });

        test('Get dashboard with invalid token', async () => {
            const res = await UserHelper.getDashboard('InvalidToken');
            res.text.should.equal('Unauthorized');
            res.status.should.equal(401);
        });

        test('Get dashboard without token', async () => {
            const res = await chai.request(SERVER_URL)
                .get('/api/user/dashboard');
            res.text.should.equal(`"You are not authorized"`);
            res.status.should.equal(401);
        });

        test('Get dashboard without second step registration', async () => {
            const user = await AuthHelper.signup();
            const res = await UserHelper.getDashboard(user.token);
            res.status.should.equal(500);
            res.message.should.equal(`Cannot read property 'ContactsToContacts' of null`);
        })
    })


});