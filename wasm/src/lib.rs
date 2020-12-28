use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

//mod cut_file;
//mod pos_file;
//mod read_struct_array;

//use pos_file::PosFile;
use web_sys::File;

#[wasm_bindgen]
pub fn load_pos(file: File){
  let msg = format!("file is: {:?}",file.name());
  alert(&msg);
    //let mut pos_file = PosFile::new(file);
  //pos_file.populate_header(); // this is redundant if you are going to read the body as well
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-game-of-life!");
}
