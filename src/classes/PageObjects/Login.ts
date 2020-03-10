import {By} from 'selenium-webdriver'
import Page from "./Page";
import * as webdriver from 'selenium-webdriver'
import {getElementById} from '../../utils/'
class Login extends Page{
    public username?: webdriver.WebElement;
    public password?: webdriver.WebElement;
    public rootEL?: webdriver.WebElement;
    public submit?: webdriver.WebElement;
     constructor(driver: webdriver.WebDriver) {
        super(driver);
        this.url = this.url + 'login';
        this.driver = driver;
    }

    async open(){
        await this.driver.get(this.url);
        this.rootEL = await this.driver.findElement(By.id('login'));
        this.username =  await this.rootEL.findElement(By.id('username'));
        this.password =  await this.rootEL.findElement(By.id('password'));
        this.submit = await this.rootEL.findElement(By.tagName('button'));
    }

    async getFlashEl(){
        return await getElementById(this.driver, 'flash', 6000);
    }

}

export default Login;