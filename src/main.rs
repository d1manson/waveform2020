mod cut_file;
mod pos_file;
mod read_struct_array;

use cut_file::CutFile;
use pos_file::PosFile;

const FILE_BASE: &str = "sample-data/2241 2015-04-03 3";

fn main() -> std::io::Result<()> {
  let filename = format!("{}{}", FILE_BASE, "_8.cut");
  println!("filename={:?}", filename);
  let mut cut_file = CutFile::new(filename);
  cut_file.populate_header(); // this is redundant if you are going to read the body as well
  cut_file.populate_body();

  /*
  println!(
    "n_clusters is {:?}, n_spikes is {:?}, name is {:?}, and cut_data len={:?}",
    cut_file.n_clusters,
    cut_file.n_spikes,
    cut_file.name,
    cut_file.cut_data.len()
  );
  */

  let filename = format!("{}{}", FILE_BASE, ".pos");
  println!("filename={:?}", filename);
  let mut pos_file = PosFile::new(filename);
  pos_file.populate_header(); // this is redundant if you are going to read the body as well
  pos_file.populate_body();

  println!(
    "loaded pos file. pos_format={:?}, n_pos={:?}, first_samp={:?}, second_samp={:?}, last_samp={:?}",
    pos_file.pos_format,
    pos_file.n_pos,
    pos_file.pos_data[0],
    pos_file.pos_data[1],
    pos_file.pos_data[pos_file.n_pos - 1]
  );
  Ok(())
}
