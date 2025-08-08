let loadProperties;

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const propertyForm = document.getElementById('property-form');
  const propertyModal = new bootstrap.Modal(document.getElementById('propertyModal'));

  if (!propertyForm) {
    console.error('Formulário com ID "property-form" não encontrado.');
    return;
  }

  loadProperties = async function () {
    try {
      const response = await fetch('/api/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao carregar imóveis');
      }

      const properties = await response.json();
      renderProperties(properties);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      showError(error.message || 'Erro ao carregar imóveis');
    }
  };

  loadProperties();

  propertyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const propertyId = document.getElementById('property-id').value;
    const isEdit = !!propertyId;

    try {
      const requiredFields = {
        'title': 'Título',
        'price': 'Preço',
        'description': 'Descrição',
        'type': 'Tipo',
        'street': 'Rua',
        'number': 'Número',
        'neighborhood': 'Bairro',
        'city': 'Cidade',
        'state': 'Estado',
        'zipCode': 'CEP',
        'bedrooms': 'Quartos',
        'bathrooms': 'Banheiros',
        'area': 'Área'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([field]) => !document.getElementById(field).value.trim())
        .map(([_, name]) => name);

      if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando:\n${missingFields.join('\n')}`);
      }

      const formData = new FormData();
      formData.append('title', document.getElementById('title').value.trim());
      formData.append('description', document.getElementById('description').value.trim());
      formData.append('type', document.getElementById('type').value);
      formData.append('price', parseFloat(document.getElementById('price').value));
      formData.append('status', document.getElementById('status').value || 'disponivel');
      formData.append('contactPhone', document.getElementById('contactPhone').value.trim());

      formData.append('address', JSON.stringify({
        street: document.getElementById('street').value.trim(),
        number: document.getElementById('number').value.trim(),
        neighborhood: document.getElementById('neighborhood').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        zipCode: document.getElementById('zipCode').value.trim()
      }));

      formData.append('details', JSON.stringify({
        bedrooms: parseInt(document.getElementById('bedrooms').value),
        bathrooms: parseInt(document.getElementById('bathrooms').value),
        area: parseInt(document.getElementById('area').value),
        garageSpaces: parseInt(document.getElementById('garageSpaces').value)
      }));

      const imageInput = document.querySelector('input[name="newImages"]');
      if (imageInput && imageInput.files.length > 0) {
        for (let i = 0; i < imageInput.files.length; i++) {
          formData.append('images', imageInput.files[i]);
        }
      }

      const url = isEdit ? `/api/properties/${propertyId}` : '/api/properties';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Sucesso:', result);

      await loadProperties();
      propertyModal.hide();
      propertyForm.reset();
      showAlert('Imóvel salvo com sucesso!', 'success');

    } catch (error) {
      console.error('Erro no formulário:', error);
      showAlert(error.message, 'danger');
    }
  });
});

function renderProperties(properties) {
  const container = document.getElementById('properties-container');
  container.innerHTML = '';

  properties.forEach(property => {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';

    card.innerHTML = `
      <div class="card h-100">
        <img src="${property.images?.[0] || 'sem-imagem.jpg'}" class="card-img-top" alt="${property.title}">
        <div class="card-body">
          <h5 class="card-title">${property.title}</h5>
          <p class="card-text">${property.description}</p>
          <p><strong>Preço:</strong> R$ ${property.price.toLocaleString('pt-BR')}</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-primary btn-sm edit-btn" data-id="${property._id}">Editar</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${property._id}">Excluir</button>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const propertyId = btn.getAttribute('data-id');
      const response = await fetch(`/api/properties/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        showError('Erro ao carregar o imóvel para edição.');
        return;
      }

      const property = await response.json();

      document.getElementById('property-id').value = property._id;
      document.getElementById('title').value = property.title;
      document.getElementById('description').value = property.description;
      document.getElementById('type').value = property.type;
      document.getElementById('price').value = property.price;
      document.getElementById('status').value = property.status || 'disponivel';
      document.getElementById('contactPhone').value = property.contactPhone || '';

      document.getElementById('street').value = property.address?.street || '';
      document.getElementById('number').value = property.address?.number || '';
      document.getElementById('neighborhood').value = property.address?.neighborhood || '';
      document.getElementById('city').value = property.address?.city || '';
      document.getElementById('state').value = property.address?.state || '';
      document.getElementById('zipCode').value = property.address?.zipCode || '';

      document.getElementById('bedrooms').value = property.details?.bedrooms || '';
      document.getElementById('bathrooms').value = property.details?.bathrooms || '';
      document.getElementById('area').value = property.details?.area || '';
      document.getElementById('garageSpaces').value = property.details?.garageSpaces || '';

      const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
      modal.show();
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const propertyId = btn.getAttribute('data-id');
      const confirmDelete = confirm('Tem certeza que deseja excluir este imóvel?');
      if (!confirmDelete) return;

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        showError('Erro ao excluir o imóvel.');
        return;
      }

      await loadProperties();
    });
  });
}

function showError(message) {
  alert(message);
}

function showAlert(message, type = 'info') {
  const alertPlaceholder = document.getElementById('alert-container');
  if (!alertPlaceholder) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    </div>
  `;

  alertPlaceholder.appendChild(wrapper);

  setTimeout(() => {
    wrapper.remove();
  }, 5000);
}
