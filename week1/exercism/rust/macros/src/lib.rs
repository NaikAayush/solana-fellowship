#[macro_export]
macro_rules! hashmap {
    () => {{
        ::std::collections::HashMap::new()
    }};
    ( $( $key:expr => $value:expr ),+  $(,)? ) => {
        {
            let mut hm = ::std::collections::HashMap::new();
            $(
                hm.insert($key, $value);
            )*
            hm
        }
    };

}

// #[macro_export]
// macro_rules! hashmap {
//     // hashmap!('a' => 3, 'b' => 11, 'z' => 32)
//     (@single $($x:tt)*) => (());
//     (@count $($rest:expr),*) => (<[()]>::len(&[$(hashmap!(@single $rest)),*]));

//     ($($key:expr => $value:expr,)+) => { hashmap!($($key => $value),+) };
//     ($($key:expr => $value:expr),*) => {
//         {
//             let _cap = hashmap!(@count $($key),*);
//             let mut _map = ::std::collections::HashMap::with_capacity(_cap);
//             $(
//                 let _ = _map.insert($key, $value);
//             )*
//             _map
//         }
//     };
// }

// fn main() {
//     println!("Hello, world!");
//     // hashmap!(3, 45, 4, 4);
//     hashmap!('a' => 3, 'b' => 11, 'z' => 32);
// }
