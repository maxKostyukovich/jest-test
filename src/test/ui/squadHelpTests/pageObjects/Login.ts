import Page from "./Page";
import {WebElement, WebDriver, By} from "selenium-webdriver";

class Login extends Page {
    public rootEl?: WebElement;
    public email?: WebElement;
    public password?: WebElement;
    public submit?: WebElement;
    public loginFailed?: WebElement;
    public errorMessage?:  WebElement;

    constructor(driver: WebDriver) {
        super(driver);
        this.url = this.url + 'login';
        this.driver = driver;
    }

    async open(){
        await this.driver.get(this.url);
        this.rootEl = await this.driver.findElement(By.className('signup_form'));
        this.email = await this.rootEl.findElement(By.id('inputEmail'));
        this.password = await this.rootEl.findElement(By.name('password'));
        this.submit = await this.rootEl.findElement(By.className('create-account-button'));
        this.loginFailed = await this.driver.findElement(By.className('login-failed'));
        this.errorMessage = await this.rootEl.findElement(By.className('error-message'));
    }

    async sendKeys(email: string, password: string) {
        await this.email?.sendKeys(email);
        await this.password?.sendKeys(password);
        await this.submit?.click();
    }

}

export default Login