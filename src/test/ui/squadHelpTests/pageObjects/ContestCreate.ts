import Page from './Page'
import {WebElement, WebDriver, By} from "selenium-webdriver";
import {contestTestData} from "../constants";
import {getElementByClass}  from "../../../../utils"

class ContestCreate extends Page{
    public logoTypeElement?: WebElement;

    public contestTitleInput?: WebElement;
    public businessDoTextarea?: WebElement;
    public companyNameTextarea?: WebElement;
    public currentUrlInput?: WebElement;
    public targetCustomerTextarea?: WebElement;
    public visualStyleElement?: WebElement;
    public contestDurationSelect?: WebElement;
    public nextButton?: WebElement;

    public bronzePricing?: WebElement;
    public pricingNextButton?: WebElement;
    constructor(driver: WebDriver){
        super(driver);
        this.url = this.url + 'contesttype';
        this.driver = driver;
    }

    async open() {
        await this.driver.get(this.url);
        this.logoTypeElement = await this.driver.findElement(By.xpath('//*[@id="content"]/div[2]/div/div/div[2]/div/a'));
    }

    async contestBriefElementsInit() {
        this.contestTitleInput = await this.driver.findElement(By.name('title'));
        this.businessDoTextarea = await this.driver.findElement(By.name('company_business'));
        this.companyNameTextarea = await this.driver.findElement(By.name('company_name'));
        this.currentUrlInput = await this.driver.findElement(By.name('current_url'));
        this.targetCustomerTextarea = await this.driver.findElement(By.name('target_audience'));
        this.visualStyleElement = await this.driver.findElement(By.xpath('//*[@id="content"]/div[3]/div/form/div[1]/div/div/div[14]/div[1]/div'));
        this.contestDurationSelect = await getElementByClass(this.driver, 'dropdown bootstrap-select form-control', 4000);
        this.nextButton = await this.driver.findElement(By.xpath('//*[@id="content"]/div[3]/div/form/div[2]/div/div/div[3]/a'));
    }

    async contestPricingElementsInit() {
        this.bronzePricing = await this.driver.findElement(By.xpath(`//*[@id="desktop-pricing-plans"]/div/div/div/div[2]/div/ul/li[4]`));
        this.pricingNextButton = await this.driver.findElement(By.xpath(`//*[@id="content"]/div[2]/div/div[4]/div/div[1]/div[3]/a`));
    }

    async fillBriefForm (contestTestData: any) {
        await this.contestTitleInput?.sendKeys(contestTestData.title);
        await this.businessDoTextarea?.sendKeys(contestTestData.businessDo);
        await this.companyNameTextarea?.sendKeys(contestTestData.companyName);
        await this.currentUrlInput?.sendKeys(contestTestData.currentUrl);
        await this.targetCustomerTextarea?.sendKeys(contestTestData.targetCustomer);
        await this.contestDurationSelect?.click();
        const li = await this.driver.findElement(By.xpath(`/html/body/div[3]/div/div/ul/li[1]/a`));
        await li.click();
    }
}

export default ContestCreate