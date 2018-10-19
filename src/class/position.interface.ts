import { DateTime } from "ionic-angular";

export interface Position {
    gpsPositionLatitude: string;
    gpsPositionLongitude: string;
    gpsPositionDate : DateTime;
  }