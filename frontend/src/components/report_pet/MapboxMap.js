import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import TextInput from '../generic/TextInput';
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const styles = {
    categoryHeadline: {
        padding: '45px 0px 15px',
    }
}

const MapboxMap = (props) => {
    const { setLocation } = props;

    // mapContainer renders the map inside a specific DOM element
    const mapContainer = useRef(null);
    // The ref will prevent the map from reloading when the user interacts with the map
    const map = useRef(null);
    const [lng, setLng] = useState(null);
    const [lat, setLat] = useState(null);
    const [zoom, setZoom] = useState(9);
    const [places, setPlaces] = useState([]);
    // const [selectedPlace, setSelectedPlace] = useState([]);
    const [query, setQuery] = useState('');
    const [display, setDisplay] = useState('block');

    let DEBUG = false;

    function getLocation(lng, lat) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // Success:
                showPosition, 
                // Error:
                fallbackPosition, 
                {
                   enableHighAccuracy: true,
                   timeout: 5000,
                   maximumAge: 0
                });
        } else { 
            console.log('Geolocation is not supported by your browser.');
        }
    }
    
    function showPosition(position) {
        createMap(position.coords.longitude, position.coords.latitude);
    }

    function fallbackPosition() {
        // Helsinki fallback coords
        createMap(24.9344, 60.1797);
    }

    function changeCoordsByUser(map) {
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));

            // setLocation([[map.current.getCenter().lng.toFixed(4)], [map.current.getCenter().lat.toFixed(4)]]);
        });
    }

    function addNavigationButtons(map) {
        const nav = new mapboxgl.NavigationControl();
        map.current.addControl(nav, 'bottom-right');
    }

    function addMaker(map, lng, lat) {
        new mapboxgl.Marker({ 
            color: 'rgb(34, 102, 96)'
        })
        .setLngLat([lng, lat])
        .addTo(map.current);
    }

    function addFullscreenControl(map) {
        const fullscreen = new mapboxgl.FullscreenControl();
        map.current.addControl(fullscreen);
    }

    function addGeolocateControl(map) {
        const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
        });
        map.current.addControl(geolocate);
    }

    function addGeocoder(map) {
        // function coordinatesGeocoder(query) {
        //     // fetchSearchData(query);

        //     // Regex for lng and lat coords
        //     const matches = query.match(
        //         /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
        //     );

        //     if (!matches) {
        //         return null;
        //     }

        //     // Reverse geocoding, converting geographic coordinates into a text description
        //     function coordinateFeature(lng, lat) {
        //         return {
        //             center: [lng, lat],
        //             geometry: {
        //                 type: 'Point',
        //                 coordinates: [lng, lat]
        //             },
        //             place_name: 'Lat: ' + lat + ' Lng: ' + lng,
        //             place_type: ['coordinate'],
        //             properties: {},
        //             type: 'Feature'
        //         }
        //     }

        //     const coord1 = Number(matches[1]);
        //     const coord2 = Number(matches[2]);
        //     const geocodes = [];

        //     if (coord2 < -90 || coord2 > 90) {
        //         geocodes.push(coordinateFeature(coord2, coord1));
        //     }
                 
        //     if (geocodes.length === 0) {
        //         geocodes.push(coordinateFeature(coord1, coord2));
        //         geocodes.push(coordinateFeature(coord2, coord1));
        //     }
                 
        //     return geocodes;
        // }

        // Search location
        // const geocoder = new MapboxGeocoder({
        //     accessToken: mapboxgl.accessToken,
        //     localGeocoder: coordinatesGeocoder,
        //     mapboxgl: mapboxgl,
        //     marker: {
        //         color: 'rgb(34, 102, 96)',
        //         scale: 1.5
        //     },
        //     placeholder: 'Search location or coordinates',
        //     reverseGeocode: true
        // });

        // map.current.addControl(geocoder);
        
    }

    function createMap(lng, lat) {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            accessToken: mapboxgl.accessToken,
            container: mapContainer.current,
            style: 'mapbox://styles/l1ll4n3m/clqkvquob00mw01o939rncxn5',
            center: [lng, lat],
            zoom: zoom
        });

        changeCoordsByUser(map);
        addNavigationButtons(map);
        addGeocoder(map);
        addMaker(map, lng, lat);
        addFullscreenControl(map);
        addGeolocateControl(map);

        // const geocoder = new MapboxGeocoder({
        //     accessToken: mapboxgl.accessToken,
        //     types: 'poi',
        //     // see https://docs.mapbox.com/api/search/#geocoding-response-object for information about the schema of each response feature
        //     render: function (item) {
        //     // extract the item's maki icon or use a default
        //     const maki = item.properties.maki || 'marker';
        //     return `<div class='geocoder-dropdown-item'>
        //     <img class='geocoder-dropdown-icon' src='https://unpkg.com/@mapbox/maki@6.1.0/icons/${maki}-15.svg'>
        //     <span class='geocoder-dropdown-text'>
        //     ${item.text}
        //     </span>
        //     </div>`;
        //     },
        //     mapboxgl: mapboxgl
        // });

        // map.current.addControl(geocoder);

        // Clean up on unmount
        return () => map.current.remove();
    }

    const fetchPlaces = async(endpoint) => {
        const forwardGeocodingRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${endpoint}.json?access_token=${mapboxgl.accessToken}`);
        // const forwardGeocodingRes = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${endpoint}.json?access_token=${mapboxgl.accessToken}`);
        // console.log(forwardGeocodingRes)
        // const reverseGeocodingRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${endpoint}/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
        const data = await forwardGeocodingRes.json();
        // const data = await reverseGeocodingRes.json();

        setPlaces(data.features);
    }

    function handleChange(e) {
        setQuery(e.target.value);

        if (e.target.value) {
            fetchPlaces(query);
            setDisplay('block');
        } else {
            setPlaces('');
        }
    }

    useEffect(() => {
        getLocation();
        // createMap(lng, lat)
    }, []);

    useEffect(() => {
        fetchPlaces(query);
    }, [query]);


    return (
        <>
            <div className="sidebar" >
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className='map-container' />
                <div className='inputBox' style={{padding: '10px 0 0 0 !important'}}>
                    <div className='searchButton'>
                        <SearchIcon onChange={handleChange} />
                    </div>
                    <input 
                        className='formInput locationInput'
                        placeholder='search places' 
                        name='places' 
                        id='places' 
                        type='text'
                        value={query}
                        onChange={handleChange}
                    />
                </div>
            <div style={{display: display}}>
                {places && places.map(place => {
                    return (
                        <div 
                            className='locationSuggestion'
                            key={place.id}
                            onClick={() => {
                                setQuery(place.place_name);
                                setDisplay('none');
                                // setSelectedPlace(place), 
                                setLng(place.center[0]);
                                setLat(place.center[1]);
                                setLocation(`${place.center} ~~~ ${place.place_name}`);
                                // console.log(lng, lat)
                                // createMap(lng, lat)
                            }}>
                            <div className='locationSuggestionText'>{place.text}</div>
                            <p className='locationSuggestionName'>{place.place_name}</p>   
                        </div>
                    )
                })}
            </div>
        </>
    );
}
 
export default MapboxMap;