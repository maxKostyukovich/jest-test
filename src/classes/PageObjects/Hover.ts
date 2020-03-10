import {By} from 'selenium-webdriver'
import Page from "./Page";
import * as webdriver from 'selenium-webdriver'
import {getElementById} from '../../utils/'
class Hover extends Page{
    public hoverEL?: webdriver.WebElement;
    public figcaption?: webdriver.WebElement;

    constructor(driver: webdriver.WebDriver) {
        super(driver);
        this.url = this.url + 'hovers';
        this.driver = driver;
    }
    async open(){
        await this.driver.get(this.url);
        this.hoverEL = await this.driver.findElement(By.className('figure'));
        this.figcaption = await this.hoverEL.findElement(By.className('figcaption'));

    }

    async getResultEl(){
        return await getElementById(this.driver, 'content', 5000);
    }

}

export default Hover;