import * as webdriver from 'selenium-webdriver'
import { should } from 'chai'
import {getElementByClass, getElementById} from "../../../utils/index";
import Login from './pageObjects/Login';
import {credentials, contestTestData, errorAlertMessages} from "./constants/index";
import ContestCreate from './pageObjects/ContestCreate';
import {By, WebElement} from "selenium-webdriver";
should();
jest.setTimeout(30000);


describe('Contest create test suit', () => {
    const sleep = (m: any) => new Promise(r => setTimeout(r, m));
    let driver: webdriver.WebDriver;
    const clearInputs = async (page: ContestCreate) => {
        await page.contestTitleInput?.clear();
        await page.businessDoTextarea?.clear();
        await page.companyNameTextarea?.clear();
    };
   beforeAll(() => {
       driver = new webdriver.Builder()
           .withCapabilities(webdriver.Capabilities.chrome())
           .build();
       driver.manage().window().maximize();
   });
   afterAll( async () => {
       await driver.quit();
   });

   test('Login and create contest', async () => {
       const loginPage = new Login(driver);
       await loginPage.open();
       await loginPage.sendKeys(credentials.email, credentials.password);
       await getElementByClass(driver, 'account-user-name', 5000);
       const contestPage = new ContestCreate(driver);
       await contestPage.open();
       await contestPage.logoTypeElement?.click();
       await getElementByClass(driver, 'contest-create-form js-validate', 4000);
       await contestPage.contestBriefElementsInit();
       await clearInputs(contestPage);
       await contestPage.fillBriefForm(contestTestData);
       await contestPage.nextButton?.click();
       await contestPage.contestPricingElementsInit();
       await contestPage.bronzePricing?.click();
       await contestPage.pricingNextButton?.click();
       await (await getElementByClass(driver, 'btn btn-lg btn-primary transition-3d-hover', 3000)).click();
       await sleep(1000);
       const paymentAmount = await driver.findElement(By.id('total-payment-amount'));
       const textAmount = await paymentAmount.getText();
       const attributeAmount = await paymentAmount.getAttribute('data-total-payment-amount');
       textAmount.should.equal(attributeAmount);
   });

    test.only('Invalid data in contest create form', async () => {
        const initiateClickToNextPage = async (page: ContestCreate, errorMsg: string) => {
            await page.nextButton?.click();
            await driver.wait(webdriver.until.alertIsPresent());
            let alert = await driver.switchTo().alert();
            let alertText = await alert.getText();
            alertText.should.equal(errorMsg);
            await alert.accept();
        };
        const loginPage = new Login(driver);
        await loginPage.open();
        await loginPage.sendKeys(credentials.email, credentials.password);
        await getElementByClass(driver, 'account-user-name', 5000);
        let deletePrevContest: WebElement;
        try {
            deletePrevContest = await driver.findElement(By.xpath(`//a[@class='btn  btn-icon btn-light ml-4' and @onclick="deleteDraftContest(this)"]`));
            await deletePrevContest.click();
            await driver.wait(webdriver.until.alertIsPresent());
            let alert = await driver.switchTo().alert();
            await alert.accept();
            await sleep(1000);
        }catch (e) {
            console.log("Element not found")
        }
        const contestPage = new ContestCreate(driver);
        await contestPage.open();
        await contestPage.logoTypeElement?.click();
        await getElementByClass(driver, 'contest-create-form js-validate', 4000);
        await contestPage.contestBriefElementsInit();

        //await clearInputs(contestPage);

        await initiateClickToNextPage(contestPage, errorAlertMessages.title);
        await contestPage.contestTitleInput?.sendKeys(contestTestData.title);
        await sleep(1000);

        await initiateClickToNextPage(contestPage, errorAlertMessages.whatBusinessDo);
        await contestPage.businessDoTextarea?.sendKeys(contestTestData.businessDo);

        await initiateClickToNextPage(contestPage, errorAlertMessages.name);
        await contestPage.companyNameTextarea?.sendKeys(contestTestData.companyName);
        await contestPage.nextButton?.click();
        await sleep(1000);
        await contestPage.contestPricingElementsInit();
        await contestPage.pricingNextButton?.click();
        await driver.wait(webdriver.until.alertIsPresent());
        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        alertText.should.equal(errorAlertMessages.selectPackage);
    })

});