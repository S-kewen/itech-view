package com.boot.yuntechlifeviews.controller.user;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: skwen
 * @ClassName: UserController
 * @Description: userController
 * @Date: 2020-03-05
 */
@Controller

public class UserController {
    @RequestMapping("/user/userIndex")
    public String userIndex() {
        return "user/userIndex";
    }

    @RequestMapping("/user/modifyInfo")
    public String modifyInfo() {
        return "user/modifyInfo";
    }

    @RequestMapping("/user/modifyPassword")
    public String modifyPassword() {
        return "user/modifyPassword";
    }

    @RequestMapping("/user/listLoginRecord")
    public String listLoginRecord() {
        return "user/listLoginRecord";
    }

    @RequestMapping("/user/listTransaction")
    public String listTransaction() {
        return "user/listTransaction";
    }

    @RequestMapping("/user/listMessage")
    public String listMessage() {
        return "user/listMessage";
    }

    @RequestMapping("/user/certification")
    public String certification() {
        return "user/certification";
    }

    @RequestMapping("/user/recharge")
    public String recharge() {
        return "user/recharge";
    }

    @RequestMapping("/user/activationUser")
    public String activationUser() {
        return "user/activationUser";
    }
    @RequestMapping("/user/bindingLine")
    public String bindingLine() {
        return "user/bindingLine";
    }
}
