import { Address } from '@lib/db-lib';

export class GetPlacesRequestDto {
  query: string;
}

export class GetPlacesResponseDto {
  placeId: string;
  address: Address;
}

export class GetPlaceRequestDto {
  placeId: string;
}

export class GetPlaceResponseDto {
  address: Address;
}
