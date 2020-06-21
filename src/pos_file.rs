use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;

pub struct PosFile {
  full_file_path: String,
  pub pos_format: String,
  pub n_pos: usize,
}

impl PosFile {
  pub fn new(full_file_path: String) -> PosFile {
    PosFile {
      full_file_path: full_file_path,
      pos_format: String::new(),
      n_pos: 0,
    }
  }

  pub fn populate_header(&mut self) -> Result<BufReader<File>, Box<dyn Error>> {
    let f = File::open(&self.full_file_path)?;

    let mut reader = BufReader::new(f);

    for line in reader.by_ref().lines() {
      let line_str = line?;
      let mut line_parts = line_str.split(" ");

      match line_parts.next() {
        Some("pos_format") => self.pos_format = String::from(line_parts.next().unwrap()),
        Some("num_pos_samples") => {
          self.n_pos = line_parts.next().unwrap().parse::<usize>()?;
          break; // TODO: maybe we should peak at the first few bytes of the next line - does it start with "data_start"?
        }
        _ => (),
      };
    }

    Ok(reader)
  }

  pub fn populate_body(&mut self) -> Result<(), Box<dyn Error>> {
    let reader = self.populate_header().unwrap();

    //self.cut_data.reserve_exact(self.n_spikes);

    /*
    for bytes_val in reader.split(' ' as u8) {
        let byte_array: &[u8] = &bytes_val.unwrap();
        let str_val = str::from_utf8(byte_array);
        self.cut_data.push(str_val.unwrap().parse::<u8>().unwrap());
    }
    println!("cut_data len={:?}", self.cut_data.len());
    */
    Ok(())
  }
}
