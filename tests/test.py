# -*- coding: utf-8 -*-

from selenium import webdriver
from selenium.webdriver import DesiredCapabilities
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.action_chains import ActionChains
import time
import re
from setup import CHROME_PATH

register_info = [
    {
        "username": "test0",
        "password": "password",
        "email": "test0@email.com",
        "new_username": "new0",
        "new_email": "new0@email.com"
    },
    {
        "username": "test1",
        "password": "password",
        "email": "test1@email.com"
    }
]

def doLogout(driver):
    user_avatar = driver.find_element_by_class_name("ant-dropdown-trigger")
    user_avatar.click()
    ActionChains(driver).move_to_element(user_avatar).perform()
    logout = driver.find_elements_by_class_name("ant-dropdown-menu-item")[2]
    logout.click()

def doLogin(driver, info):
    login_button = driver.find_element_by_id("login")
    login_button.click()
    time.sleep(5)
    username_input = driver.find_element_by_id("form_username")
    password_input = driver.find_element_by_id("form_password")
    username_input.send_keys(info["username"])
    password_input.send_keys(info["password"])
    login_button_group = driver.find_elements_by_class_name("ant-btn")[2:]
    login_button_group[1].click()
    time.sleep(5)

def doRegister(driver, info):
    register_button = driver.find_element_by_id("register")
    register_button.click()
    time.sleep(5)
    username_input = driver.find_element_by_id("form_username")
    password_input = driver.find_element_by_id("form_password")
    email_input = driver.find_element_by_id("form_email")
    username_input.send_keys(info["username"])
    password_input.send_keys(info["password"])
    email_input.send_keys(info["email"])
    sign_up_button_group = driver.find_elements_by_class_name("ant-btn")[2:]
    sign_up_button_group[1].click()
    time.sleep(5)

def test_register_logout(driver):
    register_button = driver.find_element_by_id("register")
    register_button.click()
    time.sleep(2)
    sign_up_button_group = driver.find_elements_by_class_name("ant-btn")[2:]
    sign_up_button_group[0].click()

    for info in register_info:
        doRegister(driver, info)
        doLogout(driver)
    return True

def test_login_logout(driver):
    login_button = driver.find_element_by_id("login")
    login_button.click()
    time.sleep(2)
    login_button_group = driver.find_elements_by_class_name("ant-btn")[2:]
    login_button_group[0].click()
    for info in register_info:
        doLogin(driver, info)
        doLogout(driver)
    return True

def test_edit_profile(driver):
    info = register_info[0]
    doLogin(driver, info)
    user_avatar = driver.find_element_by_class_name("ant-dropdown-trigger")
    user_avatar.click()
    ActionChains(driver).move_to_element(user_avatar).perform()
    profile = driver.find_elements_by_class_name("ant-dropdown-menu-item")[0]
    profile.click()
    time.sleep(10)
    edit_profile = driver.find_element_by_id("profile_edit")
    edit_profile.click()
    time.sleep(5)
    
    username_input = driver.find_element_by_id("userForm_username")
    email_input = driver.find_element_by_id("userForm_email")
    time.sleep(5)
    username_input.clear()
    email_input.clear()
    time.sleep(5)
    username_input.send_keys(info["new_username"])
    email_input.send_keys(info["new_email"])
    button_group = driver.find_elements_by_class_name("ant-btn")[-2:]
    button_group[0].click()
    time.sleep(5)
    basic_info_username = driver.find_element_by_id("basic_info_username").text
    basic_info_email = driver.find_element_by_id("basic_info_email").text
    doLogout(driver)
    return (basic_info_username == info["new_username"]) and (basic_info_email == info["new_email"])

def test_add_collection(driver):
    info = register_info[0]
    doLogin(driver, info)
    user_avatar = driver.find_element_by_class_name("ant-dropdown-trigger")
    user_avatar.click()
    ActionChains(driver).move_to_element(user_avatar).perform()
    profile = driver.find_elements_by_class_name("ant-dropdown-menu-item")[0]
    profile.click()
    time.sleep(10)
    new_collections = driver.find_element_by_id("new_collections")
    new_collections.click()
    time.sleep(5)
    
    title_input = driver.find_element_by_id("collectionForm_title")
    title_input.clear()
    time.sleep(5)
    title_input.send_keys("Test_Collection")
    button_group = driver.find_elements_by_class_name("ant-btn")[-2:]
    button_group[0].click()
    time.sleep(5)
    collection_list = driver.find_elements_by_css_selector(".ant-list-item-meta-title>a")
    collection_list = [x.text for x in collection_list]
    return "Test_Collection" in collection_list

