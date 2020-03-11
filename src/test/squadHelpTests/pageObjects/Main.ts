import Page from "./Page";
import {WebElement, WebDriver, By} from "selenium-webdriver";

class Main extends Page{
    //public firstCarousel?: WebElement;
    constructor(driver: WebDriver) {
        super(driver);

    }

    async open(){
        await this.driver.get(this.url);
        //this.firstCarousel = await this.driver.findElement(By.className('name-example-slider'))

    }
}
export default Main;