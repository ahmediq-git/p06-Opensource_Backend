#[cfg(test)]

mod test_auth_api {
    use crate::{router::get_router, utils::auth::rand_string};
    use axum::http::StatusCode;
    use axum_test::{TestServer, TestServerConfig};
    use serde_json::json;

    #[tokio::test]
    pub async fn test_signup() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let bad_password = rand_string(7);
        let good_password = rand_string(10);
        let bad_email = bad_password.clone() + "@testcom";
        let good_email = good_password.clone() + "@test.com";
        // Signup with bad password
        let response: axum_test::TestResponse = server
            .post(&"/signup_email")
            .json(&json!({
                "email": good_email,
                "password": bad_password
            }))
            .await;
        assert_eq!(response.status_code(), StatusCode::BAD_REQUEST);
        // testing email
        let response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": bad_email,
                "password": good_password
            }))
            .await;
        assert_eq!(response.status_code(), StatusCode::BAD_REQUEST);

        // Signup with good password
        let response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": good_email,
                "password": good_password
            }))
            .await;
        assert_eq!(response.status_code(), StatusCode::OK);
        let _cookie = response.cookie("session"); //check if cookie with name session is present or not

        //duplicate users
        let response = server
            .post(&"/signup_email")
            .json(&json!({
                "email": good_email,
                "password": good_password
            }))
            .await;
        assert_eq!(response.status_code(), StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    pub async fn test_signin() {
        let router = get_router();
        let config = TestServerConfig::builder().save_cookies().build();
        let server = TestServer::new_with_config(router, config).unwrap();
        let bad_password = rand_string(7);
        let good_password = rand_string(10);
        let bad_email = bad_password.clone() + "@testcom";
        let good_email = good_password.clone() + "@test.com";
        // Signup with good password
        let response: axum_test::TestResponse = server
            .post(&"/signup_email")
            .json(&json!({
                "email": good_email,
                "password": good_password
            }))
            .await;
        assert_eq!(response.status_code(), StatusCode::OK);
        let _cookie = response.cookie("session"); //check if cookie with name session is present or not

        // Login with bad password
        let response = server
            .post(&"/signin_email")
            .json(&json!({
                "email": good_email,
                "password": bad_password
            }))
            .await;
        // println!("{:?}", response);
        response.assert_status_unauthorized();

        // Login with random email
        let response = server
            .post(&"/signin_email")
            .json(&json!({
                "email": bad_email,
                "password": good_password
            }))
            .await;
        assert_eq!(response.status_code(), StatusCode::NOT_FOUND);

        // Login with good password
        let response = server
            .post(&"/signin_email")
            .json(&json!({
                "email": good_email,
                "password": good_password
            }))
            .await;
        assert_eq!(response.status_code(), StatusCode::OK);
        let _cookie = response.cookie("session"); //check if cookie with name session is present or not
    }

    // #[tokio::test]
    // pub async fn test_signout() {
    //     let router = get_router();
    //     let config = TestServerConfig::builder().save_cookies().build();
    //     let server = TestServer::new_with_config(router, config).unwrap();
    //     let good_password = rand_string(10);
    //     let good_email = good_password.clone() + "@test.com";
    //     // Signup with good password
    //     let response: axum_test::TestResponse = server
    //         .post(&"/signup_email")
    //         .json(&json!({
    //             "email": good_email,
    //             "password": good_password
    //         }))
    //         .await;
    //     assert_eq!(response.status_code(), StatusCode::OK);
    //     let _cookie = response.cookie("session"); //check if cookie with name session is present or not

    //     // Logout
    //     let response = server.get("/signout").await;
    //     assert_eq!(response.status_code(), StatusCode::OK);

    //     let response = server.get("/get_collection_names").await;
    //     assert_eq!(response.status_code(), StatusCode::UNAUTHORIZED);
    // }
}
//admin same tests
