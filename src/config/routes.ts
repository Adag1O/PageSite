// Configuración centralizada de rutas del sistema
export const ROUTES_CONFIG = {
  // Configuración del subdominio
  SUBDOMAIN: {
    name: 'demo',
    alternativeName: 'Demo',
    basePath: '/Demos'
  },
  
  // Rutas principales del sitio
  MAIN_ROUTES: {
    home: '/',
    demos: '/Demos/',
    contact: '/#ContactoForm'
  },
  
  // Demos disponibles
  DEMO_ROUTES: [
    {
      id: 'linktree',
      name: 'LinkTree Demo',
      path: '/LinkTree',
      fullPath: '/Demos/LinkTree',
      description: 'Interactive LinkTree style page demo',
      category: 'Social',
      tags: ['Social', 'Links', 'Profile'],
      image: '/demo-linktree.png'
    },
    {
      id: 'wedding',
      name: 'Wedding Dreams',
      path: '/Wedding',
      fullPath: '/Demos/Wedding',
      description: 'Beautiful wedding website template with carousel',
      category: 'Event',
      tags: ['Wedding', 'Event', 'Template'],
      image: '/demo-wedding.png'
    }
    // Agregar más demos aquí
  ],
  
  // Mapeo de URLs para desarrollo
  DEV_URLS: {
    main: 'http://localhost:4321',
    demos: 'http://localhost:4321/Demos',
    subdomain: 'http://demo.localhost:4321'
  },
  
  // Mapeo de URLs para producción
  PROD_URLS: {
    main: 'https://adagi0.com',
    demos: 'https://adagi0.com/Demos',
    subdomain: 'https://demo.adagi0.com'
  }
};

// Funciones utilitarias para manejo de rutas
export const RouteUtils = {
  // Verificar si es subdominio demo
  isDemoSubdomain: (hostname: string): boolean => {
    const parts = hostname.split('.');
    const subdomain = parts.length > 2 ? parts[0] : null;
    return subdomain === ROUTES_CONFIG.SUBDOMAIN.name || 
           subdomain === ROUTES_CONFIG.SUBDOMAIN.alternativeName;
  },
  
  // Obtener ruta completa para demo
  getDemoRoute: (demoId: string, isSubdomain: boolean = false): string => {
    const demo = ROUTES_CONFIG.DEMO_ROUTES.find(d => d.id === demoId);
    if (!demo) return '/Demos/';
    
    return isSubdomain ? demo.path : demo.fullPath;
  },
  
  // Generar URL completa según el entorno
  generateURL: (path: string, isSubdomain: boolean = false, isDev: boolean = true): string => {
    const baseURL = isDev 
      ? (isSubdomain ? ROUTES_CONFIG.DEV_URLS.subdomain : ROUTES_CONFIG.DEV_URLS.main)
      : (isSubdomain ? ROUTES_CONFIG.PROD_URLS.subdomain : ROUTES_CONFIG.PROD_URLS.main);
    
    return `${baseURL}${path}`;
  }
};
