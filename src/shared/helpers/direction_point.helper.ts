import { decode } from "@googlemaps/polyline-codec";
import { IMilestone } from "../interfaces/milestone.interface";

export class DirectionPointHelper {
  static coordinatesInOrderSelective(milestones: Array<IMilestone>) {
    const arrSelectives = [];
    for (let [i, milestone] of milestones.entries()) {
      if (milestones[i + 1]) {
        const position = milestone.coordinates;

        const nextPosition = milestones[i + 1]?.coordinates || null;
        arrSelectives.push({
          origin: position,
          destination: nextPosition
        });
      }
    }
    return arrSelectives;
  }

  static legsPathInOrderSelective(response) {
    const legs = response.routes[0].legs;
    const arrPolyline = [];
    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      for (let j = 0; j < leg.steps.length; j++) {
        const steps = leg.steps[j];
        const decodePolyline = decode(steps.polyline.points);

        for (let k = 0; k < decodePolyline.length; k++) {
          const decoded = decodePolyline[k];
          const newLatLng = {
            lat: decoded[0],
            lng: decoded[1]
          }
          arrPolyline.push(newLatLng);
        }
      }
    }
    return arrPolyline;
  }
}