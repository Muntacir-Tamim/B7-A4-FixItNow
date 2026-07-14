import { AvailabilityDay } from "../../../generated/prisma/enums";

export interface ICreateTechnicianProfilePayload {
  bio?: string;
  skills?: string[];
  experience?: number;
  location?: string;
  profilePhoto?: string;
}

export interface IUpdateTechnicianProfilePayload {
  bio?: string;
  skills?: string[];
  experience?: number;
  location?: string;
  profilePhoto?: string;
}

export interface IAvailabilitySlot {
  day: AvailabilityDay;
  startTime: string;
  endTime: string;
}

export interface IUpdateAvailabilityPayload {
  slots: IAvailabilitySlot[];
}

export interface ITechnicianQuery {
  searchTerm?: string;
  page?: string;
  limit?: string;
  location?: string;
  skills?: string;
}
