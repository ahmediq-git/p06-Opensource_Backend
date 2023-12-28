use random_string::generate;

pub fn rand_string(len: usize) -> String {
    let charset = "1234567890abcdefghijklmnopqrstuvwxyz";
    generate(len, charset)
}
