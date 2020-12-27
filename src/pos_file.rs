use std::convert::TryFrom;
use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::io::SeekFrom;

pub struct PosFile {
  full_file_path: String,
  pub pos_format: String,
  pub n_pos: usize,
  data_start: u64,
  data_end: u64,
  header_parsed: bool,
  pub pos_data: Vec<u8>,
}

impl PosFile {
  pub fn new(full_file_path: String) -> PosFile {
    PosFile {
      full_file_path: full_file_path,
      pos_format: String::new(),
      n_pos: 0,
      data_start: 0,
      data_end: 0,
      header_parsed: false,
      pos_data: Vec::new(),
    }
  }

  pub fn populate_header(&mut self) -> Result<(), Box<dyn Error>> {
    let f = File::open(&self.full_file_path).expect("cannot open pos file");
    let mut reader = BufReader::new(f);

    for line in reader.by_ref().lines() {
      let line_str = line?;
      let mut line_parts = line_str.split(" ");

      match line_parts.next() {
        Some("pos_format") => {
          self.pos_format = String::from(
            line_parts
              .next()
              .expect("pos_format line in header has key but no value"),
          )
        }
        Some("num_pos_samples") => {
          self.n_pos = line_parts
            .next()
            .expect("num_pos_samples line in header has key no value")
            .parse::<usize>()
            .expect("couldn't parse num_pos_samples from string to usize");
          break;
        }
        _ => (),
      };
    }

    let mut data_start_token = String::new();
    reader
      .by_ref()
      .take(10)
      .read_to_string(&mut data_start_token);
    if data_start_token != "data_start" {
      panic!("didn't find data_start where it was expected");
    }

    self.data_start = reader.seek(SeekFrom::Current(0))?;

    reader.seek(SeekFrom::End(-10));
    self.data_end = reader.seek(SeekFrom::Current(0))?;

    let mut data_end_token = String::new();
    reader.by_ref().read_to_string(&mut data_end_token);
    if data_end_token != "data_end\r\n" {
      panic!("didn't find data_end token at file end");
    }
    // TODO: possibly support incomplete files - we should end on the last complete sample
    // I guess we leave the rest as zeros up until n_pos, so it's clear data is missing.
    self.header_parsed = true;
    Ok(())
  }

  pub fn populate_body(&mut self) -> Result<(), Box<dyn Error>> {
    if self.header_parsed == false {
      self.populate_header();
    }

    let nbytes = usize::try_from(self.data_end - self.data_start).expect("data too large");
    let mut f = File::open(&self.full_file_path).expect("cannot open pos file");
    f.seek(SeekFrom::Start(self.data_start));
    self.pos_data.reserve_exact(nbytes);

    f.take(self.data_end - self.data_start)
      .read_to_end(&mut self.pos_data);

    Ok(())
  }
}
