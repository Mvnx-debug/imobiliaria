document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/properties');
    const properties = await response.json();
    
    const container = document.getElementById('properties-container');
    
    properties.forEach(property => {
      const card = document.createElement('div');
      card.className = 'col-md-4 mb-4';
      
      card.innerHTML = `
        <div class="card h-100">
          <img src="${property.images[0] || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${property.title}">
          <div class="card-body">
            <h5 class="card-title">${property.title}</h5>
            <p class="card-text">${property.description.substring(0, 100)}...</p>
            <ul class="list-group list-group-flush mb-3">
              <li class="list-group-item"><strong>Preço:</strong> R$ ${property.price.toLocaleString('pt-BR')}</li>
              <li class="list-group-item"><strong>Quartos:</strong> ${property.details.bedrooms}</li>
              <li class="list-group-item"><strong>Banheiros:</strong> ${property.details.bathrooms}</li>
              <li class="list-group-item"><strong>Área:</strong> ${property.details.area}m²</li>
            </ul>
            <a href="https://wa.me/55${property.contactPhone.replace(/\D/g, '')}?text=Olá, tenho interesse no imóvel ${property.title}" 
               class="btn btn-success w-100" target="_blank">
              <i class="bi bi-whatsapp"></i> Contato via WhatsApp
            </a>
          </div>
        </div>
      `;
      
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Erro ao carregar imóveis:', err);
  }
});