package com.junctionx.Junctionx.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.cloud.bigquery.BigQuery;
import com.google.cloud.bigquery.FieldValueList;
import com.google.cloud.bigquery.Job;
import com.google.cloud.bigquery.JobId;
import com.google.cloud.bigquery.JobInfo;
import com.google.cloud.bigquery.QueryJobConfiguration;
import com.google.cloud.bigquery.TableResult;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Repository
@NoArgsConstructor
@Slf4j
public class BigQueryRepository {

	@Autowired
	BigQuery bigQuery;

	public String query = "SELECT * FROM iotds.temp_sensor LIMIT 1000;";
	public String storkQuery = "SELECT * FROM iotds.stork_data WHERE DATE(_PARTITIONTIME) = '2019-10-26' LIMIT 1000;";

	public List<List<Double>> getCoordinates() {
		try {
			QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(query)
					.setUseLegacySql(false).build();

			JobId jobId = JobId.of(UUID.randomUUID().toString());
			Job queryJob = bigQuery.create(JobInfo.newBuilder(queryConfig).setJobId(jobId).build());

			queryJob = queryJob.waitFor();

			// Check for errors
			if (queryJob == null) {
				throw new RuntimeException("Job no longer exists");
			} else if (queryJob.getStatus().getError() != null) {
				// You can also look at queryJob.getStatus().getExecutionErrors() for all
				// errors, not just the latest one.
				throw new RuntimeException(queryJob.getStatus().getError().toString());
			}

			// Get the results.
			TableResult tableResult = queryJob.getQueryResults();

			List<List<Double>> result = new ArrayList<>();
			// Print all pages of the results.
			for (FieldValueList row : tableResult.iterateAll()) {
				Double lat = row.get("lat").getDoubleValue();
				Double lng = row.get("lng").getDoubleValue();
				List<Double> temp = Arrays.asList(lat,lng);
				result.add(temp);
			}
			return result;
		} catch (Exception e) {
			log.error("----------------Error:", e);
			return null;
		}
	}

	public List<List<Double>> getMonthlyCoord() {
		try {
			QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(storkQuery)
					.setUseLegacySql(false).build();

			JobId jobId = JobId.of(UUID.randomUUID().toString());
			Job queryJob = bigQuery.create(JobInfo.newBuilder(queryConfig).setJobId(jobId).build());

			queryJob = queryJob.waitFor();

			// Check for errors
			if (queryJob == null) {
				throw new RuntimeException("Job no longer exists");
			} else if (queryJob.getStatus().getError() != null) {
				// You can also look at queryJob.getStatus().getExecutionErrors() for all
				// errors, not just the latest one.
				throw new RuntimeException(queryJob.getStatus().getError().toString());
			}

			// Get the results.
			TableResult tableResult = queryJob.getQueryResults();

			List<List<Double>> result = new ArrayList<>();
			// Print all pages of the results.
			for (FieldValueList row : tableResult.iterateAll()) {

				Double lat = row.get("location_lat").getDoubleValue();
				Double lng = row.get("location_long").getDoubleValue();
				List<Double> temp = Arrays.asList(lat,lng);
				result.add(temp);
			}
			return result;
		} catch (Exception e) {
			log.error("----------------Error: ", e);
			return null;
		}
	}

	public ObjectNode animalPath(String animal, String date) {
		try {
			String pathQuery = "SELECT individual_local_identifier, location_long, location_lat FROM iotds." + animal + "_data WHERE (location_long NOT LIKE 'NA' AND location_lat NOT LIKE 'NA') AND timestamp BETWEEN  '"+ date +" 00:00:00' AND '" + date + " 23:59:59' ORDER BY timestamp ASC LIMIT 1000";

			QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(pathQuery)
					.setUseLegacySql(false).build();

			JobId jobId = JobId.of(UUID.randomUUID().toString());
			Job queryJob = bigQuery.create(JobInfo.newBuilder(queryConfig).setJobId(jobId).build());

			queryJob = queryJob.waitFor();

			// Check for errors
			if (queryJob == null) {
				throw new RuntimeException("Job no longer exists");
			} else if (queryJob.getStatus().getError() != null) {
				// You can also look at queryJob.getStatus().getExecutionErrors() for all
				// errors, not just the latest one.
				throw new RuntimeException(queryJob.getStatus().getError().toString());
			}

			// Get the results.
			TableResult tableResult = queryJob.getQueryResults();
			ObjectMapper asd = new ObjectMapper();

			//ArrayNode result = asd.createArrayNode();
			// Print all pages of the results.
			ObjectNode kulso = asd.createObjectNode();

			for (FieldValueList row : tableResult.iterateAll()) {
				ObjectNode objectNode = asd.createObjectNode();


				String id = row.get("individual_local_identifier").getStringValue();
				Double lat = row.get("location_lat").getDoubleValue();
				Double lng = row.get("location_long").getDoubleValue();

				objectNode.put("lat", lat);
				objectNode.put("lng", lng);
				//objectNode.put("timestamp", timestamp);
				objectNode.put("animal", animal);

				ArrayNode temp = (ArrayNode) kulso.get(id);
						if (temp == null) {
							temp = asd.createArrayNode();
							temp.add(objectNode);
						} else {
							temp.add(objectNode);
						}



				kulso.set(id, temp);

			}
			//result.add(kulso);

			return kulso;

		} catch (Exception e) {
			log.error("----------error: ", e);
		}

		return null;
	}

}
