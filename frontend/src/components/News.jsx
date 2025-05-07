import React, { useState, useEffect } from "react";
import '../styles/styles.css';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [error, setError] = useState(null); // To store any error message

  useEffect(() => {
    fetchNews('Stock Market'); // Default fetch when the component loads
  }, []);

  const fetchNews = async (query) => {
    try {
      const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=eb1c263acfae4a35b1df5dfbbffdabac`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch, status code: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.articles && Array.isArray(data.articles)) {
        setNewsItems(data.articles);
      } else {
        setNewsItems([]);
        setError('No articles found');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.message);
      setNewsItems([]); // Clear newsItems if error occurs
    }
  };

  return (
    <>
      <main>
        <br /><br /><br /><br />
        <div className="cards-container container flex mt-20" style={{ fontSize: "15px" }}>
          {error ? (
            <p style={{ textAlign: 'center', width: '100%' }}>Error: {error}</p>
          ) : Array.isArray(newsItems) && newsItems.length > 0 ? (
            newsItems.map((item, index) => (
              <div className="card" key={index}>
                <div className="card-header">
                  <img src={item.urlToImage || 'https://png.pngtree.com/background/20220726/original/pngtree-404-error-page-not-found-picture-image_1822651.jpg'} alt="news" />
                </div>
                <div className="card-content">
                  <h3>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                  </h3>
                  <h6 className="news-source">
                    {item.source?.name} {new Date(item.publishedAt).toLocaleDateString()}
                  </h6>
                  <p>{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%' }}>No news found.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default News;
