use wasm_bindgen::prelude::*;
mod model;

#[wasm_bindgen]
pub fn run() -> f64 {
    let s = 10;
    let i = 1;
    let p = 0.1;
    let s_inf = 5;
    model::pdf(s_inf, s, i, p)
}
