use std::io::Read;

pub fn read_struct_array<T: Default, R: Read>(mut read: R, n: usize) -> Vec<T> {
  let mut res: Vec<T> = Vec::new();
  res.resize_with(n, Default::default);

  let (_, u8buffer, _) = unsafe { res.align_to_mut::<u8>() }; // this is really just a transmute, to go from a 16byte POD type to individual bytes
  read.read_exact(u8buffer);
  return res;
}
