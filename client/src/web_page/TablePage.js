// ArticleTable.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AuthService from './AuthService'; // Import the authentication service

const API_URL = 'http://localhost:1337'; // Replace with your Strapi API URL

const ArticleTable = () => {
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/articles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const canEdit = () => {
    // Check user role or any other relevant information to determine if they can edit
    const user = AuthService.getCurrentUser();
    return user && user.role === 'staff';
  };

  const handleEdit = (articleId) => {
    if (canEdit()) {
      // Perform edit action
      console.log(`Editing article with ID ${articleId}`);
    } else {
      console.log('You do not have permission to edit');
    }
  };

  return (
    <div>
      <h2>Articles</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.title}</td>
              <td>{article.description}</td>
              <td>
                {canEdit() && (
                  <button onClick={() => handleEdit(article.id)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;
