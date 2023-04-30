
create table storyboard (
  id BIGSERIAL primary key,
  name text not null,
  recording_id bigint not null,
  interval smallint not null,
  rows smallint not null,
  columns smallint not null,
  width int not null,
  height int not null,
  data jsonb not null
);

create index on storyboard(name);
create index on storyboard(recording_id);

create table storyboard_file (
  id BIGSERIAL primary key,
  storyboard_id bigint not null,
  index smallint not null,
  first_sequence int not null,
  first_screenshot int not null,
  length int not null,
  time_offset numeric not null,  
  slug text not null,  
  data jsonb not null
);

create index on storyboard_file(storyboard_id);
create index on storyboard_file(time_offset);
create index on storyboard_file(slug);


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
