CREATE TABLE table_name
(
    `date_time` DateTime,
    `big_id` UInt64,
    `lowcard_string` LowCardinality(String),
    `mid_id` UInt32,
    `array_lowcard_string` Array (LowCardinality (String))
)
ENGINE = MergeTree PARTITION BY toYYYYMMDD(date_time) ORDER BY date_time TTL date_time + toIntervalMonth(12);
