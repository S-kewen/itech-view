package com.boot.yuntechlifeviews.controller.express;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: skwen
 * @ClassName: ExpressController
 * @Description: controller
 * @Date: 2020-03-05
 */
@Controller

public class ExpressController {
    @RequestMapping("express/addExpressTaker")
    public String addExpressTaker() {
        return "express/addExpressTaker";
    }

    @RequestMapping("express/listExpressTaker")
    public String listExpressTaker() {
        return "express/listExpressTaker";
    }

    @RequestMapping("express/listExpressTakerIssuance")
    public String listExpressTakerIssuance() {//發單記錄
        return "express/listExpressTakerIssuance";
    }

    @RequestMapping("express/listExpressTakerReceive")
    public String listExpressTakerReceive() {//接單記錄
        return "express/listExpressTakerReceive";
    }

    @RequestMapping("express/confirmMyInfo")
    public String confirmMyInfo() {
        return "express/confirmMyInfo";
    }

    @RequestMapping("express/seeExpressTakerByReceive")
    public String seeExpressTakerByReceive() {
        return "express/seeExpressTakerByReceive";
    }

    @RequestMapping("express/seeExpressTakerByIssuance")
    public String seeExpressTakerByIssuance() {
        return "express/seeExpressTakerByIssuance";
    }

    @RequestMapping("express/goEvaluationByReceive")
    public String goEvaluationByReceive() {
        return "express/goEvaluationByReceive";
    }

    @RequestMapping("express/goEvaluationByIssuance")
    public String goEvaluationByIssuance() {
        return "express/goEvaluationByIssuance";
    }

}
