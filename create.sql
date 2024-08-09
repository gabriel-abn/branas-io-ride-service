DROP SCHEMA IF EXISTS app cascade;

CREATE SCHEMA app;

CREATE TABLE app.ride (
	ride_id VARCHAR(255) NOT NULL,
	passenger_id VARCHAR(255) NOT NULL,
	driver_id VARCHAR(255),
	status TEXT NOT NULL,
	fare NUMERIC NOT NULL,
	distance NUMERIC NOT NULL,
	from_lat NUMERIC NOT NULL,
	from_long NUMERIC NOT NULL,
	to_lat NUMERIC NOT NULL,
	to_long NUMERIC NOT NULL,
	request_date TIMESTAMP NOT NULL,
	--
	PRIMARY KEY (ride_id)
);