export const getPagination = (page, size) => {
  const limit = size ? +size : 4;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

export const getPagingData = (data, page, limit) => {
  const { count, rows } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(count / limit);

  return { totalItems: count, totalPages, currentPage, data: rows };
};
