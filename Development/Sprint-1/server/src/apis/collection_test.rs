#[cfg(test)]
mod test_doc_api {
    use crate::{router::get_router, utils::auth::rand_string};
    use axum_test::{TestServer, TestServerConfig};
    use ejdb::bson::ordered::OrderedDocument;
    use serde_json::json;

    #[tokio::test]
    pub async fn test_collection() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let rand = rand_string(8);
        let email = rand.clone() + "@test.com";
        let _response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": email,
                "password": rand
            }))
            .await;

        //wrong field
        let response = server
            .post(&"/create_collection")
            .json(&json!({
                "name": "test_collection",
            }))
            .await;
        response.assert_status_not_ok();
        //create collection
        let response = server
            .post(&"/create_collection")
            .json(&json!({
                "collection_name": "test_collection",
            }))
            .await;
        let create_resp = response.json::<String>();
        assert_eq!(create_resp, "Collection Created!");
        //get docs in test collection
        let response = server
            .get("/get_all_docs/test_collection")
            .await
            .json::<Vec<OrderedDocument>>();
        assert_eq!(response.len(), 0);
        //get names of collections
        let response = server.get("/get_collection_names").await;
        let new_collections = response.json::<Vec<String>>();
        assert!(new_collections.contains(&"test_collection".to_string()));

        //delete collection
        let response = server
            .delete("/delete_collection")
            .json(&json!({ "collection_name": "test_collection", "delete_all_data": true }))
            .await;
        let del_resp = response.json::<String>();
        assert_eq!(del_resp, "Collection Deleted!");
    }
}
