import { Place } from '../types';
import { calculateDistance } from '../hooks/useLocation';
export const formatPhoneNumber = (p: string): string => { if(!p)return''; const c=p.replace(/\D/g,''); if(c.length===10)return `(${c.slice(0,3)}) ${c.slice(3,6)}-${c.slice(6)}`; return p; };
export const getInitials = (n: string): string => { if(!n)return'?'; return n.split(' ').map(p=>p.charAt(0).toUpperCase()).join('').slice(0,2); };
export const sortPlaces = (places: Place[], sortBy: string, order: 'asc'|'desc', ul?: number, ulo?: number): Place[] => {
  const s = [...places];
  s.sort((a,b) => { let cmp = 0;
    switch(sortBy) { case 'rating': cmp=a.rating-b.rating; break; case 'price': const po: Record<string,number>={'$':1,'$$':2,'$$$':3,'$$$$':4}; cmp=(po[a.priceRange]||0)-(po[b.priceRange]||0); break; case 'name': cmp=a.name.localeCompare(b.name); break; case 'distance': if(ul!==undefined&&ulo!==undefined) cmp=calculateDistance(ul,ulo,a.latitude,a.longitude)-calculateDistance(ul,ulo,b.latitude,b.longitude); break; }
    return order==='desc'?-cmp:cmp;
  });
  return s;
};
export const filterPlaces = (places: Place[], f: { category?: string; priceRange?: string; availability?: string; minRating?: number; amenities?: string[]; maxDistance?: number; userLat?: number; userLon?: number; }): Place[] => {
  return places.filter(p => {
    if(f.category&&f.category!=='All'&&p.category!==f.category) return false;
    if(f.priceRange&&f.priceRange!=='All'&&p.priceRange!==f.priceRange) return false;
    if(f.availability&&f.availability!=='All'&&p.availability!==f.availability) return false;
    if(f.minRating&&p.rating<f.minRating) return false;
    if(f.amenities&&f.amenities.length>0&&!f.amenities.every(a=>p.amenities.includes(a))) return false;
    if(f.maxDistance&&f.maxDistance>0&&f.userLat!==undefined&&f.userLon!==undefined) { if(calculateDistance(f.userLat,f.userLon,p.latitude,p.longitude)>f.maxDistance) return false; }
    return true;
  });
};
