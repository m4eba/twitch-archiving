LOG_LEVEL=trace REC_DATABASE_URL=postgres://postgres:password@10.5.0.8:5454/tw_stats2 node dist/index.js --kafkaBroker=10.5.0.8:9092 --storyboard $1
