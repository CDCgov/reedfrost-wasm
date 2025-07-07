use probability::distribution::Binomial;
use probability::distribution::Discrete;

fn main() {
    let s = 10;
    let i = 1;
    let p = 0.1;
    let s_inf = 5;
    println!(
        "Probability of final size {}: {}",
        s_inf,
        pdf(s_inf, s, i, p)
    );
}

/// Probability density function for Reed-Frost epidemic final sizes
fn pdf(s_inf: usize, s: usize, i: usize, p: f64) -> f64 {
    if (i == 0) & (s_inf == s) {
        1.0
    } else if ((i == 0) & (s_inf != s)) | ((i > 0) & (s < s_inf)) {
        0.0
    } else {
        (0..=(s - s_inf))
            .map(|j| transition_probability(j, s, i, p) * pdf(s_inf, s - j, j, p))
            .sum()
    }
}

/// Reed-Frost transition probability. Given an epidemic with `s` susceptibles,
/// `i` infected, and a probability `p` of transmission per contact, what is
/// the probability that there will be `x` infected in the next generation?
fn transition_probability(x: usize, s: usize, i: usize, p: f64) -> f64 {
    Binomial::new(s, 1.0 - (1.0 - p).powi(i as i32)).mass(x)
}

#[cfg(test)]
mod tests {
    use super::*;
    use assert_approx_eq::assert_approx_eq;

    #[test]
    // Test trivial cases
    fn test_pdf_trivial() {
        // No infected and at final size
        assert_eq!(pdf(10, 10, 0, 0.5), 1.0);
        // No infected and not at final size
        assert_eq!(pdf(5, 10, 0, 0.5), 0.0);
        assert_eq!(pdf(10, 5, 0, 0.5), 0.0);
        // Fewer susceptibles left than final
        assert_eq!(pdf(10, 0, 1, 0.5), 0.0);
    }

    #[test]
    // Test specific examples
    fn test_pdf_cases() {
        assert_approx_eq!(pdf(5, 10, 1, 0.05), 0.0152347);
        assert_approx_eq!(pdf(3, 12, 2, 0.10), 0.1059780);
    }
}
