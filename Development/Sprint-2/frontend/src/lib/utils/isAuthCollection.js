
export const auth_collections = ['user', "user_key", "user_session", "ezbase_admin"]

export const isAuthCollection = (collection) => auth_collections.includes(collection)
