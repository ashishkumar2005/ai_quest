insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-resources',
  'course-resources',
  false,
  52428800,
  array[
    'application/pdf', 'image/png', 'image/jpeg', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm'
  ]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;