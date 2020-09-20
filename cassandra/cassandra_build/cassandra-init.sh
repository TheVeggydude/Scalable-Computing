CQL="""CREATE KEYSPACE "household" WITH replication = {'class':'SimpleStrategy', 'replication_factor':3}; USE household; CREATE TABLE heaters(id text, model text, t int, ts text, wattage float, temperature float, primary key(id, ts)) WITH COMPACTION = { 'class': 'TimeWindowCompactionStrategy', 'compaction_window_unit': 'DAYS', 'compaction_window_size': 1}; CREATE TABLE lamps(id text, model text, t int, ts text, wattage float, lumen float, primary key(id, ts)) WITH COMPACTION = { 'class': 'TimeWindowCompactionStrategy', 'compaction_window_unit': 'DAYS', 'compaction_window_size': 1}; CREATE TABLE vacuums(id text, model text, t int, ts text, wattage float, suction float, primary key(id, ts)) WITH COMPACTION = { 'class': 'TimeWindowCompactionStrategy', 'compaction_window_unit': 'DAYS', 'compaction_window_size': 1}; CREATE TABLE predictions(id text, deltat float, primary key(id)) WITH COMPACTION = { 'class': 'TimeWindowCompactionStrategy', 'compaction_window_unit': 'DAYS', 'compaction_window_size': 1};"""

until echo $CQL | cqlsh; do
  echo "cqlsh: Cassandra is unavailable to initialize - will retry later"
  sleep 2
done &

exec /docker-entrypoint.sh "$@"
