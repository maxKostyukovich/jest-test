import {By} from 'selenium-webdriver'
import Page from "./Page";
import * as webdriver from 'selenium-webdriver'
import {getElementById} from '../../utils/'
class ForgotPassword extends Page{
    public email?: webdriver.WebElement;
    public rootEL?: webdriver.WebElement;
    public submit?: webdriver.WebElement;

    constructor(driver: webdriver.WebDriver) {
        super(driver);
        this.url = this.url + 'forgot_password';
        this.driver = driver;
    }
    async open(){
        await this.driver.get(this.url);
        this.rootEL = await this.driver.findElement(By.id('forgot_password'));
        this.email = await this.rootEL.findElement(By.id('email'));
        this.submit = await this.rootEL.findElement(By.id('form_submit'));
    }

    async getResultEl(){
        return await getElementById(this.driver, 'content', 5000);
    }

}

export default ForgotPassword;