import chai from 'chai'
import chaiHttp from 'chai-http'
import {should} from 'chai'
import AuthHelper from '../../service/AuthHelper';
import UserHelper from '../../service/UserHelper';
import GenerateInfo from '../../utils/generateInfo';
import {DEFAULT_PASSWORD, SERVER_URL} from "../../constants";

should();
chai.use(chaiHttp);

describe('User test suite', () => {
    describe('Profile test', () => {
        describe('Positive case', () => {
            test('Get profile', async () => {
                const user = await AuthHelper.signup();
                const res = await UserHelper.getProfile(user.token);
                res.status.should.equal(200);
                res.role.should.equal('invitedUser');
                res.email.should.equal(user.email);
            });
        });
        describe('Negative case', () => {
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
        })
    });

    describe('Dashboard test', () => {
        describe('Positive case', () => {
            test('Get dashboard', async () => {
                const user = await AuthHelper.signup();
                await AuthHelper.signUpSecondStep(user.token, GenerateInfo.generateSecondStepSignUpInfo());
                const res = await UserHelper.getDashboard(user.token);
                res.status.should.equal(200);
                res.lists.should.to.be.an('array');
                res.name.should.to.be.a('string');
            });
        });
        describe('Negative case', () => {
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

    describe('Upload profile picture test', () => {
        describe('Positive case', () => {
            test('Successful picture uploading', async () => {
                const user = await AuthHelper.signup();
                const res = await UserHelper.uploadProfileImage(user.token);
                res.status.should.equal(200);
                res.avatar.should.contain('uploads');
            });
        });
        describe('Negative case', () => {
            test('Upload avatar without img', async () => {
                const user = await AuthHelper.signup();
                const res = await UserHelper.uploadProfileImage(user.token, false);
                res.errStatus.should.equal(500);
                res.status.should.equal(200);
            });
        })
    });

    describe('Change password test', () => {
        describe('Positive case', () => {
            test('Successful password change', async () => {
                const user = await AuthHelper.signup();
                const res = await UserHelper.changePassword(user.token, DEFAULT_PASSWORD);
                res.status.should.equal(200);
                res.text.should.equal(`"Password changed successfully!"`)
            });
        });
        describe('Negative case', () => {
            test('Changing password with incorrect old password', async () => {
                const user = await AuthHelper.signup();
                const res = await UserHelper.changePassword(user.token, 'invalidPassword');
                res.text.should.equal(`"Passwords didn\`t compare"`);
                res.status.should.equal(400);
            })
        })
    });

    describe('Updating user data test', () => {
        describe('Positive case', () => {
            test('Update name and linkedin link', async () => {
                const updateUser = {
                    name: 'John',
                    Contact: {
                        linkedInProfileLink: 'https://www.linkedin.com/in/%D0%BC%D0%B0%D0%BA%D1%81%D0%B8%D0%BC-%D0%BA%D0%BE%D1%81%D1%82%D1%8E%D0%BA%D0%BE%D0%B2%D0%B8%D1%87-a90921178'
                    }
                };
                const user = await AuthHelper.signup();
                console.log(user);
                const res = await chai.request(SERVER_URL)
                    .post('/api/user/updateProfile')
                    .set('token', user.token)
                    .send(updateUser);
                res.status.should.equal(200);
                res.body.linkedInUrl?.should.equal(updateUser.Contact.linkedInProfileLink);
                res.body.name.should.equal(updateUser.name);
            });
        })
    })

});