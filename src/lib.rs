use wasm_bindgen::prelude::*;
mod model;

#[wasm_bindgen]
pub fn run(s_inf: usize, s: usize, i: usize, p: Option<f64>) -> f64 {
    model::pdf(s_inf, s, i, p.unwrap_or(0.1))
}
