-- Create a secure table for storing Supabase connection tokens
create table user_supabase_connections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  organization text not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table user_supabase_connections enable row level security;

-- Create policies
create policy "Users can only view their own connections"
  on user_supabase_connections for select
  using (auth.uid() = user_id);

create policy "Users can only insert their own connections"
  on user_supabase_connections for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own connections"
  on user_supabase_connections for update
  using (auth.uid() = user_id);

create policy "Users can only delete their own connections"
  on user_supabase_connections for delete
  using (auth.uid() = user_id);

-- Create indexes
create index user_supabase_connections_user_id_idx on user_supabase_connections(user_id);

-- Create updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_supabase_connections_updated_at
  before update on user_supabase_connections
  for each row
  execute function update_updated_at_column(); 