def test_recommendation(driver):
    sendComment = "test add comment"
    sendRecommendation = "test add recommendation"
    info = register_info[0]
    doLogin(driver, info)
    time.sleep(10)
    link = driver.find_elements_by_class_name("problem_link")
    link = link[0].click()
    time.sleep(10)
    recommendReason = driver.find_element_by_id("recommendReason")
    recommendReason.send_keys(sendRecommendation)
    submit_button = driver.find_elements_by_class_name("ant-btn")[0]
    submit_button.click()
    time.sleep(10)
    recommendation_link = driver.find_elements_by_css_selector(".ant-list-item>a")
    recommendation_title = [ele.text for ele in driver.find_elements_by_class_name("ant-list-item-meta-description")]
    for i, ele in recommendation_title:
        if ele == sendRecommendation:
            recommendation_link[i].click()
            break
    recommendation_link[0].click()
    time.sleep(10)
    comment = driver.find_element_by_id("commentContent")
    comment.send_keys(sendComment)
    submit_button = driver.find_elements_by_class_name("ant-btn")[0]
    submit_button.click()
    time.sleep(10)
    pattern = r"Re: #\d+\n"
    comment_content = [re.sub(pattern, "", ele.text) for ele in driver.find_elements_by_class_name("ant-typography")]
    doLogout(driver)
    return sendComment in comment_content


def test_add_favourite(driver):
    info = register_info[0]
    doLogin(driver, info)
    time.sleep(10)
    link = driver.find_elements_by_class_name("problem_link")
    link = link[0].click()
    time.sleep(10)
    collection_button = driver.find_element_by_id("collection")
    collection_button.click()
    time.sleep(10)
    collection_group = driver.find_elements_by_class_name("ant-radio-button-wrapper")
    collection_name = driver.find_elements_by_css_selector(".ant-radio-button-wrapper>span:last-child")
    collection_group[0].click()
    selected_collection = collection_name[0].text
    time.sleep(5)
    submit_button = driver.find_elements_by_class_name("ant-btn")[-1]
    submit_button.click()
    time.sleep(10)
    user_avatar = driver.find_element_by_class_name("ant-dropdown-trigger")
    user_avatar.click()
    ActionChains(driver).move_to_element(user_avatar).perform()
    profile = driver.find_elements_by_class_name("ant-dropdown-menu-item")[0]
    profile.click()
    time.sleep(10)
    collection_group = driver.find_elements_by_css_selector(".ant-list-item-meta-title>a")
    for ele in collection_group:
        if ele.text == selected_collection:
            ele.click()
            break
    return True



if __name__ == '__main__':
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--ignore-certificate-errors')
    driver = webdriver.Chrome(CHROME_PATH, options=chrome_options)
    driver.delete_all_cookies()

    testcases = [
            ["TEST_EDIT_PROFILE", test_edit_profile],
            ["TEST_REGISTER_LOGOUT", test_register_logout],
            ["TEST_LOGIN_LOGOUT", test_login_logout],
            ["TEST_ADD_COLLECTION", test_add_collection],
            ["TEST_RECOMMENDATION", test_recommendation],
            ["TEST_ADD_FAVOURITE", test_add_favourite],
        ]

    score = 0
    for case in testcases:
        print("=====", case[0] ,"=====")
        try:
            driver.get("localhost:8080")
            time.sleep(10)
            res = "PASS" if case[1](driver) else "FAIL"
        except:
            print("[Runtime Error in {}]".format(case[0]))
            res = 0
        print("+ {:40}: {}".format(case[0], res))
        score += res == "PASS"
    print("FINAL PASS: {}/{}".format(score, len(testcases)))

    driver.close()