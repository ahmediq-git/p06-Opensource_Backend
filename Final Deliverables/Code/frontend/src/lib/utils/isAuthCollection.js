
export const auth_collections = ['users', "user_key", "user_session", "ezbase_admin", "config", "logs", "functions"]

export const isAuthCollection = (collection) => auth_collections.includes(collection)
