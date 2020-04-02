import chai from 'chai'
import chaiHttp from "chai-http";
import * as rand from 'faker'
import AuthHelper from '../../service/AuthHelper';
import {should} from 'chai'
import GenerateInfo from '../../utils/generateInfo'
import {SERVER_URL, EMAIL_REGEX, DEFAULT_PASSWORD} from "../../constants";

should();
chai.use(chaiHttp);

describe('Sign up test suite', () => {
    describe('Positive case', () => {
        test('Successful sign up test', async () => {
            const user = await AuthHelper.signup();
            user.email.should.exist.and.match(EMAIL_REGEX);
            user.token.should.exist;
            const secondRes = await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
            secondRes.message.should.equal('You were successfully signed up!');
        });
    });
    describe('Negative case', () => {
        test('Invalid email format', async () => {
            const user = await AuthHelper.signup('invalid_email.com');
            user.text.should.equal(`"Validation error: Validation isEmail on email failed"`);
        });

        test('Invalid arguments. Missed Email', async () => {
            const res = await chai.request(SERVER_URL)
                .post('/api/signup')
                .send({password: DEFAULT_PASSWORD});
            res.text.should.equal(`"Cannot read property 'toLowerCase' of undefined"`);
        });

        test('Not unique email', async () => {
            const user = await AuthHelper.signup();
            const res = await AuthHelper.signup(user.email);
            res.text.should.contain('Users_email_key');
        });

        test('linkedInProfileLink argument is missing', async () => {
            const user = await AuthHelper.signup();
            const res = await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo(false));
            res.status.should.equal(500);
            res.errMsg.should.equal('LinkedIn profile link required!');
        })
    })
});