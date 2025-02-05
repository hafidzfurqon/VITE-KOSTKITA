export const paths = {
    tour: {
      root: `/tour`,
      new: `/tour/new`,
      details: (id) => `/tour/${id}`,
      edit: (id) => `/tour/edit/${id}`,
      demo: {
        details: (id) => `/tour/demo/${id}`,
        edit: (id) => `/tour/demo/edit/${id}`,
      },
    },
  };
  