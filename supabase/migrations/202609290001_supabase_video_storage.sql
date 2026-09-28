update public.lectures
set video_provider = null, video_id = null
where video_provider = 'cloudflare';

alter table public.lectures
  drop constraint if exists lectures_video_provider_check;

alter table public.lectures
  add constraint lectures_video_provider_check
  check (video_provider is null or video_provider = 'supabase');

update storage.buckets
set public = false,
    file_size_limit = 52428800,
    allowed_mime_types = array[
      'application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
      'video/mp4', 'video/webm'
    ]
where id = 'course-resources';

drop policy if exists "published lesson videos read" on storage.objects;
create policy "published lesson videos read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'course-resources'
    and exists (
      select 1
      from public.lectures l
      join public.units u on u.id = l.unit_id
      where l.video_id = name
        and l.video_provider = 'supabase'
        and l.published
        and u.published
    )
  );