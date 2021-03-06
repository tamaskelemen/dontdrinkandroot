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

	public String query = "SELECT * FROM iotds.temp_sensor;";
	public String storkQuery = "SELECT * FROM iotds.stork_data WHERE DATE(timestamp) = '2019-10-26';";

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

	public ObjectNode animalPath(String animal, String from, String to) {
		try {
			String pathQuery = "SELECT device_id, longitude, latitude FROM iotds.bulk_data WHERE animal LIKE '" + animal + "' AND (longitude NOT LIKE 'NA' AND latitude NOT LIKE 'NA')AND timestamp BETWEEN  '"+ from + " 00:00:00' AND '" + to + " 23:59:59'  ORDER BY timestamp ASC;";

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

				String id = row.get("device_id").getStringValue();
				Double lat = row.get("latitude").getDoubleValue();
				Double lng = row.get("longitude").getDoubleValue();

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

			return kulso;

		} catch (Exception e) {
			log.error("----------error: ", e);
		}

		return null;
	}

	public ObjectNode pathDateRange(String animal, String from, String to) {
		try {
			String pathFromTo = "SELECT device_id, longitude, latitude FROM iotds.bulk_data WHERE animal like '" + animal + "' AND (longitude NOT LIKE 'NA' AND latitude NOT LIKE 'NA') AND timestamp BETWEEN  '"+ from +" 00:00:00' AND '" + to + " 23:59:59' ORDER BY timestamp ASC;";

			QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(pathFromTo)
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

				String id = row.get("device_id").getStringValue();
				Double lat = row.get("latitude").getDoubleValue();
				Double lng = row.get("longitude").getDoubleValue();

				objectNode.put("lat", lat);
				objectNode.put("lng", lng);
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

			return kulso;

		} catch (Exception e) {
			log.error("----------error: ", e);
		}

		return null;
	}

	public List<ObjectNode> heatmapDateRange(String animal, String from, String to) {
		try {
			String heatmapFromTo = "SELECT longitude, latitude FROM iotds.bulk_data WHERE animal LIKE '" + animal + "' AND (longitude NOT LIKE 'NA' AND latitude NOT LIKE 'NA') AND timestamp BETWEEN  '"+ from +" 00:00:00' AND '" + to + " 23:59:59' ORDER BY timestamp ASC;";

			QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(heatmapFromTo)
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
			List<ObjectNode> result = new ArrayList<>();
			// Print all pages of the results.
			for (FieldValueList row : tableResult.iterateAll()) {

				ObjectNode objectNode = asd.createObjectNode();

				Double lat = row.get("latitude").getDoubleValue();
				Double lng = row.get("longitude").getDoubleValue();

				objectNode.put("lat", lat);
				objectNode.put("lng", lng);

				result.add(objectNode);
			}
			return result;

		} catch (Exception e) {
			log.error("----------error: ", e);
		}

		return null;
	}

	public List<String> getAllAnimals()
    {
        try {

            String allAnimalQuery = "SELECT animal FROM `junctionx-257019.iotds.bulk_data` GROUP BY animal;";
            QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(allAnimalQuery)
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

            List<String> result = new ArrayList<>();
            // Print all pages of the results.
            for (FieldValueList row : tableResult.iterateAll()) {
                String name = row.get("animal").getStringValue();
                result.add(name);
            }
            return result;
        } catch (Exception e) {
            log.error("----------------Error:", e);
            return null;
        }
    }

    public ObjectNode optimalPathDateRange(String animals, String from, String to) {
        try {
			String[] split = animals.split("\\+");
			StringBuilder sb = new StringBuilder();
			for (int i = 0; i < split.length; i++) {
				sb.append("'");
				sb.append(split[i]);
				sb.append("'");
				if (i != split.length - 1) {
					sb.append(", ");
				}
			}
			String joined = sb.toString();

			String pathFromTo = "SELECT device_id, longitude, latitude, animal FROM iotds.aggregated_bulk_data WHERE  animal IN (" + joined + ") AND (longitude NOT LIKE 'NA' AND latitude NOT LIKE 'NA') AND timestamp BETWEEN  '"+ from +" 00:00:00' AND '" + to + " 23:59:59' ORDER BY timestamp ASC;";

            QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(pathFromTo)
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

                String id = row.get("device_id").getStringValue();
                Double lat = row.get("latitude").getDoubleValue();
                Double lng = row.get("longitude").getDoubleValue();

                objectNode.put("lat", lat);
                objectNode.put("lng", lng);
                objectNode.put("animal", row.get("animal").getStringValue());

                ArrayNode temp = (ArrayNode) kulso.get(id);
                if (temp == null) {
                    temp = asd.createArrayNode();
                    temp.add(objectNode);
                } else {
                    temp.add(objectNode);
                }

                kulso.set(id, temp);
            }

            return kulso;

        } catch (Exception e) {
            log.error("----------error: ", e);
        }

        return null;
    }

    public List<List<Double>> getRoadData() {
		try {
			String roadQuery = "SELECT * FROM iotds.road_data;";
			QueryJobConfiguration queryConfig = QueryJobConfiguration.newBuilder(roadQuery)
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
				Double lat = row.get("latitude").getDoubleValue();
				Double lng = row.get("longitude").getDoubleValue();
				List<Double> temp = Arrays.asList(lat,lng);
				result.add(temp);
			}
			return result;
		} catch (Exception e) {
			log.error("----------------Error:", e);
			return null;
		}
	}
}
