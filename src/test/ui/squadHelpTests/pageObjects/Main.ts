import Page from "./Page";
import {WebElement, WebDriver, By} from "selenium-webdriver";

class Main extends Page{
    public viewNamesButton?: WebElement;
    public menuItems?: WebElement[];
    constructor(driver: WebDriver) {
        super(driver);

    }

    async open(){
        await this.driver.get(this.url);
        this.menuItems = await this.driver.findElements(By.xpath(`//*[@id="navBar"]/ul/li[@class='nav-item hs-has-sub-menu u-header__nav-item']`));
        this.viewNamesButton = await this.driver.findElement(By.xpath(`//div[@class="col-md-4 d-md-inline text-center"]/a[@href='/premium-domains-for-sale/all']`));
    }
}
export default Main;