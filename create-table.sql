
create table task (
  id BIGSERIAL primary key,
  group_id text not null,
  task text not null,
  dependencies text[] not null,
  started timestamptz null,
  completed timestamptz null,  
  data jsonb not null
);

create index on task(group_id);
create index on task(task);
create index on task(started);
create index on task(completed);


create table retry_log (
  id BIGSERIAL primary key,
  topic text not null,
  time timestamptz not null,
  data jsonb not null
);

create index retry_log_topic_idx on retry_log(topic);
create index retry_log_time_idx on retry_log(time);
