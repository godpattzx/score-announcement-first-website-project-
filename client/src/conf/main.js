const conf = {
    apiUrlPrefix: 'http://localhost:1337/api',
    loginEndpoint: '/auth/local',
    jwtUserRoleEndpoint: '/users/me?populate=role',
    jwtSessionStorageKey: 'auth.jwt',
    subjectsEndpoint: '/subjects', 
    viewsEndpoint: '/views',
    googleConnectEndpoint: '/connect/google',

  }
  
  export default conf;
  