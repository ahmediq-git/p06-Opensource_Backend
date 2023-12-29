#[tokio::main]
async fn main() {
    let app = ezbase::router::get_router();
    axum::Server::bind(&"127.0.0.1:3690".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap()
}
