import chai from 'chai'
import chaiHttp from 'chai-http'
import {should} from 'chai'
import AuthHelper from '../../service/AuthHelper'
import ListHelper from '../../service/ListHelper'
import GenerateInfo from '../../utils/generateInfo'
import {SERVER_URL} from "../../constants";
import UserHelper from "../../service/UserHelper";
should();
chai.use(chaiHttp);

describe('Initial list test suite', () => {
    describe('Creating initial list', () => {
        describe('Positive case', () => {
            test('Create initial list', async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                await UserHelper.someMagic(user.token);
                const res = await ListHelper.createInitialList(user.token);
                res.status.should.equal(200);
                res.ownerId.should.to.be.a('number');
                res.urls.should.to.be.an('array');
            })
        });
        describe('Negative case', () => {
            test('Create initial list without magic', async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                const res = await ListHelper.createInitialList(user.token);
                res.text.should.equal(`"You can\`t visit this page!"`);
                res.status.should.equal(400);
            })
        })
    });

    describe('Get initial list test', () => {
        describe('Positive case', () => {
            test('Get all lists', async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                await UserHelper.someMagic(user.token);
                const res = await ListHelper.getInitialList(user.token);
                res.status.should.equal(200);
                res.list.should.to.be.an('array');
            });
            test('Get list by id',  async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                await UserHelper.someMagic(user.token);
                await ListHelper.createInitialList(user.token);
                const {list} = await ListHelper.getInitialList(user.token);
                const id = list[0].id;
                const res = await ListHelper.getInitialListById(user.token, id);
                res.status.should.equal(200);
                res.id.should.equal(id);
                res.Contacts.should.to.be.an('array');
                res.SendTos.should.to.be.an('array');

            })
        });
        describe('Negative case', () => {
            test('Get initial list with invalid id', async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                await UserHelper.someMagic(user.token);
                await ListHelper.createInitialList(user.token);
                const invalidId = -13;
                const res = await ListHelper.getInitialListById(user.token, invalidId);
                res.status.should.equal(400);
                res.text.should.equal(`"List isn\`t found"`);
            })
        })

    });

    describe('Update initial list test', () => {
        describe('Positive case', () => {
            test('Successful updating initial list', async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                await UserHelper.someMagic(user.token);
                await ListHelper.createInitialList(user.token);
                const {list} = await ListHelper.getInitialList(user.token);
                const id = list[0].id;
                const newData = GenerateInfo.generateDataForUpdateInitialList(id, 'andreygrt2@gmail.com');
                const res = await ListHelper.updateInitialList(user.token,newData);
                res.status.should.equal(200);
                res.id.should.equal(id);
                res.SendTos.should.to.be.an('array');
                res.SendTos[0]?.email.should.equal('andreygrt2@gmail.com');
                res.SendTos[0]?.listId.should.equal(id);

            })
        });
        describe('Negative case', () => {
            test('Updating initial list with invalid id', async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                await UserHelper.someMagic(user.token);
                const newData = GenerateInfo.generateDataForUpdateInitialList(-1, 'andreygrt2@gmail.com');
                const res = await ListHelper.updateInitialList(user.token,newData);
                res.status.should.equal(200);
                res.text.should.equal(`"List is not found"`);
            })
        })
    })


});
//"List isn`t found"