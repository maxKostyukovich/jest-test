import Page from './Page'
import {By, WebDriver, WebElement, until} from "selenium-webdriver";
import {getElementByClass, getElementById} from "../../../../utils";
import {threadId} from "worker_threads";

class BrandNamesForSale extends Page{
    public filterOptions?: WebElement[];
    public searchInput?: WebElement;
    public searchResult?: WebElement[];
    constructor(driver: WebDriver){
        super(driver);
        this.url = this.url + 'premium-domains-for-sale/all';
        this.driver = driver;
    }

    async open(){
        await this.driver.get(this.url);
        await this.initPageObjects();
    }

    async initPageObjects(){
        this.searchInput = await getElementByClass(this.driver, 'ais-SearchBox-input', 6000);
        this.filterOptions = await this.driver.findElements(By.className('ais-RefinementList-item'));
        //this.filterOptions = await this.driver.wait(until.elementLocated(By.className('ais-RefinementList-item')), 5000);
        await this.driver.wait(until.elementLocated(By.xpath(`//*[@id="hits"]/li`)), 5000);
        this.searchResult = await this.driver.findElements(By.xpath(`//*[@id="hits"]/li`));
    }

}

export default BrandNamesForSale