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

  // Tenants are resolved by their apex domain, so send every www host to its apex.
  const wwwRedirect = {
    source: '/:path*',
    destination: 'https://:domain/:path*',
    has: [
      {
        type: 'host',
        value: 'www\\.(?<domain>.+)',
      },
    ],
    permanent: true,
  }

  const redirects = [internetExplorerRedirect, wwwRedirect]

  return redirects
}

export default redirects
