import pandas as pd, numpy as np, matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN
from geopy.distance import great_circle
from shapely.geometry import MultiPoint
from google.cloud import bigquery


def gogogo(df, client):
    coords = df.as_matrix(columns=['latitude', 'longitude'])
    kms_per_radian = 6371.0088
    epsilon = 1.5 / kms_per_radian
    db = DBSCAN(eps=epsilon, min_samples=1, algorithm='ball_tree', metric='haversine').fit(np.radians(coords))
    cluster_labels = db.labels_
    num_clusters = len(set(cluster_labels))
    clusters = pd.Series([coords[cluster_labels == n] for n in range(num_clusters)])
    def get_centermost_point(cluster):
        centroid = (MultiPoint(cluster).centroid.x, MultiPoint(cluster).centroid.y)
        centermost_point = min(cluster, key=lambda point: great_circle(point, centroid).m)
        return tuple(centermost_point)
    centermost_points = clusters.map(get_centermost_point)
    lats, lons = zip(*centermost_points)
    rep_points = pd.DataFrame({'longitude':lons, 'latitude':lats})
    rs = rep_points.apply(lambda row: df[(df['latitude']==row['latitude']) & (df['longitude']==row['longitude'])].iloc[0], axis=1)
    print(str(len(centermost_points)) + " || " + str(len(rs)))
    toinsert = []
    for r in rs.values:
        toinsert.append([r[0], r[1], r[2], r[3],r[4]])
    table = client.get_table("iotds.aggregated_bulk_data")
    error = client.insert_rows(table, toinsert)
    if error:
        print(error)
    

client = bigquery.Client(project='junctionx-257019')


query = (
    "SELECT device_id, latitude, longitude, timestamp, animal FROM `iotds.bulk_data` "
    'WHERE longitude != "NA" AND latitude != "NA" ORDER BY device_id ASC'
)

query_job = client.query(
    query,
    # Location must match that of the dataset(s) referenced in the query.
    location="US",
)  # API request - starts the query

curr = None
rows = []
for row in query_job:  # API request - fetches results
    if curr is None:
          curr = row[0]
    else:
         if curr != row[0]:
             gogogo(pd.DataFrame(rows, columns = ['device_id', 'latitude', 'longitude', 'timestamp', 'animal']) , client)
             rows = []
             curr = row[0]
             print(curr)
    rows.append([row[0],float(row[1]),float(row[2]),row[3], row[4]])   



