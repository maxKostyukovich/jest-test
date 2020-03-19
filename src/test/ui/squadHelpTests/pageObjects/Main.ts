import Page from "./Page";
import {WebElement, WebDriver, By} from "selenium-webdriver";

class Main extends Page{
    //public firstCarousel?: WebElement;
    public menuItems?: WebElement[];
    constructor(driver: WebDriver) {
        super(driver);

    }

    async open(){
        await this.driver.get(this.url);
        //this.firstCarousel = await this.driver.findElement(By.className('name-example-slider'))
        this.menuItems = await this.driver.findElements(By.xpath(`//*[@id="navBar"]/ul/li[@class='nav-item hs-has-sub-menu u-header__nav-item']`));
    }
}
export default Main;