create table recording (
  id BIGSERIAL primary key,
  start timestamptz not null,
  stop timestamptz,
  channel text not null,
  site_id text not null DEFAULT '',
  data jsonb null
);

create index recording_channel_idx on recording (channel);
create index recording_site_id_idx on recording (site_id);
create index recording_start_idx on recording (start);
create index recording_stop_idx on recording (stop);

create type file_status as enum ('downloading', 'error', 'done', 'waiting'); 
create table file (
  recording_id bigint not null,
  name text not null,
  seq integer not null,                
  time_offset decimal not null,
  duration decimal not null,
  retries smallint not null,
  datetime timestamptz not null,
  size integer not null,
  downloaded integer not null,
  hash text not null,
  status file_status,
  PRIMARY KEY(recording_id, name)
);

create index file_recording_id on file(recording_id);
create index file_name_idx on file (name);
create index file_seq_idx on file (seq);
create index file_status on file (status);

create table storyboard (
  recording_id bigint not null,
  index smallint not null,
  first_sequence int not null,
  time_offset numeric not null,
  interval smallint not null,
  rows smallint not null,
  columns smallint not null,
  slug text not null,
  data jsonb not null,
  PRIMARY KEY(recording_id, index)
);

create index storyboard_time_offset_idx on storyboard(time_offset);
create index storyboard_slug_idx on storyboard(slug);

create table transcript (
  id BIGSERIAL primary key,
  recording_id bigint not null,
  transcript text not null,
  total_start integer not null,
  total_end integer not null,
  segment_sequence integer not null,
  audio_start integer not null,
  audio_end integer not null,
  confidence real not null,
  created timestamptz not null,
  words jsonb not null
);

create index transcribe_recording_id_idx on transcript (recording_id);
create index transcribe_total_start_idx on transcript (total_start);
create index transcribe_total_end_idx on transcript (total_end);

create table chat_message (
  id uuid primary key,
  channel text not null,
  username text not null,
  message text not null,
  command text not null,
  time timestamptz not null,
  data jsonb not null,
  emotes jsonb not null
);

create index chat_message_channel_idx on chat_message (channel);
create index chat_message_username_idx on chat_message (username);
create index chat_message_time_idx on chat_message (time);
create index chat_message_message_idx on chat_message using GIN(to_tsvector('english',message));

create type emote_source as enum ('twitch','bttv','ffz','7tv'); 
create table chat_emote (
  id text not null,
  source emote_source not null,
  name text not null,
  ext text not null,
  data jsonb not null,
  primary key(id,source)
);

create index chat_emote_name_idx on chat_emote (name);

create table chat_message_emote (
  message_id uuid not null,
  emote_id uuid not null,
  emote_source uuid not null,
  start_idx integer not null,
  end_idx integer not null,
  primary key(message_id,emote_id,emote_source,start_idx)
);

create table clips (
  id text primary key,
  created_at timestamptz not null,
  last_update timestamptz not null,
  broadcaster_id text not null,
  broadcaster_name text not null,
  creator_id text not null,
  creator_name text not null,
  title text not null,
  video_id text not null,
  video_offset int not null,
  thumbnail_url text not null,      
  view_count int not null,
  duration decimal not null,
  online boolean not null,
  data jsonb null
);

create index clips_created_at on clips (created_at);
create index clips_broadcaster_id on clips (broadcaster_id);
create index clips_creator_id on clips (creator_id);
create index clips_video_id on clips (video_id);
create index clips_title on clips (title);
create index clips_online on clips (online);

create table clips_views (
  id text not null,
  date timestamptz not null,
  view_count int not null,
  PRIMARY KEY(id,view_count)
);

create index clips_views_date on clips_views (date);