package com.boot.yuntechlifeviews.controller.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: skwen
 * @ClassName: FlowController
 * @Description: flowController
 * @Date: 2020-03-05
 */
@Controller

public class HomeController {
    @RequestMapping("/home/console")
    public String console() {
        return "home/console";
    }
}
