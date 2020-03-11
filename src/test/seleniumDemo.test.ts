import * as webdriver from 'selenium-webdriver';
import {By} from 'selenium-webdriver';
import {getElementByClass, getElementById} from '../utils'
import {should} from 'chai';
import Login from '../classes/PageObjects/Login';
import ForgotPassword from "../classes/PageObjects/ForgotPassword";
import Hover from "../classes/PageObjects/Hover";

should();
jest.setTimeout(30000);
describe.skip('Selenium Demo Test Suite', () => {
    const sleep = (m: any) => new Promise(r => setTimeout(r, m));
    let driver: webdriver.WebDriver;

    beforeAll(function () {
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .build();
        driver.manage().window().maximize();
    });

    test('Test click on abtest href', async () => {
        const url = 'https://the-internet.herokuapp.com/';
        await driver.get(url);
        const aEl = await driver.findElements(By.tagName('a'));
        let abTestEl = new webdriver.WebElement(driver, 'emptyEl');
        for (const el of aEl) {
            const text = await el.getText();
            if (text === 'A/B Testing') {
                abTestEl = el;
                break;
            }
        }
        await abTestEl.click();
        const rootEl = await driver.findElement(By.id('content'));
        const title = await rootEl.findElement(By.tagName('h3'));
        const text = await title.getText();
        ['A/B Test Variation 1', 'A/B Test Control'].should.contain(text);
    });

    test('Test Add/Remove elements', async () => {
        const url = 'https://the-internet.herokuapp.com/add_remove_elements/';
        await driver.get(url);
        const rootEl = await getElementByClass(driver, 'example');
        const addButton = await rootEl.findElement(By.tagName('button'));
        await addButton.click();
        const elements = await rootEl.findElements(By.id("elements"));
        elements.length.should.be.eql(1);
    });

    // test('Test Basic auth', async () => {
    //     const url = 'https://the-internet.herokuapp.com/basic_auth';
    //     await driver.get(url);
    //     let alert = await driver.switchTo().alert();
    //     await alert.sendKeys('admin');
    //     await alert.sendKeys('admin');
    //     await alert.accept();
    //     const root = await getElementByClass(driver, 'example');
    //     const text = await root.findElement(By.tagName('h3')).getText();
    //     text.should.eql('Basic Auth');
    // });

    test('Test Broken images', async () => {
        const url = 'https://the-internet.herokuapp.com/broken_images';
        await driver.get(url);
        const element = await driver.findElement(By.className('example'));
        const images = await element.findElements(By.tagName('img'));
        const height = await images.map(async (val) => {
            return await val.getAttribute('naturalHeight');
        });
        let arr: Array<any> = [];
        for (let i = 0; i < height.length; i++) {
            arr.push(await height[i]);
            arr.pop().should.not.eql("0");
        }

    });

    test('Testing checkboxes', async () => {
        const url = 'https://the-internet.herokuapp.com/checkboxes';
        await driver.get(url);
        const rootEl = await driver.findElement(By.id('checkboxes'));
        const checkboxes = await rootEl.findElements(By.tagName('input'));
        await checkboxes[0].click();
        const resArr: Array<any> = [];
        for (const value of checkboxes) {
            resArr.push(await value.isSelected());
            resArr.pop().should.be.true;
        }
    });

    test('Testing select', async () => {
        const url = 'https://the-internet.herokuapp.com/dropdown';
        await driver.get(url);
        const rootEl = await driver.findElement(By.id('dropdown'));
        await rootEl.click();
        const options = await rootEl.findElements(By.tagName('option'));
        await options[1].click();
        const isSelected = await options[1].getAttribute('selected');
        isSelected.should.eql("true");
    });

    // describe.skip('Testing dynamic controls', () => {
    //     const url = 'https://the-internet.herokuapp.com/dynamic_controls';
    //     beforeAll(async () => {
    //         await driver.get(url);
    //     });
    //     test.skip('Testing checkbox', async () => {
    //         const rootEl = await driver.findElement(By.id('checkbox-example'));
    //         const button = await rootEl.findElement(By.tagName('button'));
    //         await button.click();
    //         const messageEl = await getElementById(driver, 'message', 5000);
    //         const messageText = await messageEl.getText();
    //         messageText.should.equal('It\'s gone!');
    //         await button.click();
    //         let checkbox: any;
    //         try {
    //             checkbox = await getElementById(driver, 'checkbox', 5000);
    //         } catch (e) {
    //             e.should.not.exist;
    //         }
    //         const checkboxStatus = await checkbox.isDisplayed();
    //         checkboxStatus.should.be.true;
    //     });
    //     test.skip('Testing input', async () => {
    //         const rootEl = await driver.findElement(By.id('input-example'));
    //         const button = await rootEl.findElement(By.tagName('button'));
    //         const input = await rootEl.findElement(By.tagName('input'));
    //         const inputStatus = await input.getAttribute('disabled');
    //         inputStatus.should.be.equal("true");
    //         await button.click();
    //         await sleep(5000);
    //         const changedInputStatus = await input.getAttribute('disabled');
    //         if (changedInputStatus !== null) {
    //             throw new Error('Status wasn\'t changed')
    //         }
    //     })
    // });

    describe.skip('Testing Login page', () => {
        let loginPage: Login;
        const sendKeysFunc = async (username: string, password: string) => {
            await loginPage.username?.sendKeys(username);
            await loginPage.password?.sendKeys(password);
            await loginPage.submit?.click();
            const flash = await loginPage.getFlashEl();
            return await flash.getText();
        };

        beforeAll(() => {
            loginPage = new Login(driver);
        });

        test('Successful login', async () => {
            await loginPage.open();
            const text = await sendKeysFunc('tomsmith', 'SuperSecretPassword!');
            text.should.be.equal(`You logged into a secure area!\n×`);
        });

        test('Invalid password', async () => {
            await loginPage.open();
            const text = await sendKeysFunc('tomsmith', 'InvalidPassword');
            text.should.be.equal(`Your password is invalid!\n×`);
        });
        test('Invalid username', async () => {
            await loginPage.open();
            const text = await sendKeysFunc('invalidUsername', 'SuperSecretPassword!');
            text.should.be.equal(`Your username is invalid!\n×`);
        });
    });

    test('Testing forgot password form', async () => {
        const forgotPasswordPage = new ForgotPassword(driver);
        await forgotPasswordPage.open();
        await forgotPasswordPage.email?.sendKeys('example@gmail.com');
        await forgotPasswordPage.submit?.click();
        const text = await (await forgotPasswordPage.getResultEl()).getText();
        text.should.equal('Your e-mail\'s been sent!');
    });

    test('Testing hover elements', async () => {
        const hoverPage = new Hover(driver);
        await hoverPage.open();
        if (!hoverPage.hoverEL) {
            return
        }
        await driver.actions().move({origin: hoverPage.hoverEL, duration: 1000}).perform();
        const isDisplayed = await hoverPage.figcaption?.isDisplayed();
        isDisplayed?.should.be.true;
    });

    test('Testing upload files', async () => {
        await driver.get('https://the-internet.herokuapp.com/upload');
        const chooseFileInput = await driver.findElement(By.id('file-upload'));
        await chooseFileInput.sendKeys('/home/qa/Desktop/0.png');
        await driver.findElement(By.id('file-submit')).click();
        const resultEl = await getElementById(driver, 'uploaded-files', 4000);
        (await resultEl.getText()).should.equal('0.png');
    });


    afterAll(function () {
        driver.quit();
    });
});

