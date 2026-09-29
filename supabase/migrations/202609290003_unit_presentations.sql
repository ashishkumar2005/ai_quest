create table if not exists public.unit_presentations (
  unit_id integer primary key references public.units(id) on delete cascade,
  title text not null,
  storage_path text not null,
  published boolean not null default false,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz not null default now()
);

alter table public.unit_presentations enable row level security;
grant select, insert, update, delete on public.unit_presentations to authenticated;

drop policy if exists "unit presentations published read" on public.unit_presentations;
create policy "unit presentations published read" on public.unit_presentations
  for select to authenticated
  using (
    (published and exists (
      select 1 from public.units u
      where u.id = unit_id and u.published
    ))
    or public.is_admin()
  );

drop policy if exists "unit presentations admin manage" on public.unit_presentations;
create policy "unit presentations admin manage" on public.unit_presentations
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "published unit presentation files read" on storage.objects;
create policy "published unit presentation files read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'course-resources'
    and (
      public.is_admin()
      or exists (
        select 1
        from public.unit_presentations p
        join public.units u on u.id = p.unit_id
        where p.storage_path = name
          and p.published
          and u.published
      )
    )
  );

update storage.buckets
set allowed_mime_types = array(
  select distinct mime_type
  from unnest(
    coalesce(allowed_mime_types, array[]::text[])
    || array[
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]::text[]
  ) as allowed_types(mime_type)
)
where id = 'course-resources';