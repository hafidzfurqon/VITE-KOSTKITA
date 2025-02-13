export const paths = {
    property: {
      root: `/property`,
      new: `/property/new`,
      details: (id) => `/property/${id}`,
      slug: (slug) => `/property/${slug}`,
      edit: (id) => `/property/edit/${id}`,
      demo: {
        details: (id) => `/property/demo/${id}`,
        edit: (id) => `/property/demo/edit/${id}`,
      },
    },
  };
  