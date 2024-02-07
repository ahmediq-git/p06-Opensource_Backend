#[cfg(test)]
pub mod test_logs_api {
    use crate::router::get_router;
    use axum_test::{TestServer, TestServerConfig};
    use ejdb::bson::ordered::OrderedDocument;
    #[tokio::test]
    pub async fn test_logs() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let initial_log_response = server.get(&"get_logs").await.json::<Vec<OrderedDocument>>();
        let second_log_response = server.get(&"get_logs").await.json::<Vec<OrderedDocument>>();
        assert!(second_log_response.len() > initial_log_response.len())
    }
}
