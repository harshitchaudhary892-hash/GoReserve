import React, { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Place } from '../../types';
import { COLORS, SIZES, SPACING, RADIUS, SHADOWS } from '../../config/theme';
import { RatingBadge } from '../common/RatingBadge';
import { PriceRangeBadge } from '../common/PriceRangeBadge';
import { AvailabilityBadge } from '../common/AvailabilityBadge';
import { useAuth } from '../../contexts/AuthContext';
import { addToFavorites, removeFromFavorites } from '../../services/user';
import { useAppState } from '../../contexts/AppStateContext';
import { calculateDistance } from '../../hooks/useLocation';
const { width: screenWidth } = Dimensions.get('window');
const PH = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400';
interface PlaceCardProps { place: Place; variant?: 'horizontal'|'vertical'; showDistance?: boolean; }
export const PlaceCard: React.FC<PlaceCardProps> = memo(({ place, variant='horizontal', showDistance=true }) => {
  const nav = useNavigation<any>();
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { currentLocation } = useAppState();
  const isFav = userProfile?.favorites?.includes(place.id) ?? false;
  const dist = currentLocation ? calculateDistance(currentLocation.latitude,currentLocation.longitude,place.latitude,place.longitude) : null;
  const handlePress = useCallback(() => nav.navigate('PlaceDetails',{placeId:place.id,place}),[nav,place]);
  const toggleFav = useCallback(async() => { if(!user)return; try{if(isFav)await removeFromFavorites(user.uid,place.id);else await addToFavorites(user.uid,place.id);await refreshUserProfile();}catch(e){} },[user,isFav,place.id]);
  if(variant==='vertical') return (
    <TouchableOpacity style={styles.vc} onPress={handlePress} activeOpacity={0.85}>
      <View style={styles.vi}><Image source={{uri:place.imageUrl||PH}} style={styles.vm} resizeMode="cover" /><TouchableOpacity style={styles.fb} onPress={toggleFav} hitSlop={{top:8,bottom:8,left:8,right:8}}><Ionicons name={isFav?'heart':'heart-outline'} size={22} color={isFav?COLORS.heart:COLORS.white} /></TouchableOpacity><View style={styles.vr}><RatingBadge rating={place.rating} size="medium" /></View></View>
      <View style={styles.vx}><Text style={styles.n} numberOfLines={1}>{place.name}</Text><View style={styles.vi2}><Text style={styles.a} numberOfLines={1}>{place.city}, {place.state}</Text>{dist!==null&&showDistance&&<Text style={styles.d}>{dist.toFixed(1)} km</Text>}</View><View style={styles.bd}><PriceRangeBadge priceRange={place.priceRange} /><AvailabilityBadge availability={place.availability} /></View></View>
    </TouchableOpacity>
  );
  return (
    <TouchableOpacity style={styles.hc} onPress={handlePress} activeOpacity={0.85}>
      <Image source={{uri:place.imageUrl||PH}} style={styles.hi} resizeMode="cover" />
      <View style={styles.hx}>
        <View style={styles.hh}><Text style={styles.n} numberOfLines={1}>{place.name}</Text><TouchableOpacity onPress={toggleFav} hitSlop={{top:8,bottom:8,left:8,right:8}}><Ionicons name={isFav?'heart':'heart-outline'} size={20} color={isFav?COLORS.heart:COLORS.textLight} /></TouchableOpacity></View>
        <Text style={styles.a} numberOfLines={1}><Ionicons name="location-outline" size={12} color={COLORS.textSecondary} /> {place.address}</Text>
        <View style={styles.hi2}><RatingBadge rating={place.rating} size="small" /><PriceRangeBadge priceRange={place.priceRange} size="small" /><AvailabilityBadge availability={place.availability} size="small" />{dist!==null&&showDistance&&<Text style={styles.dt}>{dist.toFixed(1)} km</Text>}</View>
        {place.amenities&&place.amenities.length>0&&<Text style={styles.at} numberOfLines={1}>{place.amenities.slice(0,3).join(' • ')}</Text>}
      </View>
    </TouchableOpacity>
  );
});
const styles = StyleSheet.create({
  hc:{flexDirection:'row',backgroundColor:COLORS.surface,borderRadius:RADIUS.md,marginHorizontal:SPACING.base,marginVertical:SPACING.xs,...SHADOWS.medium,overflow:'hidden'},
  hi:{width:120,height:120,borderTopLeftRadius:RADIUS.md,borderBottomLeftRadius:RADIUS.md},
  hx:{flex:1,padding:SPACING.md,justifyContent:'space-between'},hh:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  hi2:{flexDirection:'row',alignItems:'center',gap:6,flexWrap:'wrap'},at:{fontSize:SIZES.xs,color:COLORS.textSecondary,marginTop:2},dt:{fontSize:SIZES.xs,color:COLORS.secondary,fontWeight:'600'},
  vc:{backgroundColor:COLORS.surface,borderRadius:RADIUS.lg,width:screenWidth*0.45,marginRight:SPACING.md,...SHADOWS.medium,overflow:'hidden'},
  vi:{position:'relative'},vm:{width:'100%',height:140,borderTopLeftRadius:RADIUS.lg,borderTopRightRadius:RADIUS.lg},
  vx:{padding:SPACING.md},vi2:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:2},
  fb:{position:'absolute',top:8,right:8,width:34,height:34,borderRadius:17,backgroundColor:'rgba(0,0,0,0.3)',alignItems:'center',justifyContent:'center'},
  vr:{position:'absolute',bottom:8,left:8},
  n:{fontSize:SIZES.base,fontWeight:'700',color:COLORS.text,flex:1},a:{fontSize:SIZES.sm,color:COLORS.textSecondary,marginTop:2},
  d:{fontSize:SIZES.xs,color:COLORS.secondary,fontWeight:'600'},bd:{flexDirection:'row',alignItems:'center',gap:6,marginTop:6},
});
