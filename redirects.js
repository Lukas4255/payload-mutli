const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const wwwRedirect = {
    source: '/:path*',
    destination: 'https://dorpshuistavenu.nl/:path*',
    has: [
      {
        type: 'host',
        value: 'www.dorpshuistavenu.nl',
      },
    ],
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, wwwRedirect]

  return redirects
}

export default redirects
