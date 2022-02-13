// This stub file contains items which aren't used yet; feel free to remove this module attribute
// to enable stricter warnings.
#![allow(unused)]

pub fn production_rate_per_hour(speed: u8) -> f64 {
    return speed as f64 * 221 as f64 * get_working_items(speed);
}

pub fn working_items_per_minute(speed: u8) -> u32 {
    (production_rate_per_hour(speed) / 60.0) as u32
}

fn get_working_items(speed: u8) -> f64 {
    if ((1..5).contains(&speed)) {
        return 1.0;
    }
    if ((5..9).contains(&speed)) {
        return 0.9;
    }
    if ((9..11).contains(&speed)) {
        return 0.77;
    } else {
        return 0.0;
    }
}
