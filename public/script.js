fetch('/api/imoveis')
  .then(res => res.json())
  .then(imoveis => {
    const container = document.getElementById('imoveis');
    imoveis.forEach(imovel => {
      container.innerHTML += `
        <div>
          <img src="/uploads/${imovel.fotos[0]}" style="max-width:200px;"><br>
          <strong>${imovel.titulo}</strong><br>
          <p>${imovel.descricao}</p>
          <p>Preço: R$ ${imovel.preco.toLocaleString('pt-BR')}</p>
          <hr>
        </div>
      `;
    });
  });