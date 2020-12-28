use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::str;

pub struct CutFile {
  full_file_path: String,
  pub n_clusters: u8,
  pub n_spikes: usize,
  pub name: String,
  pub cut_data: Vec<u8>,
}

impl CutFile {
  pub fn new(full_file_path: String) -> CutFile {
    CutFile {
      full_file_path: full_file_path,
      n_clusters: 0,
      n_spikes: 0,
      name: String::new(),
      cut_data: Vec::new(),
    }
  }

  pub fn populate_header(&mut self) -> Result<BufReader<File>, Box<dyn Error>> {
    let f = File::open(&self.full_file_path)?;

    let mut reader = BufReader::new(f);

    for line in reader.by_ref().lines() {
      let line_str = line?;
      let mut line_parts = line_str.split(": ");

      match line_parts.next() {
        Some("n_clusters") => self.n_clusters = line_parts.next().unwrap().parse::<u8>()?,
        Some("Exact_cut_for") => {
          let rest_of_line = &line_str["Exact_cut_for: ".len()..];
          let mut sub_parts = rest_of_line.split(" spikes: ");
          self.name = sub_parts.next().unwrap().to_string();
          self.n_spikes = sub_parts.next().unwrap().parse::<usize>()?;
          break;
        }
        _ => (),
      };
    }
    Ok(reader)
  }

  pub fn populate_body(&mut self) -> Result<(), Box<dyn Error>> {
    let reader = self.populate_header()?;

    self.cut_data.reserve_exact(self.n_spikes);

    for bytes_val in reader.split(' ' as u8) {
      let byte_array: &[u8] = &bytes_val?;
      let str_val = str::from_utf8(byte_array)?;
      self.cut_data.push(str_val.parse::<u8>()?);
    }

    Ok(())
  }
}
