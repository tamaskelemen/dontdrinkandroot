package com.junctionx.Junctionx.com.junctionx.controller;

import com.fasterxml.jackson.databind.node.ObjectNode;
import com.junctionx.Junctionx.repository.BigQueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@CrossOrigin
@Controller
public class OptimalPathController {

	@Autowired
	BigQueryRepository bigQueryRepository;

	@RequestMapping(value = "/optimal-path-date-range/{animal}/{from}/{to}", method = RequestMethod.GET)

	@ResponseBody
	public ObjectNode getMovement(@PathVariable String animal, @PathVariable String from, @PathVariable String to) {

		return bigQueryRepository.optimalPathDateRange(animal, from, to);
	}

}
