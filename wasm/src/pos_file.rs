use std::convert::TryFrom;
use std::error::Error;
use std::fs::File;
use std::io::prelude::*;
use std::io::BufReader;
use std::io::SeekFrom;

use super::read_struct_array::read_struct_array;

// this is how the data is stored in the pos file (no padding between elements, 16 bytes total)
#[repr(C)]
#[derive(Default, Debug)]
struct t_x1_y1_x2_y2_numpix1_numpix2 {
  t: u32,
  x1: u16,
  y1: u16,
  x2: u16,
  y2: u16,
  numpix1: u16,
  numpix2: u16,
}

#[derive(Default, Debug)]
pub struct PosSamp {
  x: u16,
  y: u16,
  // TODO: add directional data
}

// TODO: make swap_byte a trait, so that it can be used within the read_struct_array
// could even have a derived macro thing..though that sounds very complicated
impl t_x1_y1_x2_y2_numpix1_numpix2 {
  fn swap_bytes(&mut self) {
    self.t = self.t.swap_bytes(); // this doesn't seem to be right still in the case of t
    self.x1 = self.x1.swap_bytes();
    self.y1 = self.y1.swap_bytes();
    self.x2 = self.x2.swap_bytes();
    self.y2 = self.y2.swap_bytes();
    self.numpix1 = self.numpix1.swap_bytes();
    self.numpix2 = self.numpix2.swap_bytes();
  }
}

pub struct PosFile {
  file: File,
  pub pos_format: String,
  pub n_pos: usize,
  data_start: u64,
  header_parsed: bool,
  pub pos_data: Vec<PosSamp>,
}

impl PosFile {
  pub fn new(file: File) -> PosFile {
    PosFile {
      file: file,
      pos_format: String::new(),
      n_pos: 0,
      data_start: 0,
      header_parsed: false,
      pos_data: Vec::new(),
    }
  }

  pub fn populate_header(&mut self) -> Result<(), Box<dyn Error>> {
    let mut reader = BufReader::new(self.file);
    reader.seek(SeekFrom::Start(0))?;

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

    if self.pos_format != "t,x1,y1,x2,y2,numpix1,numpix2" {
      panic!("Missing or unrecognised pos_format");
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

    self.header_parsed = true;
    Ok(())
  }

  pub fn populate_body(&mut self) -> Result<(), Box<dyn Error>> {
    if self.header_parsed == false {
      self.populate_header();
    }
    self.file.seek(SeekFrom::Start(self.data_start));
    let mut raw_data: Vec<t_x1_y1_x2_y2_numpix1_numpix2> = read_struct_array(self.file, self.n_pos);

    for mut rec in &mut raw_data {
      rec.swap_bytes();
    }

    self.pos_data.resize_with(self.n_pos, Default::default);
    for (i, rec) in raw_data.iter().enumerate() {
      self.pos_data[i].x = rec.x1;
      self.pos_data[i].y = rec.y1;
    }
    Ok(())
  }
}
