package com.boot.yuntechlifeviews.controller.flow;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Author: skwen
 * @ClassName: FlowController
 * @Description: flowController
 * @Date: 2020-03-05
 */
@Controller

public class FlowController {
    @RequestMapping("flow/listYuntechFlow")
    public String listYuntechFlow() {
        return "flow/listYuntechFlow";
    }

    @RequestMapping("flow/listYuntechFlowSet")
    public String listYuntechFlowSet() {
        return "flow/listYuntechFlowSet";
    }

    @RequestMapping("flow/listYuntechFlowWarn")
    public String listYuntechFlowWarn() {
        return "flow/listYuntechFlowWarn";
    }

    @RequestMapping("flow/addYuntechFlowSet")
    public String addYuntechFlowSet() {
        return "flow/addYuntechFlowSet";
    }

    @RequestMapping("flow/editYuntechFlowSet")
    public String editYuntechFlowSet() {
        return "flow/editYuntechFlowSet";
    }

    @RequestMapping("flow/seeYuntechFlowRunCharts")
    public String seeYuntechFlowRunCharts() {
        return "flow/seeYuntechFlowRunCharts";
    }
}
