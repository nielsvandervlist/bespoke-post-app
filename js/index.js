// POST APP

//GET
fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(json => showPosts(json))
  .catch(error => console.log(error))

//POST
document.addEventListener('click', (e) => {
  e.preventDefault()
  if(e.target && e.target.className == 'post'){

  let userID = document.getElementById('userid').value
  let title = document.getElementById('title').value
  let description = document.getElementById('description').value

  fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    userId: userID,
    id: 1,
    title: title,
    body: description,
  }),
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((json) => createCells(json))
  .catch(error => console.log(error))
  }
})

// UPDATE
// Cant update created post because post is not really submitted
// See: https://jsonplaceholder.typicode.com/guide/ under creating a resource
document.addEventListener('click', (e) => {
  if(e.target && e.target.className == 'edit'){

    const obj = clickedPost(e)
    const {0: userId, 1: id, 2: title, 3: body, 4: edit} = obj

    document.querySelector('legend').innerHTML = `Post ID ${id}`
    document.getElementById('title').value = title
    document.getElementById('description').value = body
    document.querySelector('.post').className = "update"
    document.querySelector('p').innerHTML = "Update post by clicking 'Create Post'"

    e.stopPropagation()

    document.querySelector('#submit-form').addEventListener('click', function(){

      const title = document.getElementById('title').value;
      const body = document.getElementById('description').value

      fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: id,
          userId: userId,
          title: title,
          body: body,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        },
      })
        .then((response) => response.json())
        .then((json) => updatePost(json, e))
        .catch(error => console.log(error))
    })
  }
})

//DELETE
document.addEventListener('click', (e) => {
  if(e.target && e.target.className == 'delete'){
    let removePost = e.target.closest('tr')
    const obj = clickedPost(e)
    const {0: userId, 1: id, 2: title, 3: body} = obj

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(removePost.parentNode.removeChild(removePost))
      .catch(error => console.log(error))
  }
})

//Create table
const table = document.createElement("table")
const header = table.createTHead()
let row = table.insertRow(-1)
let keys = [];

//Show all posts
function showPosts(json){
  json.forEach(post => {
    post.edit = "<button class='edit'>Edit</button>"
    post.delete = "<button class='delete'>Delete</button>"
    for(const [key] of Object.entries(post)) {
      keys.push(key)
    }
  })
  createHeaders(keys)
  json.forEach(post => {
    createCells(post)
  })
}

// Create table headers
function createHeaders(keys){
  const thead = keys.slice(0, 4)
  const headrow = header.insertRow(-1)
  thead.forEach(element => {
    const th = document.createElement('th')
    th.innerHTML = element
    headrow.appendChild(th)
  })
}

// Create cells
function createCells(post){
  row = table.insertRow(-1)
  post.edit = "<button class='edit'>Edit</button>"
  post.delete = "<button class='delete'>Delete</button>"
  for(const [key, value] of Object.entries(post)) {
    const td = row.insertCell(-1)
    td.innerHTML = value;
  }
}

//Update posts in table
function updatePost(post, e){
  const update = e.target.closest('tr')
  update.innerHTML = ''
  post.edit = "<button class='edit'>Edit</button>"
  post.delete = "<button class='delete'>Delete</button>"
  for(let [key, value] of Object.entries(post)){
    let td = document.createElement('td')
    if(key < 3){
      value = value.toString()
      const textNode = document.createTextNode(value)
      td.appendChild(textNode)
    }else{
      td.innerHTML = value
    }    
    update.appendChild(td)
  }
  document.getElementById('addPost').reset()
  document.querySelector('legend').innerHTML = 'Create Post'
  document.querySelector('.update').className = "post"
  document.querySelector('p').innerHTML = "New posts appear as last"
}

//Filter posts
//Cant really get new made posts from API because its not really sending anything
// See: https://jsonplaceholder.typicode.com/guide/ under creating a resource
document.getElementById('submit-filter').addEventListener('click', () => {
  const filterText = document.getElementById('filter-text').value;
  fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(json => showFilter(json, filterText))
  .catch(error => console.log(error))
})

// Filters on userId
function showFilter(data, text){
  if(text){
    document.querySelector('tbody').innerHTML = ''
    document.querySelector('thead').innerHTML = ''
    const filterData = data.filter(value => value.userId == text)
    showPosts(filterData)
  }
}

//Get clicked post for edit and delete
function clickedPost(e){
  let post = {}
  let postArr = [];
  let clickedPost = e.target.closest('tr')
  clickedPost = clickedPost.children
  for(let value of clickedPost){
    postArr.push(value.innerHTML)
  }
  const obj = Object.assign(post, postArr)
  return obj;
}

//Append table
const container = document.getElementById('posts')
container.innerHTML = ''
container.appendChild(table)

