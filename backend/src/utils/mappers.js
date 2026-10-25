export function mapUser(row) {
  if (!row) return null;

  return {
    id: row.pk_id,
    nomeCompleto: row.nome_completo,
    email: row.email,
    cpf: row.cpf,
    dataNascimento: row.data_nascimento,
    celular: row.celular,
    telefone: row.telefone,
    genero: row.genero,
    ativo: Boolean(row.ativo),
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

export function mapProduct(row) {
  if (!row) return null;

  return {
    id: row.pk_id,
    categoriaId: row.fk_categoria,
    categoria: row.categoria_nome,
    categoriaSlug: row.categoria_slug,
    nome: row.nome,
    slug: row.slug,
    subtitulo: row.subtitulo,
    descricao: row.descricao,
    precoCentavos: row.preco_centavos,
    estoque: row.estoque,
    imagemUri: row.imagem_uri,
    destaque: Boolean(row.destaque),
    ativo: Boolean(row.ativo),
  };
}

export function mapAddress(row) {
  if (!row) return null;

  return {
    id: row.pk_id,
    apelido: row.apelido,
    destinatario: row.destinatario,
    cep: row.cep,
    logradouro: row.logradouro,
    numero: row.numero,
    complemento: row.complemento,
    bairro: row.bairro,
    cidade: row.cidade,
    uf: row.uf,
    referencia: row.referencia,
    padrao: Boolean(row.padrao),
  };
}

export function mapPaymentMethod(row) {
  if (!row) return null;

  return {
    id: row.pk_id,
    apelido: row.apelido,
    bandeira: row.bandeira,
    ultimosDigitos: row.ultimos_digitos,
    mesExpiracao: row.mes_expiracao,
    anoExpiracao: row.ano_expiracao,
    padrao: Boolean(row.padrao),
  };
}

export function mapOrder(row, items = []) {
  return {
    id: row.pk_id,
    status: row.status,
    subtotalCentavos: row.subtotal_centavos,
    freteCentavos: row.frete_centavos,
    totalCentavos: row.total_centavos,
    enderecoEntrega: {
      destinatario: row.destinatario,
      cep: row.cep,
      logradouro: row.logradouro,
      numero: row.numero,
      complemento: row.complemento,
      bairro: row.bairro,
      cidade: row.cidade,
      uf: row.uf,
    },
    pagamentoDescricao: row.pagamento_descricao,
    itens: items.map((item) => ({
      id: item.pk_id,
      produtoId: item.fk_produto,
      nomeProduto: item.nome_produto,
      precoUnitarioCentavos: item.preco_unitario_centavos,
      quantidade: item.quantidade,
      subtotalCentavos: item.subtotal_centavos,
    })),
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}
