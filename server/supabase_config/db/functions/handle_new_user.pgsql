begin
  insert into public.profiles (id, display_name, instagram)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'instagram'
  );
  return new;
end;