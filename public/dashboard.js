document.getElementById('property-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado.');
    return;
  }

  const form = e.target;
  const formData = new FormData(form);

  // Montar o endereço em formato objeto
  const address = {
    street: form.street.value,
    number: form.number.value,
    neighborhood: form.neighborhood.value,
    city: form.city.value,
    state: form.state.value,
    zipCode: form.zipCode.value
  };

  // Montar detalhes em formato objeto
  const details = {
    bedrooms: form.bedrooms.value,
    bathrooms: form.bathrooms.value,
    area: form.area.value,
    garageSpaces: form.garageSpaces.value
  };

  // Anexar os campos de address e details como JSON
  formData.append('address', JSON.stringify(address));
  formData.append('details', JSON.stringify(details));

  try {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      alert('Imóvel cadastrado com sucesso!');
      form.reset();
      // Aqui você pode recarregar lista de imóveis se quiser
    } else {
      alert(data.error || 'Erro ao cadastrar imóvel.');
    }
  } catch (err) {
    alert('Erro ao conectar ao servidor.');
  }
});
