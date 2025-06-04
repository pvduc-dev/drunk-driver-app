import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Address, Location } from '@lib/db-lib';
import { firstValueFrom } from 'rxjs';
import { Path } from '@lib/db-lib';

@Injectable()
export class GeoLibService {
  constructor(private readonly httpService: HttpService) {}
  async getDirection(
    from: Location,
    to: Location,
  ): Promise<{ path: Path; distance: number }> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://rsapi.goong.io/direction`, {
        params: {
          origin: `${from?.coordinates?.[1]},${from?.coordinates?.[0]}`,
          destination: `${to?.coordinates?.[1]},${to?.coordinates?.[0]}`,
          mode: 'car',
          alternatives: false,
          steps: true,
          geometry: 'false',
          language: 'vi',
        },
      }),
    );
    if (!data.routes?.length) {
      throw new NotFoundException('Cannot find direction');
    }

    const route = data.routes[0];

    if (!route.legs?.length) {
      throw new NotFoundException('Invalid route data');
    }
    return {
      path: {
        type: 'LineString',
        coordinates: route.legs[0].steps.map((step) => [
          step.start_location.lng,
          step.start_location.lat,
        ]),
      },
      distance: route.legs[0].distance.value,
    };
  }

  async getGeocode(location: Location): Promise<Address> {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://rsapi.goong.io/geocode`, {
        params: {
          latlng: `${location?.coordinates?.[1]},${location?.coordinates?.[0]}`,
        },
      }),
    );
    if (!data.results?.length) {
      throw new NotFoundException('Cannot find location');
    }
    console.log(data.results);
    const result = data.results[0];
    const address: Address = {
      description: result.formatted_address,
      name: result.name,
      location: {
        type: 'Point',
        coordinates: [
          result.geometry.location.lng,
          result.geometry.location.lat,
        ],
      },
    };
    return address;
  }

  async getPlaces(query: string): Promise<Record<string, string | Address>[]> {
    const { data } = await firstValueFrom(
      this.httpService.get(`/Place/Autocomplete`, {
        params: {
          input: query,
        },
      }),
    );
    if (!data.predictions?.length) {
      throw new NotFoundException('Cannot find places');
    }
    return data.predictions.map((prediction) => {
      const address: Address = {
        description: prediction.description,
        name: prediction.structured_formatting.main_text,
      };
      return {
        placeId: prediction.place_id,
        address,
      };
    });
  }

  async getPlace(placeId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`/Place/Detail`, {
        params: {
          place_id: placeId,
        },
      }),
    );
    if (!data.result) {
      throw new NotFoundException('Cannot find place');
    }

    const result = data.result;
    const address: Address = {
      description: result.formatted_address,
      name: result.name,
      location: {
        type: 'Point',
        coordinates: [
          result.geometry.location.lng,
          result.geometry.location.lat,
        ],
      },
    };
    return address;
  }
}
