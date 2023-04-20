import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

function Blog() {
  const [posts, setPosts] = useState([]);
  // useEffect allows us to fetch data, update dom, for AJAX etc
  useEffect(() => {
    const xmlStart = new XMLHttpRequest();
    xmlStart.open('GET', '/my_blogs.xml');
    xmlStart.onload = () => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlStart.responseText, 'text/xml');
      const postElements = xmlDoc.getElementsByTagName('post');
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
      setPosts(postsArray);
      };
      xmlStart.send();
    }, []);

    return (
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h1>{post.title}</h1>
            <h3>{post.author}</h3>
            <h4>{post.date}</h4>
            <img src={post.imagePath} alt='photos'/>
            <p>{post.text}</p>
            <p>{post.body}</p>

            
          </div>
        ))}
      </div>
    );
  }

function Nav() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const xmlStart = new XMLHttpRequest();
    xmlStart.open('GET' , 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=');
    xmlStart.onload = () => {
      const jsonData = JSON.parse(xmlStart.responseText);
      setArticles(jsonData.articles);
    };
    xmlStart.send();

    const timeID = setInterval(() => {
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
    <a href='/index.html' target='blank'>Back to homepage here!</a>
      <h2>The Headlines</h2>
      <ul>
        {articles.map((article) => (
          <li key={article.title}>
            <a href={article.url} target='blank'>{article.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  
  return (
    <div className='container'>
      <header id='header'>Welcome to My Page</header>

      <div className='columns'> {/* create the columns */}
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