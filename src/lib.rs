use wasm_bindgen::prelude::*;
mod model;

#[wasm_bindgen]
pub fn pmf(s_inf: usize, s: usize, i: usize, p: f64) -> f64 {
    model::pmf(s_inf, s, i, p)
}

#[wasm_bindgen]
pub fn trajectory(s0: usize, i0: usize, p: f64, seed: usize) -> Vec<usize> {
    model::trajectory(s0, i0, p, seed as u64)
}
