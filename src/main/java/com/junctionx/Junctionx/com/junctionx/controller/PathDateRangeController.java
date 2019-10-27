package com.junctionx.Junctionx.com.junctionx.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.hibernate.validator.constraints.URL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.junctionx.Junctionx.repository.BigQueryRepository;

import java.util.List;

@Controller
@CrossOrigin
public class PathDateRangeController {

    @Autowired
    BigQueryRepository bigQueryRepository;

    @RequestMapping(value = "/path-date-range/{animal}/{from}/{to}", method = RequestMethod.GET)

    @ResponseBody
    public ObjectNode getMovement(@PathVariable String animal, @PathVariable String from, @PathVariable String to) {

        return bigQueryRepository.pathDateRange(animal, from, to);
    }

}
