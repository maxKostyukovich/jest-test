import * as webdriver from 'selenium-webdriver'
class Page {
    protected url: string;
    public driver: webdriver.WebDriver;
    constructor(driver: webdriver.WebDriver) {
        this.url = 'https://the-internet.herokuapp.com/';
        this.driver = driver;
    }

}
export default Page