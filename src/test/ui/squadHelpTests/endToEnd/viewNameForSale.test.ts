import * as webdriver from 'selenium-webdriver'
import {By} from 'selenium-webdriver'
import {should} from 'chai'
import Main from "../pageObjects/Main";
import BrandNamesForSale from "../pageObjects/BrandNamesForSale";
import {getElementByClass, getElementByXPath} from "../../../../utils";

should();
jest.setTimeout(30000);

describe('End to end test suit for view contest for sale', () => {
    const sleep = (m: any) => new Promise(r => setTimeout(r, m));
    let driver: webdriver.WebDriver;
    beforeAll(() => {
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .build();
        driver.manage().window().maximize();
    });
    afterAll( async () => {
        await driver.quit();
    });
    test('Select domain for buying it', async () => {
        const mainPage = new Main(driver);
        await mainPage.open();
        await mainPage.viewNamesButton?.click();
        const domainSalePage = new BrandNamesForSale(driver);
        await domainSalePage.initPageObjects();
        const id = await domainSalePage.searchResult![1].getAttribute('data-mp-domain-id');
        const totalAmountEl = await driver.findElement(By.xpath(`//li[@data-mp-domain-id="${id}"]/a/div[2]/span[@class="price"]`));
        const totalAmount = await totalAmountEl.getText();
        await domainSalePage.searchResult![1].click();
        const byuButton = await getElementByClass(driver, 'buy-now btn', 4000);
        await byuButton.click();
        const price = await getElementByXPath(driver,`/html/body/main/div[2]/div/div/div[2]/div/div[1]/div[3]/div[1]/div/span`, 4000);
        (await price.getText()).should.equal(totalAmount);
    })
});