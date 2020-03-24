import * as webdriver from 'selenium-webdriver';
import {By, until, WebElement} from 'selenium-webdriver';
import {getElementByClass, getElementById} from '../../../utils/index'
import {should} from 'chai';
import Main from "./pageObjects/Main";
import {declareInterface} from "@babel/types";
import {promises as fs} from 'fs';
import {toMatchImageSnapshot} from 'jest-image-snapshot'
should();
jest.setTimeout(30000);
expect.extend({ toMatchImageSnapshot });
describe('Main page test suite', () => {
    let driver: webdriver.WebDriver;
    const sleep = (m: any) => new Promise(r => setTimeout(r, m));
    beforeAll(function () {
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .build();
        driver.manage().window().maximize();
    });
    afterAll(function () {
        driver.quit();
    });
    describe('Name example carousel test',  () => {
        let mainPage: Main;
        beforeAll(function () {
            mainPage = new Main(driver);
        });
       test('Broken image test', async () => {
           await mainPage.open();
           const arrowNext = (await driver.findElements(By.className('d-lg-inline-block u-slick__arrow u-slick__arrow-centered--y u-slick__arrow--offset rounded-circle fas fa-arrow-right u-slick__arrow-inner u-slick__arrow-inner--right slick-arrow')))[0];
           let heightArray = [];
           for(let i = 0; i < 5; i++){
               const shownElements = await driver.findElements(By.xpath(`//*[@id="content"]/div[2]/div/div[1]/div/div/*[@aria-hidden="false"]/div/div/div/a/img`));
               for(const img of shownElements){
                    await driver.wait(until.elementIsVisible(img), 5000);
                   heightArray.push(await img.getAttribute('naturalHeight'));
               }
               await arrowNext.click();
           }
           heightArray.should.not.contains("0");
       });

       //Very unstable test

       // test('Testing is carousel swipe next and previously', async () => {
       //     await mainPage.open();
       //     const arrowNext = (await driver.findElements(By.className('d-lg-inline-block u-slick__arrow u-slick__arrow-centered--y u-slick__arrow--offset rounded-circle fas fa-arrow-right u-slick__arrow-inner u-slick__arrow-inner--right slick-arrow')))[0];
       //     const arrowPrev = (await driver.findElements(By.className('d-lg-inline-block u-slick__arrow u-slick__arrow-centered--y u-slick__arrow--offset rounded-circle fas fa-arrow-left u-slick__arrow-inner u-slick__arrow-inner--left slick-arrow')))[0];
       //     const starterImageSrc = await driver.findElement(By.xpath(`//*[@id="content"]/div[2]/div/div[1]/div/div/*[@aria-hidden="false"]/div/div/div/a/img`));
       //     await driver.wait(until.elementIsVisible(starterImageSrc), 5000);
       //     await arrowNext.click();
       //     const nextImages = await driver.findElements(By.xpath(`//*[@id="content"]/div[2]/div/div[1]/div/div/*[@aria-hidden="false"]/div/div/div/a/img`));
       //     await driver.wait(until.elementIsVisible(nextImages[0]), 4000);
       //     await arrowPrev.click();
       //     await sleep(1000);
       //     const starterImages2Src = (await (await driver.findElement(By.xpath(`//*[@id="content"]/div[2]/div/div[1]/div/div/*[@aria-hidden="false"]/div/div/div/a/img`))).getAttribute('src'));
       //     await arrowPrev.click();
       //     const prevImages = await driver.findElements(By.xpath(`//*[@id="content"]/div[2]/div/div[1]/div/div/*[@aria-hidden="false"]/div/div/div/a/img`));
       //     const startMainSrc = await starterImageSrc.getAttribute('src');
       //     startMainSrc.should.not.equal(await nextImages[0].getAttribute('src'));
       //     startMainSrc.should.not.equal(await prevImages[0].getAttribute('src'));
       //     startMainSrc.should.equal(starterImages2Src);
       // })
    });

    describe('Testing dropdown submenu', () => {
        test('Submenu is visible', async () => {
                const mainPage = new Main(driver);
                await mainPage.open();
                await sleep(1000);
                let isDisplayedArr = [];
                for (let i = 0; i < mainPage.menuItems!.length; i++) {
                    const subMenu = await driver.findElement(By.xpath(`/html/body/header/div[2]/div[2]/nav/div/ul/li[${i + 1}]/ul`));
                    await driver.actions().move({
                        origin: mainPage.menuItems![i],
                        duration: 1000,
                    })
                        .perform();
                    isDisplayedArr.push(await subMenu.isDisplayed())
                }
                isDisplayedArr.should.not.contain(false);
            }
        )
    });

    describe('Snapshot image testing', () => {
        test('Test', async () => {
            const mainPage = new Main(driver);
            await mainPage.open();
            await sleep(1000);
            let image: any;
            try {
                image = await fs.readFile('./src/test/ui/squadHelpTests/screenshots/main-page.png');
            } catch (e) {
                const img = await driver.takeScreenshot();
                image = await fs.writeFile('./src/test/ui/squadHelpTests/screenshots/main-page.png', img, 'base64');
            }
            expect(image).toMatchImageSnapshot();
            await driver.actions().move( {
                origin: mainPage.menuItems![0],
                duration:2000
            }).perform();
            expect(image).toMatchImageSnapshot();
        })
    })

});