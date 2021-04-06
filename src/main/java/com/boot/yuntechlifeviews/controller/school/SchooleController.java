package com.boot.yuntechlifeviews.controller.school;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @Author: skwen
 * @ClassName: SchooleController
 * @Description: controller
 * @Date: 2020-03-19
 */
@Controller

public class SchooleController {
    @RequestMapping("/school/listYuntechExpress")
    public String listYuntechExpress() {
        return "school/listYuntechExpress";
    }
}
