import * as webdriver from "selenium-webdriver";
import {until} from "selenium-webdriver";
import {By} from "selenium-webdriver";

export const getElementById = async (driver: webdriver.WebDriver, id: string, timeout = 2000) => {
    const el = await driver.wait(until.elementLocated(By.id(id)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

export const getElementByClass = async (driver: webdriver.WebDriver, className: string, timeout = 2000) => {
    const el = await driver.wait(until.elementLocated(By.className(className)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};

export const getElementByXPath = async (driver: webdriver.WebDriver, xpath: string, timeout = 2000) => {
    const el = await driver.wait(until.elementLocated(By.xpath(xpath)), timeout);
    return await driver.wait(until.elementIsVisible(el), timeout);
};
