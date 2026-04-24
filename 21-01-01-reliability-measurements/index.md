## Outline

1. <span class="highlight">What</span> is slow?
2. <span class="highlight">Why</span> is it slow?
3. Did we improve?

---

## What is slow?

- [Metabase](https://metabase.meisterlabs.com/): Request times from Snowplow<br/>
- [Skylight](https://www.skylight.io): Server request times for subset of requests<br/>
- [GCloud Dashboards](https://console.cloud.google.com/monitoring/dashboards?authuser=1&project=meisterlabs-prod): General monitoring

---

## Metabase Dashboards

- [Average Duration Overall](https://metabase.meisterlabs.com/question/6071)
- [Max Duration Overall](https://metabase.meisterlabs.com/question/6073)
- [Average Duration GQL](https://metabase.meisterlabs.com/question/6077)
- [Maximum Duration GQL](https://metabase.meisterlabs.com/question/6080)

---

## Why is it slow?

- [Skylight](): Breakdown of overall request time
- [rack-mini-profiler](https://github.com/MiniProfiler/rack-mini-profiler): Profile requests in production
- [Browser Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance): Profile website performance

---

## Skylight

- Doesn't profile all requests
- Shows lots of additional info (DB, Object Allocations)
- Can do _some_ trend analysis

---

## Rack Mini Profiler

- Adds a badge to pages to show SQL queries
- Can provide flamegraphs for execution time, memory consumption...

---

### These tools work best when <span class="highlight">used together!</span>

---

## Did we improve?

1. Compare in production using Flipper.
2. Use representative data to test your changes locally/on staging.

---

## In Production

Keep an eye on dashboards to track your changes.

Ideally, create your own dashboard to compare performance week over week!

---

## Local Data

- Useful while developing, or confirming hunches.
- Allows for quick measurements
- Not reliable as an overall benchmark.

---

## Performance Testing

- [wrk](https://github.com/wg/wrk): Load testing from the command line
- [k6](https://k6.io/): Mature load testing tool using Javascript

Don't use this on production 💣

---

```
wrk -t4 -c10 -d30s -H "Authorization:  Bearer $TOKEN" --timeout 60 --latency https://develop.meistertask.com/api/mobile/initial
```

```
Running 30s test @ https://develop.meistertask.com/api/mobile/initial
  4 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.93s   264.27ms   2.65s    85.12%
    Req/Sec     1.18      1.71    10.00     85.95%
  Latency Distribution
     50%    1.91s
     75%    2.02s
     90%    2.21s
     99%    2.49s
  121 requests in 30.04s, 26.96MB read
Requests/sec:      4.03
Transfer/sec:      0.90MB
```
