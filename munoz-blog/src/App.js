import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

function Blog() {
  //posts stores all blog posts, like a DB for the assignment. currentPost is for the one that's clicked
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  // useEffect allows us to fetch data, update dom, for AJAX etc
  // The arrow function => is a faster way to call a function in a way. Left side is input, right side is output of function. Trial and error to figure this out.
  useEffect(() => {
    const xmlStart = new XMLHttpRequest();
    xmlStart.open('GET', '/my_blogs.xml');
    xmlStart.onload = () => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStart.responseText, 'text/xml');
      const postElements = xmlDoc.getElementsByTagName('post');
      //Turn postElements into an array, making it easier to show
      const postsArray = Array.from(postElements).map(postElement => ({
        id: postElement.getAttribute('id'),
        date: postElement.getElementsByTagName('date')[0].textContent,
        author: postElement.getElementsByTagName('author')[0].textContent,
        title: postElement.getElementsByTagName('title')[0].textContent,
        imagePath: postElement.getElementsByTagName('image_path')[0].textContent,
        summary: postElement.getElementsByTagName('summary')[0].textContent,
        text: postElement.getElementsByTagName('text')[0].textContent,
        body: postElement.getElementsByTagName('body')[0].textContent,
      }));
      // Now the posts are set with the data that's been Arrayed
      setPosts(postsArray);
      };
      xmlStart.send();
    }, []);

    return (
      // The ? means to show full post if it's there. The : means to show the list of Blog Posts
      <div>
        {currentPost ? (
          <div>
            <h1>{currentPost.title}</h1>
            <h3>{currentPost.author}</h3>
            <h4>{currentPost.date}</h4>
            <img src={currentPost.imagePath} alt='A unique image' />
            <p>{currentPost.body}</p>
            <button onClick={() => setCurrentPost(null)}>Back to Home</button>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id}>
              <h1><a href='#' onClick={() => setCurrentPost(post)}>{post.title}</a></h1>
              <h3>{post.author}</h3>
              <h4>{post.date}</h4>
              <img src={post.imagePath} alt = 'Blog Photo here' />
              <p>{post.text}</p>
            </div>
          ))
        )}
        </div>
    );
  }
function Nav() {
  const [articles, setArticles] = useState([]);
// Similar HttPRequest to get the News articles. Better than fetch for me.
  useEffect(() => {
    const xmlStart = new XMLHttpRequest();
    xmlStart.open('GET' , 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=');
    xmlStart.onload = () => {
      const jsonData = JSON.parse(xmlStart.responseText);
      setArticles(jsonData.articles);
    };
    xmlStart.send();

    const timeID = setInterval(() => {
      // Console log is self-check to see if the page updates and it does.
      console.log('Updating the news');
      xmlStart.open('GET' , 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=');
      xmlStart.send();
    }, 60000);

    return () => {
      clearInterval(timeID);
    };
  }, []);

  return (
    <div>
      <h2>The Headlines</h2>
      <ul>
        {articles.slice(0, 6).map((article) => (
          <li key={article.title}>
            <a href={article.url} target='blank'>{article.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  // This would render the App when the info is passed to Index.js, which shows up on index.html
  return (
    <div className='container'>
      <header id='header'>Welcome to My Page</header>

      <div className='columns'> {/* create the columns for the page */}
        <div className='nav'>
        <Nav />
        </div>
        <div className='main'>
        <Blog />
        </div>

        <footer>@Munoz-Blog. Hope you liked it.</footer>
      </div>
    </div>
  );
}