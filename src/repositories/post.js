let posts = [
    {
        id: 1,
        title: "Python",
        content: "You can start learning python by watching video on Yotube",
        author: "Andrii",
        category: "programming"
    },
    {
        id: 2,
        title: "What is Node.js?",
        content: "Node.js allows you to run JavaScript outside the browser",
        author: "Lera",
        category: "programming"
    },
    {
        id: 3,
        title: "My favorite game",
        content: "Dota 2 is my favorite game",
        author: "Egor",
        category: "games"
    }
]
export function getAll(category, take) {
    let result = posts
    if (category) {
        result = result.filter((post) => post.category === category)
    }
    if (take) {
        result = result.slice(0, take)
    }
    return result
}
export function getById(id) {
    return posts.find((post) => {return post["id"] == id})
}
export function addPost(post) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            posts = [...posts, post]
            resolve(post)
        }, 1000 )})
}