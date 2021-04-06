package com.boot.yuntechlifeviews.controller.main;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Author: skwen
 * @ClassName: MainController
 * @Description: mainController
 * @Date: 2020-03-05
 */
@Controller

public class MainController {
    @RequestMapping("/")
    public String main() {
        return "main/login";
    }

    @RequestMapping("/login")
    public String login() {
        return "main/login";
    }

    @RequestMapping("/logout")
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }
        return "main/logout";
    }

    @RequestMapping("/findPassword")
    public String findPassword() {
        return "main/findPassword";
    }

    @RequestMapping("/register")
    public String register() {
        return "main/register";
    }

    @RequestMapping("/index")
    public String index() {
        return "main/index";
    }

    @RequestMapping("/resetPassword")
    public String resetPassword() {
        return "main/resetPassword";
    }
}
