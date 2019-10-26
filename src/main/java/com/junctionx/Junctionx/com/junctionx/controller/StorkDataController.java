package com.junctionx.Junctionx.com.junctionx.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.junctionx.Junctionx.repository.BigQueryRepository;

import java.util.List;

@Controller
public class StorkDataController {

    @Autowired
    BigQueryRepository bigQueryRepository;

    @GetMapping("/stork-data")

    @ResponseBody
    public List<List<Double>> getMovement() {
        return bigQueryRepository.getMonthlyCoord();
    }

}
