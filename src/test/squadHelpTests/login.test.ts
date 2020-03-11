import * as webdriver from 'selenium-webdriver';
import {By, until} from 'selenium-webdriver';
import {getElementByClass, getElementById} from '../../utils'
import {should} from 'chai';
import Login from "./pageObjects/Login";

should();
jest.setTimeout(30000);

describe.skip('Login test suite', () => {
    let driver: webdriver.WebDriver;
    beforeAll(function () {
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .build();
        driver.manage().window().maximize();
    });
    afterAll(function () {
        driver.quit();
    });
    describe('Positive cases', ()=> {
        test('Success login', async () => {
            const credential = {
                email: 'max.aq2@gmail.com',
                password: 'qwerty123'
            };
            const loginPage = new Login(driver);
            await loginPage.open();
            await loginPage.sendKeys(credential.email, credential.password);
            const displayName = await (await getElementByClass(driver, 'account-user-name', 5000)).getText();
            displayName.should.equal('Max')
        })
    });
    describe('Negative case', () => {
        let loginPage: Login;
        beforeEach(() => {
           loginPage = new Login(driver);
        });
        test('Invalid credentials', async () => {
            const credential = {
                email: 'max.aq2@gmail.com',
                password: 'invalidPassword'
            };
            await loginPage.open();
            await loginPage.sendKeys(credential.email, credential.password);
            await driver.wait(until.elementIsVisible(loginPage.loginFailed!), 3000 );
            const isDisplayed = await loginPage.loginFailed?.isDisplayed();
            isDisplayed?.should.be.true;
        });

        test('Invalid email format', async () => {
            const credential = {
                email: 'mamailom',
                password: 'invalidPassword'
            };
            await loginPage.open();
            await loginPage.sendKeys(credential.email, credential.password);
            await driver.wait(until.elementIsVisible(loginPage.errorMessage!), 3000 );
            const isDisplayed = await loginPage.errorMessage?.isDisplayed();
            isDisplayed?.should.be.true;
            (await loginPage.errorMessage?.getText())?.should.equal('Email is not valid format');
        })
    })
});