export const format = temp => {
  const data = temp.result[0];
  const count = data.length;
  const total = temp.result[1];
  const pageCount = Math.ceil(total / temp.limit);
  return {
    count,
    total,
    page: temp.page,
    pageCount,
    data
  };
};
