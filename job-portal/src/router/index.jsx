import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const RouterContext = createContext(null);
const RouteParamsContext = createContext({});

// Helper: match route pattern like "/jobs/:id" against actual pathname like "/jobs/job-1"
function matchPath(pattern, pathname) {
  if (pattern === '*' || pattern === '/*') {
    return { matches: true, params: {} };
  }

  // Normalize leading/trailing slashes
  const cleanPattern = pattern.replace(/^\/+|\/+$/g, '');
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');

  if (cleanPattern === cleanPath) {
    return { matches: true, params: {} };
  }

  const patternSegments = cleanPattern ? cleanPattern.split('/') : [];
  const pathSegments = cleanPath ? cleanPath.split('/') : [];

  if (patternSegments.length !== pathSegments.length) {
    return { matches: false, params: {} };
  }

  const params = {};
  for (let i = 0; i < patternSegments.length; i++) {
    const pSeg = patternSegments[i];
    const aSeg = pathSegments[i];

    if (pSeg.startsWith(':')) {
      const paramName = pSeg.slice(1);
      params[paramName] = decodeURIComponent(aSeg);
    } else if (pSeg !== aSeg) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

const getSubdir = () => {
  const p = typeof window !== 'undefined' ? window.location.pathname : '';
  if (p.toLowerCase().startsWith('/job-portal')) return '/job-portal';
  return '';
};

const normalizeAppPath = (pathname) => {
  const sub = getSubdir();
  if (sub && pathname && pathname.toLowerCase().startsWith(sub.toLowerCase())) {
    return pathname.slice(sub.length) || '/';
  }
  return pathname || '/';
};

export function BrowserRouter({ children }) {
  const [currentLocation, setCurrentLocation] = useState(() => ({
    pathname: normalizeAppPath(window.location.pathname),
    search: window.location.search || '',
    hash: window.location.hash || ''
  }));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentLocation({
        pathname: normalizeAppPath(window.location.pathname),
        search: window.location.search || '',
        hash: window.location.hash || ''
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      window.history.go(to);
      return;
    }

    let nextPath = to;
    if (typeof to === 'object') {
      nextPath = (to.pathname || '/') + (to.search || '') + (to.hash || '');
    }

    const sub = getSubdir();
    const fullPath = (sub && nextPath.startsWith('/') && !nextPath.startsWith(sub))
      ? `${sub}${nextPath}`
      : nextPath;

    if (options.replace) {
      window.history.replaceState(null, '', fullPath);
    } else {
      window.history.pushState(null, '', fullPath);
    }

    setCurrentLocation({
      pathname: normalizeAppPath(window.location.pathname),
      search: window.location.search || '',
      hash: window.location.hash || ''
    });

    if (!options.preventScrollReset) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const contextValue = useMemo(() => ({
    pathname: currentLocation.pathname,
    search: currentLocation.search,
    hash: currentLocation.hash,
    navigate
  }), [currentLocation.pathname, currentLocation.search, currentLocation.hash, navigate]);

  return (
    <RouterContext.Provider value={contextValue}>
      {children}
    </RouterContext.Provider>
  );
}

export function Routes({ children }) {
  const router = useContext(RouterContext);
  if (!router) {
    throw new Error('Routes must be used within a BrowserRouter');
  }

  const { pathname } = router;
  const childArray = React.Children.toArray(children);

  let matchedElement = null;
  let matchedParams = {};

  for (const child of childArray) {
    if (!React.isValidElement(child)) continue;
    const { path, element } = child.props;

    const { matches, params } = matchPath(path, pathname);
    if (matches) {
      matchedElement = element;
      matchedParams = params;
      break;
    }
  }

  return (
    <RouteParamsContext.Provider value={matchedParams}>
      {matchedElement}
    </RouteParamsContext.Provider>
  );
}

export function Route({ path, element }) {
  return null; // Route is only a configuration descriptor for Routes
}

export function Link({ to, replace = false, className = '', children, onClick, style, ...rest }) {
  const router = useContext(RouterContext);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      if (router) {
        router.navigate(to, { replace });
      } else {
        window.location.href = to;
      }
    }
  };

  const sub = getSubdir();
  const href = (sub && typeof to === 'string' && to.startsWith('/') && !to.startsWith(sub))
    ? `${sub}${to}`
    : to;

  return (
    <a href={href} onClick={handleClick} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}

export function NavLink({ to, className = '', activeClassName = 'active', children, ...rest }) {
  const router = useContext(RouterContext);
  const isActive = router ? router.pathname === to : false;

  const resolvedClassName = typeof className === 'function'
    ? className({ isActive })
    : `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <Link to={to} className={resolvedClassName} {...rest}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  );
}

export function useNavigate() {
  const router = useContext(RouterContext);
  if (!router) {
    return (to) => { window.location.href = to; };
  }
  return router.navigate;
}

export function useLocation() {
  const router = useContext(RouterContext);
  if (!router) {
    return { pathname: window.location.pathname, search: window.location.search, hash: window.location.hash };
  }
  return {
    pathname: router.pathname,
    search: router.search,
    hash: router.hash
  };
}

export function useParams() {
  return useContext(RouteParamsContext) || {};
}

export function useSearchParams() {
  const { search } = useLocation();
  const navigate = useNavigate();

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const setSearchParams = useCallback((nextParams) => {
    const params = new URLSearchParams(nextParams);
    const newSearch = params.toString() ? `?${params.toString()}` : '';
    navigate(`${window.location.pathname}${newSearch}`);
  }, [navigate]);

  return [searchParams, setSearchParams];
}

export function Navigate({ to, replace = true }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
}
