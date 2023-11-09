#[tokio::main]
async fn main() {
    let app = ezbase::router::get_router();
    axum::Server::bind(&"0.0.0.0:3690".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap()
}
