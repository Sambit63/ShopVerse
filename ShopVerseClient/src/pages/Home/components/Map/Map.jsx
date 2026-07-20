import { useEffect, useRef } from "react";
import "./Map.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaHome, FaLocationArrow } from "react-icons/fa";
import { MdMyLocation } from "react-icons/md";
const Map = () => {
  const [searchParams] = useSearchParams();
  const destination = {
    lat: Number(searchParams.get("lat")),
    lon: Number(searchParams.get("lon")),
    name: searchParams.get("name"),
  };
  console.log(destination);
  const navigate = useNavigate();
  const currentLocation = useRef({
    lat: null,
    lon: null,
  });
  const mapCreated = useRef(false);

  useEffect(() => {
    if (mapCreated.current) return;

    mapCreated.current = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          currentLocation.current.lat = position.coords.latitude;
          currentLocation.current.lon = position.coords.longitude;

          createMap();
          if (destination) getRoute();
        },
        () => {
          createMap();
        },
      );
    } else {
      createMap();
    }
  }, []);

  //   Map Creation
  const createMap = () => {
    tmpl.Map.createMap({
      target: "targetDivId",
    });
  };

  //   Get destination Route from API
  const getRoute = async () => {
    console.log("Get route bedin called");
    tmpl.Overlay.create({
      map: layoutMapObjectAPI,
      features: [
        {
          id: 1,
          label: "start",
          label_color: "#FF00FF",
          img_url: "/GISClientServices/v4.0.0/start_point.png",
          lat: currentLocation.current.lat,
          lon: currentLocation.current.lon,
        },
        {
          id: 2,
          label: "end",
          label_color: "#FF00FF",
          img_url: "/GISClientServices/v4.0.0/2.png",
          lat: destination.lat,
          lon: destination.lon,
        },
      ],
      layer: "Direction Layer",
      layerSwitcher: false,
    });
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${currentLocation.current.lon},${currentLocation.current.lat};${destination.lon},${destination.lat}?overview=full&geometries=geojson`;

      const response = await fetch(url);

      const data = await response.json();

      drawRoute(data.routes[0].geometry.coordinates);
    } catch (err) {
      console.error(err);
    }
  };

  //   GEOJSon To WKT And Plot Route
  const drawRoute = (coordinates) => {
    const lineString =
      "LINESTRING(" +
      coordinates.map(([lon, lat]) => `${lon} ${lat}`).join(",") +
      ")";
    tmpl.Overlay.addGeometryWithColor({
      map: layoutMapObjectAPI,
      geometry: lineString,
      properties: {
        id: 1,
        name: "path",
        type: "visited",
      },
      layer: "route1",
      color: "#1E88E5",
      borderWidth: 3,
    });
  };

  //   Get The current location
  const myLocation = () => {
    tmpl.Overlay.removeMarker({
      map: layoutMapObjectAPI,
      id: "Current Location",
    });
    tmpl.Zoom.toXYcustomZoom({
      map: layoutMapObjectAPI,
      latitude: currentLocation.current.lat,
      longitude: currentLocation.current.lon,
      zoom: 19,
    });
    tmpl.Overlay.addMarker({
      map: layoutMapObjectAPI,
      point: [currentLocation.current.lon, currentLocation.current.lat],
      id: "Current Location",
      img_url: "/GISClientServices/v4.0.0/2.png",
      height: 30,
      width: 20,
      offset: [0, -20],
    });
  };

  const addPOI = () => {
    console.log(currentLocation.current.lat);
    console.log(currentLocation.current.lon);

    // Add POI
  };

  const trackVehicle = () => {
    console.log(currentLocation.current.lat);
    console.log(currentLocation.current.lon);

    // Tracking logic
  };

  return (
    <div className="map-page">
      <button className="home-btn" onClick={() => navigate("/")} title="Home">
        <FaHome />
      </button>

      <button
        className="location-btn"
        onClick={myLocation}
        title="Current Location"
      >
        <MdMyLocation />
      </button>
      <div id="targetDivId" className="map-container"></div>
    </div>
  );
};

export default Map;
