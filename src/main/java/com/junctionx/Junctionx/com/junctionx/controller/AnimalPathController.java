package com.junctionx.Junctionx.com.junctionx.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.hibernate.validator.constraints.URL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.junctionx.Junctionx.repository.BigQueryRepository;

import java.util.List;

@CrossOrigin
@Controller
public class AnimalPathController {

    @Autowired
    BigQueryRepository bigQueryRepository;

    @RequestMapping(value = "/animal-path/{animal}/device/{date}", method = RequestMethod.GET)
    @ResponseBody
    public ObjectNode getMovement(@PathVariable String animal, @PathVariable String date) {

        return bigQueryRepository.animalPath(animal, date);
    }
}
