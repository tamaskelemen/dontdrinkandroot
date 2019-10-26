package com.junctionx.Junctionx.com.junctionx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.junctionx.Junctionx.repository.BigQueryRepository;

import java.util.List;

@Controller
public class HeatmapDateRangeController {

    @Autowired
    BigQueryRepository bigQueryRepository;

    @RequestMapping(value = "/heatmap-date-range/{animal}/{from}/{to}", method = RequestMethod.GET)

    @ResponseBody
    public List<List<Double>> getMovement(@PathVariable String animal, @PathVariable String from, @PathVariable String to) {

        return bigQueryRepository.heatmapDateRange(animal, from, to);
    }

}
