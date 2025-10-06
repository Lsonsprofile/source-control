 document.getElementById('loadNews').addEventListener('click', async () => {
      const container = document.getElementById('newsContainer');
      container.innerHTML = '<p>Loading...</p>';

      const url = 'https://api.spaceflightnewsapi.net/v3/articles';

      try {
        const response = await fetch(url);
        const data = await response.json();

        container.innerHTML = '';
        data.slice(0, 10).forEach(article => {
          const card = document.createElement('div');
          card.classList.add('news-item');
          card.innerHTML = `
            <img src="${article.imageUrl || ''}" alt="news image">
            <h3>${article.title}</h3>
            <p>${article.summary || 'No description available'}</p>
            <a href="${article.url}" target="_blank">Read More</a>
          `;
          container.appendChild(card);
        });
      } catch (error) {
        container.innerHTML = '<p>Failed to load news. Please try again later.</p>';
        console.error(error);
      }
    });