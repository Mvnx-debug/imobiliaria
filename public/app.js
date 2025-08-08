document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Carregando imóveis...');
    
    const response = await fetch('/api/properties');
    if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
    
    const properties = await response.json();
    console.log('Imóveis recebidos:', properties);
    
    const container = document.getElementById('properties-container');
    const modal = new bootstrap.Modal(document.getElementById('propertyModal'));

    // Formata o endereço completo
    const formatAddress = (address) => {
      return `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city}/${address.state}`;
    };

    // Mostra detalhes no modal
    const showDetails = (property) => {
      document.getElementById('propertyModalLabel').textContent = property.title;
      
      document.getElementById('modalBodyContent').innerHTML = `
        <div class="row">
          <div class="col-md-6">
            ${property.images.map((img, i) => `
              <img src="${img}" class="img-fluid rounded mb-2 ${i > 0 ? 'd-none' : ''}" 
                   alt="Imagem do imóvel ${i + 1}" id="propertyImage-${i}">
            `).join('')}
            
            ${property.images.length > 1 ? `
              <div class="d-flex gap-2 mt-2">
                ${property.images.map((img, i) => `
                  <img src="${img}" class="img-thumbnail" style="width: 60px; cursor: pointer;" 
                       onclick="document.querySelectorAll('#modalBodyContent .img-fluid').forEach(el => el.classList.add('d-none'));
                                document.getElementById('propertyImage-${i}').classList.remove('d-none')">
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="col-md-6">
            <h3 class="text-primary">R$ ${property.price.toLocaleString('pt-BR')}</h3>
            <p><i class="bi bi-geo-alt"></i> ${formatAddress(property.address)}</p>
            
            <div class="d-flex flex-wrap gap-3 mb-4">
              <div class="bg-light p-2 rounded text-center" style="min-width: 80px;">
                <div class="text-muted small">Área</div>
                <div class="fw-bold">${property.details.area}m²</div>
              </div>
              <div class="bg-light p-2 rounded text-center" style="min-width: 80px;">
                <div class="text-muted small">Quartos</div>
                <div class="fw-bold">${property.details.bedrooms}</div>
              </div>
              <div class="bg-light p-2 rounded text-center" style="min-width: 80px;">
                <div class="text-muted small">Banheiros</div>
                <div class="fw-bold">${property.details.bathrooms}</div>
              </div>
              <div class="bg-light p-2 rounded text-center" style="min-width: 80px;">
                <div class="text-muted small">Vagas</div>
                <div class="fw-bold">${property.details.garageSpaces}</div>
              </div>
            </div>
            
            <h5 class="mt-3">Descrição:</h5>
            <p>${property.description}</p>
            
            <div class="d-grid gap-2 mt-4">
              <a href="https://wa.me/55${property.contactPhone.replace(/\D/g, '')}?text=Olá, tenho interesse no imóvel ${property.title} (${formatAddress(property.address)})" 
                 class="btn btn-success" target="_blank">
                <i class="bi bi-whatsapp"></i> WhatsApp
              </a>
            </div>
          </div>
        </div>
      `;
      
      modal.show();
    };

    // Renderiza os cards
    container.innerHTML = properties.map(property => `
      <div class="col-md-4 mb-4">
        <div class="card h-100 property-card" data-id="${property._id}">
          <img src="${property.images[0]}" class="card-img-top property-image" 
               style="height: 200px; object-fit: cover;" alt="${property.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${property.title}</h5>
            <p class="card-text text-muted flex-grow-1">${property.description.substring(0, 100)}...</p>
            
            <div class="mt-auto">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-primary">${property.type}</span>
                <span class="text-primary fw-bold">R$ ${property.price.toLocaleString('pt-BR')}</span>
              </div>
              
              <div class="d-flex gap-2 small text-muted">
                <span><i class="bi bi-house-door"></i> ${property.details.bedrooms} quartos</span>
                <span><i class="bi bi-geo-alt"></i> ${property.address.neighborhood}</span>
              </div>
              
              <button class="btn btn-outline-primary w-100 mt-3 details-btn" data-id="${property._id}">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Eventos de clique
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.property-card');
      const btn = e.target.closest('.details-btn');
      
      if (card || btn) {
        const propertyId = (card || btn).getAttribute('data-id');
        const property = properties.find(p => p._id === propertyId);
        if (property) showDetails(property);
      }
    });

  } catch (error) {
    console.error('Erro:', error);
    document.getElementById('properties-container').innerHTML = `
      <div class="alert alert-danger">
        <i class="bi bi-exclamation-triangle"></i> Erro ao carregar imóveis: ${error.message}
      </div>
    `;
  }
});