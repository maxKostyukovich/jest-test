import * as webdriver from 'selenium-webdriver'
class Page {
    protected url: string;
    public driver: webdriver.WebDriver;
    constructor(driver: webdriver.WebDriver) {
        this.url = 'https://www.squadhelp.com/';
        this.driver = driver;
    }

}
export default Page