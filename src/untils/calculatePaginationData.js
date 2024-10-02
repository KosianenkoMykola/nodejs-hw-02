const calculatePaginationData = ({ count, perPage, page }) => {
    const totalPage = Math.ceil(count / perPage);
    const hasNextPage = page < totalPage;
    const hasPrevPage = page !== 1;
  
    return {
      totalPage,
      hasPrevPage,
      hasNextPage,
    };
  };
  
  export default calculatePaginationData;