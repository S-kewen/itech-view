package com.boot.yuntechlifeviews.controller.system;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: skwen
 * @ClassName: SystemController
 * @Description: systemController
 * @Date: 2020-03-06
 */
@Controller

public class SystemController {
    @RequestMapping("system/addFeedback")
    public String addFeedback() {
        return "system/addFeedback";
    }

    @RequestMapping("system/messageBoard")
    public String messageBoard() {
        return "system/messageBoard";
    }
}
