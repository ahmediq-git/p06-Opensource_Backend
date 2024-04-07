export const fetcher = (url) => fetch(url, {headers: {
    'Authorization': 'Bearer ' + window.localStorage.getItem('jwt').replace(/"/g, '')
}}).then((res) => res.json());
