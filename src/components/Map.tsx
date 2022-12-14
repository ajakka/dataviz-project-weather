import "./Map.css";
import React from "react";
import cities from "../assets/cities.json";
import regions from "../assets/regions.json";
import * as d3 from "d3";
import { GeoGeometryObjects } from "d3";
import Border from "./Border";

interface MapProps {
  onCityPressed: (city: any) => void;
}

const Map = (props: MapProps) => {
  const width = 600;
  const height = 600;

  /**
   * Renders the regions stored as geojson
   * @param svg
   */
  const renderRegions = (
    svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  ) => {
    const projection = d3.geoMercator();
    projection.fitSize([width, height], regions as GeoGeometryObjects);

    const path = d3.geoPath().projection(projection);

    const regionsGroup = svg
      .append("g")
      .attr("id", "regions")
      .attr("cursor", "pointer")
      .selectAll("path")
      .data(regions.features)
      .join("path")
      .attr("class", "country")
      .attr("d", path as any)
      .attr("fill", "#ECF87F")
      .style("stroke", "#3D550C")
      .on("click", onRegionClicked);

    regionsGroup.append("title").text((d) => d.properties.region);

    const zoomSettings = {
      duration: 1000, // zoom duration in miliseconds
      ease: d3.easeCubicOut, // zoom animation starts fast and slows as it finishes
      level: 3, // how close to zoom on clicked item
      data: undefined,
    };

    function onRegionClicked(event: any, d: any) {
      let x, y, zoom, visibility;

      if (d && zoomSettings.data !== d) {
        const sntd = path.centroid(d);
        x = sntd[0];
        y = sntd[1];
        zoom = zoomSettings.level;
        visibility = "visible";
        zoomSettings.data = d;
      } else {
        x = width / 2;
        y = height / 2;
        zoom = 1;
        visibility = "hidden";
        zoomSettings.data = undefined;
      }

      svg
        .transition()
        .duration(zoomSettings.duration)
        .ease(zoomSettings.ease)
        .attr(
          "transform",
          `translate(${width / 2}, ${height / 2})` +
            `scale(${zoom})` +
            `translate(${-x}, ${-y})`
        );
      svg.select("#cities").attr("visibility", visibility);
    }
  };

  /**
   * Renders all the data points of cities stored
   * as markers on the map
   * @param svg
   */
  const renderCities = (
    svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>
  ) => {
    console.log("cities", cities.length);

    const { xScale, yScale } = getXYScale();
    const citiesGroup = svg
      .append("g")
      .attr("id", "cities")
      .attr("visibility", "hidden")
      .selectAll("path")
      .data(cities)
      .join((elem) =>
        elem
          .append("path")
          .attr("class", "marker")
          .attr(
            "d",
            "M0,0l-8.8-17.7C-12.1-24.3-7.4-32,0-32h0c7.4,0,12.1,7.7,8.8,14.3L0,0z"
          )
          .attr("transform", (city) => {
            return `translate(${xScale(city.longitude)}, ${yScale(
              city.latitude
            )}) scale(.25)`;
          })
      )
      .on("click", onCityClicked);

    citiesGroup
      .append("title")
      .text((d) => `${d.city_name}\n${d.city_name_ar}`);

    function onCityClicked(e: any, d: any) {
      props.onCityPressed(d);
    }
  };

  /**
   * Takes the minimum and maximum latitude and longitude
   * and tries to fit them into the canvas's width and height
   *
   * @returns xScale Scaler for the x axis
   * @returns yScale Scaler for the y axis
   */
  const getXYScale = () => {
    let lats: number[] = [];
    let lons: number[] = [];

    cities.map((ct) => {
      lats.push(ct.latitude);
      lons.push(ct.longitude);
    });

    let minLat = d3.min(lats) || 20.833322;
    let maxLat = d3.max(lats) || 35.9055586;

    let minLon = d3.min(lons) || -17.089121;
    let maxLon = d3.max(lons) || -1.22855;

    // Longtitude
    const xScale = d3
      .scaleLinear()
      .domain([minLon * 1.045, maxLon * 0.3])
      .range([0, width]);

    // Latitude
    const yScale = d3
      .scaleLinear()
      .domain([minLat, maxLat * 1.0085])
      .range([height, 0]);

    return { xScale, yScale };
  };

  React.useEffect(() => {
    const svg = d3
      .select("#map")
      .append("svg")
      .attr("id", "morocco-map")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .append("g");

    renderRegions(svg);
    renderCities(svg);

    return () => {
      d3.select("#morocco-map").remove();
    };
  }, [cities]);

  return (
    <Border>
      <h4> Click on any region to display locations</h4>
      <div id="map">
        {/* <svg id="morocco-map" style={{ stroke: "white", strokeWidth: 1 }}></svg> */}
      </div>
    </Border>
  );
};

export default Map;
