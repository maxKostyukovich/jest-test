import chai from 'chai'
import chaiHttp from 'chai-http'
import AuthHelper from '../../service/AuthHelper'
import {should} from 'chai'

should();
chai.use(chaiHttp);

describe('Login test suite', () => {
    test('Successful login test', async () => {
       const user = await AuthHelper.signup();
       const isSuccess = await AuthHelper.logout(user.token);
       if(!isSuccess){
           throw 'Logout failed'
       }
       const res = await AuthHelper.login(user.email);
       res.email.should.equal(user.email);
       res.token.should.exist;
    });

    test('Invalid credentials on login', async () => {
        const res = await AuthHelper.login('invalidEmail@gmail.com', 'invalidPassword');
        res.user.should.be.false;
    });

    test('Login without logout', async () => {
        const user = await AuthHelper.signup();
        const res = await AuthHelper.login(user.email);
        res.text.should.contain('Tokens_userId_key');
    })
});
