-- Create a table for canvas nodes
create table if not exists nodes (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  x float not null default 0,
  y float not null default 0,
  type text default 'default', -- 'default', 'image', 'agent'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for connections (Qi Flow)
create table if not exists connections (
  id uuid default gen_random_uuid() primary key,
  source_id uuid references nodes(id) on delete cascade not null,
  target_id uuid references nodes(id) on delete cascade not null,
  label text,
  weight float default 1.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Realtime for these tables
alter publication supabase_realtime add table nodes;
alter publication supabase_realtime add table connections;
